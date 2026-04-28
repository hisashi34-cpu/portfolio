# Portfolio Site

ITエンジニア向けのポートフォリオ兼ホームページ。Astro + Tailwind CSS v4 で構築し、Cloudflare Pages にデプロイする想定です。

お問い合わせフォームから [Resend](https://resend.com/) 経由で Gmail にメールが届きます。

---

## 構成

```
portfolio/
├── src/
│   ├── components/      # Header, Hero, About, Skills, Services, Portfolio, Contact, Footer
│   ├── layouts/         # ベースレイアウト
│   ├── pages/index.astro
│   └── styles/global.css
├── functions/api/contact.ts   # Cloudflare Pages Function（フォーム → Resend → Gmail）
├── public/              # 静的ファイル（favicon等）
├── astro.config.mjs
├── wrangler.toml
└── package.json
```

---

## ローカル開発

### 1. 依存をインストール

```bash
npm install
```

### 2. 開発サーバを起動（フロントのみ）

```bash
npm run dev
```

http://localhost:4321 でプレビューできます。
※ この `astro dev` ではお問い合わせフォームの送信処理（Pages Functions）は動きません。

### 3. お問い合わせフォーム込みでローカル動作確認したい場合

`.dev.vars.example` を `.dev.vars` にコピーし、Resend の API キー等を設定してから、ビルド＋wrangler で起動します。

```bash
cp .dev.vars.example .dev.vars
# .dev.vars を編集して RESEND_API_KEY と TO_EMAIL を設定

npm run build
npx wrangler pages dev dist
```

---

## デプロイ手順（Cloudflare Pages + 独自ドメイン）

### 1. Cloudflare アカウントを準備

- https://dash.cloudflare.com/ でアカウント作成
- 独自ドメインを Cloudflare で管理する場合は、ドメインを Cloudflare に追加して DNS 切り替え

### 2. GitHub にこのリポジトリを push

```bash
git init
git add .
git commit -m "initial portfolio"
git branch -M main
git remote add origin git@github.com:<your>/<repo>.git
git push -u origin main
```

### 3. Cloudflare Pages でプロジェクト作成

1. Cloudflare ダッシュボード → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. GitHub リポジトリを選択
3. Build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. **Save and Deploy**

### 4. 環境変数を設定（重要）

Cloudflare Pages → 作成したプロジェクト → **Settings** → **Environment variables** で以下を追加します（Production / Preview の両方）。

| 変数名                       | 値                                | 説明                                                |
| ---------------------------- | --------------------------------- | --------------------------------------------------- |
| `RESEND_API_KEY`             | `re_xxxxxxxxxxxx`                 | Resend で発行した API キー                          |
| `TO_EMAIL`                   | `your-email@example.com`          | 受信したいメールアドレス                            |
| `FROM_EMAIL`                 | `contact@yourdomain.com` 等        | 送信元（後述：要ドメイン認証）                      |
| `PUBLIC_TURNSTILE_SITE_KEY`  | `0x4AAAAAAA...`                   | Cloudflare Turnstile の Site key（任意・後述）      |
| `TURNSTILE_SECRET_KEY`       | `0x4AAAAAAA...`                   | Cloudflare Turnstile の Secret key（任意・後述）    |

> 💡 **Turnstile の環境変数は両方セットで初めて有効化されます**。未設定の場合はフォームから Turnstile ウィジェットが消え、サーバー側の検証もスキップされる安全な実装になっています。後から追加・無効化どちらも可能です。

### 5. Resend のセットアップ

1. https://resend.com/ で無料アカウント作成（無料枠：3,000通/月）
2. **API Keys** → 新規発行 → `RESEND_API_KEY` に設定
3. **Domains** で独自ドメインを追加し、DNS（SPF / DKIM）を Cloudflare DNS で設定 → 認証済になったら `FROM_EMAIL` をそのドメインのアドレスに
   - 動作確認だけなら `FROM_EMAIL=onboarding@resend.dev` を設定すれば即動きます（自分宛にだけ送れます）

### 6. Cloudflare Turnstile のセットアップ（推奨）

ボットによるフォーム送信スパムを防ぎます。無料・無制限。

1. Cloudflare ダッシュボード → **Turnstile** → **Add site**
2. Domain にデプロイ先のドメインを入力（例: `yourdomain.com`、ローカル動作確認なら `localhost` も追加）
3. **Widget mode** は `Managed` を推奨
4. 発行された **Site Key** → Pages 環境変数 `PUBLIC_TURNSTILE_SITE_KEY` に設定
5. 発行された **Secret Key** → Pages 環境変数 `TURNSTILE_SECRET_KEY` に設定
6. Pages を再デプロイ（Deployments → Retry deployment）すると有効化されます

> 設定しない場合もサイトは正常に動きますが、ハニーポットだけが防御になります。本番運用ではぜひ有効化してください。

### 7. セキュリティヘッダ

`public/_headers` に CSP / HSTS / X-Frame-Options 等を設定済みです。Cloudflare Pages は `_headers` ファイルを自動で読み取って各レスポンスに付与します。何もする必要はありません。

### 8. 独自ドメインの割当

Cloudflare Pages → プロジェクト → **Custom domains** → **Set up a custom domain** で独自ドメインを入力。Cloudflare DNS で管理しているドメインなら自動で DNS レコードが設定されます。

---

## 仮データの差し替え場所

| 内容                  | ファイル                              |
| --------------------- | ------------------------------------- |
| 名前 / タイトル       | `src/layouts/Layout.astro` (`title`)  |
| Hero のキャッチコピー | `src/components/Hero.astro`           |
| 自己紹介文 / プロフィール写真 | `src/components/About.astro`   |
| 技術スタック          | `src/components/Skills.astro`         |
| サービス・料金        | `src/components/Services.astro`       |
| 実績                  | `src/components/Portfolio.astro`      |
| フッター（コピーライト） | `src/components/Footer.astro`     |

プロフィール写真・実績サムネイルは `public/` に画像を置いて、各コンポーネントのプレースホルダ部分を `<img src="/xxx.jpg" />` に差し替えてください。

---

## よく使うコマンド

```bash
npm run dev       # 開発サーバ
npm run build     # 本番ビルド (dist/ に出力)
npm run preview   # ビルド成果物のプレビュー
npm run deploy    # ビルド + Cloudflare Pages にデプロイ（wrangler 経由）
```
