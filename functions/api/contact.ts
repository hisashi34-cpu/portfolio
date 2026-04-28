/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * お問い合わせフォームの送信を受け取り、Resend 経由で Gmail に転送します。
 *
 * 必要な環境変数（Cloudflare Pages の Settings > Environment variables で設定）:
 *   RESEND_API_KEY  - Resend の API キー (https://resend.com/)
 *   TO_EMAIL        - 受信するメールアドレス（例: your-email@example.com）
 *   FROM_EMAIL      - 送信元アドレス（Resendで認証済みドメインのアドレス）
 *                     例: contact@yourdomain.com
 *                     ※ 認証ドメインがない場合は "onboarding@resend.dev" を仮で使用可
 */

interface Env {
  RESEND_API_KEY: string;
  TO_EMAIL: string;
  FROM_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

interface ContactPayload {
  name?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
  website?: string; // honeypot
  "cf-turnstile-response"?: string;
}

const SUBJECT_LABELS: Record<string, string> = {
  web: "Web開発のご依頼",
  system: "業務システム開発のご依頼",
  consulting: "技術コンサルティングのご相談",
  other: "その他のお問い合わせ",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "リクエスト形式が不正です" }, 400);
  }

  // honeypot — bots fill it; humans don't
  if (payload.website && payload.website.trim().length > 0) {
    return json({ ok: true });
  }

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const company = (payload.company ?? "").trim();
  const subjectKey = (payload.subject ?? "").trim();
  const message = (payload.message ?? "").trim();

  if (!name || !email || !subjectKey || !message) {
    return json({ error: "必須項目が入力されていません" }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "メールアドレスの形式が不正です" }, 400);
  }

  if (message.length > 5000) {
    return json({ error: "メッセージが長すぎます（5000文字以内）" }, 400);
  }

  // Cloudflare Turnstile 検証（TURNSTILE_SECRET_KEY が設定されている場合のみ）
  if (env.TURNSTILE_SECRET_KEY) {
    const token = (payload["cf-turnstile-response"] ?? "").trim();
    if (!token) {
      return json({ error: "認証チェックが完了していません" }, 400);
    }
    const ip = request.headers.get("CF-Connecting-IP");
    const ok = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip);
    if (!ok) {
      return json({ error: "認証に失敗しました。再度お試しください" }, 403);
    }
  }

  const subjectLabel = SUBJECT_LABELS[subjectKey] ?? "お問い合わせ";

  if (!env.RESEND_API_KEY || !env.TO_EMAIL) {
    return json({ error: "サーバー設定が不完全です（環境変数未設定）" }, 500);
  }

  const fromEmail = env.FROM_EMAIL ?? "onboarding@resend.dev";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0a0a0a">
      <h2 style="margin:0 0 16px;font-size:18px;border-bottom:2px solid #4f46e5;padding-bottom:8px">
        新規お問い合わせ: ${escapeHtml(subjectLabel)}
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#71717a;width:120px">お名前</td><td style="padding:8px 0">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px 0;color:#71717a">メール</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${company ? `<tr><td style="padding:8px 0;color:#71717a">会社名</td><td style="padding:8px 0">${escapeHtml(company)}</td></tr>` : ""}
        <tr><td style="padding:8px 0;color:#71717a">ご相談内容</td><td style="padding:8px 0">${escapeHtml(subjectLabel)}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#fafafa;border-radius:8px;white-space:pre-wrap;font-size:14px;line-height:1.7">${escapeHtml(message)}</div>
      <p style="margin-top:24px;font-size:12px;color:#a1a1aa">
        このメールはポートフォリオサイトのお問い合わせフォームから自動送信されました。
      </p>
    </div>
  `;

  const text = [
    `新規お問い合わせ: ${subjectLabel}`,
    "",
    `お名前: ${name}`,
    `メール: ${email}`,
    company ? `会社名: ${company}` : "",
    `ご相談内容: ${subjectLabel}`,
    "",
    "--- メッセージ ---",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Portfolio Contact <${fromEmail}>`,
        to: [env.TO_EMAIL],
        reply_to: email,
        subject: `【お問い合わせ】${subjectLabel} - ${name} 様`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend API error:", res.status, body);
      return json({ error: "メール送信に失敗しました" }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("Contact handler error:", err);
    return json({ error: "サーバーエラーが発生しました" }, 500);
  }
};

export const onRequest: PagesFunction = async () => {
  return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
};
