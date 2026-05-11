/**
 * Cloudflare Pages Function: POST /api/line-webhook
 *
 * 居酒屋の公式LINE向けガチャ Bot の Webhook 受け口。
 *
 * 主な責務:
 *   1. LINE Messaging API の `x-line-signature` (HMAC-SHA256) を検証
 *   2. 「ガチャ」「がちゃ」「gacha」と書かれたテキスト/フォロー時に抽選を実行
 *   3. 1日1回の抽選制限（Workers KV「GACHA_KV」が紐付いている場合のみ）
 *   4. 結果を Flex Message でリプライ（引換コード付き）
 *
 * 必要な環境変数（Cloudflare Pages の Settings > Environment variables で設定）:
 *   LINE_CHANNEL_SECRET        - LINE Developers > プロバイダー > Messaging API チャネルの Channel secret
 *   LINE_CHANNEL_ACCESS_TOKEN  - 同チャネルの Channel access token (long-lived)
 *   GACHA_SHOP_NAME            - 店名（任意。デフォルトは「居酒屋たかし」）
 *
 * 任意のバインディング:
 *   GACHA_KV  - Workers KV namespace。バインドされている場合、userId 単位で 1 日 1 回の制限が有効化されます。
 *               未設定の場合は制限なし（連打可能）になります。
 *
 * LINE Developers Console での設定:
 *   - Webhook URL: https://<your-domain>/api/line-webhook
 *   - Use webhook: ON
 *   - Auto-reply messages: OFF（ガチャ Bot の返信と被るためオフ推奨）
 */

import {
  PRIZES,
  TIER_LABEL,
  rollPrize,
  generateCouponCode,
  todayJST,
  type Prize,
} from "../../src/lib/gacha";

interface Env {
  LINE_CHANNEL_SECRET: string;
  LINE_CHANNEL_ACCESS_TOKEN: string;
  GACHA_SHOP_NAME?: string;
  GACHA_KV?: KVNamespace;
}

interface LineMessageEvent {
  type: "message";
  replyToken: string;
  source?: { userId?: string; type?: string };
  message: { type: string; text?: string };
}

interface LineFollowEvent {
  type: "follow";
  replyToken: string;
  source?: { userId?: string; type?: string };
}

type LineEvent = LineMessageEvent | LineFollowEvent | { type: string; replyToken?: string };

interface LineWebhookBody {
  destination?: string;
  events?: LineEvent[];
}

const TRIGGER_PATTERNS: RegExp[] = [/ガチャ/, /がちゃ/, /^gacha$/i, /^🎰$/];

/** LINE 署名検証（HMAC-SHA256 -> Base64） */
async function verifySignature(
  rawBody: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const bytes = new Uint8Array(mac);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const expected = btoa(bin);

  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

async function replyToLine(
  replyToken: string,
  messages: unknown[],
  token: string,
): Promise<void> {
  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
  if (!res.ok) {
    console.error("LINE reply failed:", res.status, await res.text());
  }
}

function buildResultFlex(prize: Prize, coupon: string, shopName: string) {
  const tierLabel = TIER_LABEL[prize.tier];
  return {
    type: "flex",
    altText: `${tierLabel} 「${prize.name}」が当たりました（引換コード: ${coupon}）`,
    contents: {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: prize.color,
        paddingAll: "16px",
        contents: [
          {
            type: "text",
            text: "🎰 本日のガチャ結果",
            color: "#FFFFFF",
            size: "sm",
            weight: "bold",
          },
          {
            type: "text",
            text: tierLabel,
            color: "#FFFFFF",
            size: "xl",
            weight: "bold",
            margin: "sm",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "20px",
        contents: [
          { type: "text", text: prize.emoji, align: "center", size: "5xl" },
          {
            type: "text",
            text: prize.name,
            weight: "bold",
            size: "lg",
            align: "center",
            wrap: true,
          },
          {
            type: "text",
            text: prize.description,
            size: "sm",
            color: "#555555",
            align: "center",
            wrap: true,
          },
          { type: "separator", margin: "md" },
          {
            type: "box",
            layout: "vertical",
            spacing: "xs",
            margin: "md",
            contents: [
              {
                type: "text",
                text: "引換コード",
                size: "xs",
                color: "#999999",
                align: "center",
              },
              {
                type: "text",
                text: coupon,
                weight: "bold",
                size: "xl",
                align: "center",
                color: "#111111",
              },
            ],
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "text",
            text: "ご来店時にこの画面をスタッフへお見せください",
            size: "xs",
            color: "#999999",
            wrap: true,
            align: "center",
          },
          {
            type: "text",
            text: shopName,
            size: "xs",
            color: "#bbbbbb",
            align: "center",
          },
        ],
      },
    },
  };
}

function welcomeText(shopName: string) {
  return {
    type: "text" as const,
    text: [
      `🍻 ${shopName} 公式LINEへようこそ！`,
      "",
      "「ガチャ」と送ると、1日1回ガチャを引けます。",
      "ハズレでも次回使えるクーポンが必ずもらえます🎟️",
      "",
      "▼ 賞品ラインナップ",
      "👑 5,000円分お食事券",
      "🍻 飲み放題 半額",
      "🥩 黒毛和牛ステーキ無料",
      "🍺 生ビール1杯無料",
      "🍗 唐揚げ1皿サービス",
      "🥢 お通し無料",
      "🫛 枝豆1皿サービス",
      "🎟️ 5%OFFクーポン",
    ].join("\n"),
    quickReply: {
      items: [
        {
          type: "action" as const,
          action: { type: "message" as const, label: "🎰 ガチャを引く", text: "ガチャ" },
        },
      ],
    },
  };
}

function helpText(shopName: string) {
  return {
    type: "text" as const,
    text: `「ガチャ」と送ると本日のガチャを引けます🎰\n（${shopName}）`,
    quickReply: {
      items: [
        {
          type: "action" as const,
          action: { type: "message" as const, label: "🎰 ガチャを引く", text: "ガチャ" },
        },
      ],
    },
  };
}

function alreadyPlayedText(prizeName: string, coupon: string) {
  return {
    type: "text" as const,
    text: [
      "🙏 本日はすでにガチャを引いていただきました。",
      "",
      "▼ 本日の当選内容",
      `🎁 ${prizeName}`,
      `🎫 引換コード: ${coupon}`,
      "",
      "また明日0時以降にお試しください！",
    ].join("\n"),
  };
}

function isMessageEvent(ev: LineEvent): ev is LineMessageEvent {
  return ev.type === "message" && "message" in ev && "replyToken" in ev;
}

function isFollowEvent(ev: LineEvent): ev is LineFollowEvent {
  return ev.type === "follow" && "replyToken" in ev;
}

async function handleEvent(ev: LineEvent, env: Env, shopName: string): Promise<void> {
  if (isFollowEvent(ev)) {
    await replyToLine(ev.replyToken, [welcomeText(shopName)], env.LINE_CHANNEL_ACCESS_TOKEN);
    return;
  }
  if (!isMessageEvent(ev)) return;
  if (ev.message.type !== "text") return;

  const text = (ev.message.text ?? "").trim();
  const isTrigger = TRIGGER_PATTERNS.some((re) => re.test(text));

  if (!isTrigger) {
    await replyToLine(ev.replyToken, [helpText(shopName)], env.LINE_CHANNEL_ACCESS_TOKEN);
    return;
  }

  const userId = ev.source?.userId;
  const dailyKey = userId ? `gacha:${userId}:${todayJST()}` : null;

  // すでに本日引いている場合は、同じ結果を返す（再表示用途）
  if (env.GACHA_KV && dailyKey) {
    const existing = await env.GACHA_KV.get(dailyKey, "json");
    if (existing && typeof existing === "object" && existing !== null) {
      const { prizeId, coupon } = existing as { prizeId?: string; coupon?: string };
      const prize = PRIZES.find((p) => p.id === prizeId);
      if (prize && coupon) {
        await replyToLine(
          ev.replyToken,
          [alreadyPlayedText(prize.name, coupon)],
          env.LINE_CHANNEL_ACCESS_TOKEN,
        );
        return;
      }
    }
  }

  const prize = rollPrize();
  const coupon = generateCouponCode();

  if (env.GACHA_KV && dailyKey) {
    await env.GACHA_KV.put(
      dailyKey,
      JSON.stringify({
        prizeId: prize.id,
        coupon,
        at: new Date().toISOString(),
      }),
      // 48時間で自動失効（日付が変わったあと安全に消える）
      { expirationTtl: 60 * 60 * 48 },
    );
  }

  await replyToLine(
    ev.replyToken,
    [buildResultFlex(prize, coupon, shopName)],
    env.LINE_CHANNEL_ACCESS_TOKEN,
  );
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.LINE_CHANNEL_SECRET || !env.LINE_CHANNEL_ACCESS_TOKEN) {
    console.error("LINE secrets are not configured");
    return new Response("Service Unavailable", { status: 503 });
  }

  const signature = request.headers.get("x-line-signature");
  if (!signature) return new Response("Bad Request", { status: 400 });

  const rawBody = await request.text();
  const ok = await verifySignature(rawBody, signature, env.LINE_CHANNEL_SECRET);
  if (!ok) return new Response("Forbidden", { status: 403 });

  let body: LineWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  const shopName = env.GACHA_SHOP_NAME ?? "居酒屋たかし";
  const events = body.events ?? [];

  // LINE は 10 秒以内に 200 を返すことが求められる。
  // 各イベントを並列処理し、すべての reply 完了を待ってから 200 を返す。
  await Promise.all(events.map((ev) => handleEvent(ev, env, shopName).catch((err) => {
    console.error("event handling error:", err);
  })));

  return new Response("OK", { status: 200 });
};

export const onRequest: PagesFunction = async () => {
  return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
};
