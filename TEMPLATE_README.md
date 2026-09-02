# ポートフォリオ／コーポレートサイト テンプレート転用手順書

このリポジトリ（tunagaru.dev のソース）を **別クライアントのサイトとして転用する** ための手順書。
所要時間の目安: コンテンツ差し替え 1〜2 時間 + 外部サービス設定 30 分。

- 実物: https://tunagaru.dev/
- リポジトリ: https://github.com/hisashi34-cpu/portfolio

---

## 1. 技術スタックと全体像

| 層 | 使用技術 | 費用 |
|---|---|---|
| フレームワーク | Astro 5（静的ビルド） | 無料 |
| CSS | Tailwind CSS v4（`@tailwindcss/vite`） | 無料 |
| ホスティング | Cloudflare Pages | 無料 |
| フォーム送信 API | Cloudflare Pages Functions（`functions/api/contact.ts`） | 無料 |
| メール送信 | Resend（月 3,000 通まで無料） | 無料 |
| スパム対策 | Cloudflare Turnstile + ハニーポット | 無料 |
| 独自ドメイン | Cloudflare Registrar（`.dev` 年 $11 前後） | 有料（年千円台） |

**構成の考え方**: 静的サイト（HTML）としてビルドして Cloudflare Pages に置き、
お問い合わせフォームだけ Pages Functions（サーバレス関数）で受けて Resend 経由でメール転送する。
DB なし・サーバ管理なし・月額固定費ゼロ。

```
訪問者 → Cloudflare Pages（静的HTML + セキュリティヘッダ）
              └ POST /api/contact → Pages Function
                    ├ Turnstile検証（ボット遮断）
                    ├ 入力バリデーション
                    └ Resend API → クライアントのメールへ
```

---

## 2. ファイル構成と「どこを差し替えるか」

```
portfolio/
├── src/
│   ├── components/          # セクション単位のコンポーネント
│   │   ├── Header.astro     # ★ロゴ文字・ナビ項目
│   │   ├── Hero.astro       # ★キャッチコピー・統計数字
│   │   ├── Principle.astro  # ★理念・強み
│   │   ├── Portfolio.astro  # 実績グリッド（データは data/projects.ts）
│   │   ├── Services.astro   # ★サービス・料金
│   │   ├── News.astro       # ★お知らせ
│   │   ├── About.astro      # ★自己紹介・会社概要・プロフィール写真
│   │   ├── Contact.astro    # フォーム（項目を増やすときはここ + functions/api/contact.ts）
│   │   └── Footer.astro     # ★コピーライト表記
│   ├── data/
│   │   └── projects.ts      # ★★実績データの一元管理（1エントリ足すと一覧+詳細ページが自動生成）
│   ├── layouts/Layout.astro # ★<title>・meta description・OGP
│   ├── pages/
│   │   ├── index.astro      # トップ（セクションの並び替えはここ）
│   │   ├── privacy.astro    # ★プライバシーポリシー（運営者名・サービス名）
│   │   ├── terms.astro      # ★利用規約（運営者名・管轄裁判所）
│   │   └── projects/[slug].astro  # 実績詳細の動的ルート（触らなくてよい）
│   └── styles/global.css    # ★テーマカラー・フォント・アニメーション
├── functions/api/contact.ts # フォームAPI（件名ラベルの変更はここ）
├── public/
│   ├── _headers             # セキュリティヘッダ（基本触らない）
│   ├── favicon.svg          # ★ファビコン
│   ├── profile.png          # ★プロフィール写真
│   └── projects/            # ★実績のサムネ画像・デモ動画（mp4は4MB以下推奨）
├── .dev.vars.example        # ローカル用環境変数のサンプル
└── wrangler.toml            # Pagesプロジェクト名（★新プロジェクト名に変更）
```

★ = クライアントごとに差し替える場所。★★ = 一番よく触る場所。

---

## 3. 転用手順（新規クライアント）

### 3-1. コピーして初期化

```bash
cp -R portfolio <client-name>-site
cd <client-name>-site
rm -rf .git node_modules dist
git init -b main
npm install
```

### 3-2. 全文検索で固有名詞を洗い出して置換

エディタの横断検索で以下を検索し、クライアントの情報に置換する:

| 検索ワード | 出現場所 | 置換内容 |
|---|---|---|
| `たかし` | Header / About / Layout / Footer / privacy / terms | クライアント名・屋号 |
| `tunagaru.dev` | Layout / privacy / terms / astro.config.mjs | 新ドメイン |
| `業務を AI で仕組み化` | Layout の title / description | 新キャッチコピー |
| `仙台市` | About | 所在地 |
| `portfolio` | wrangler.toml の `name` | 新プロジェクト名（例: `client-site`） |

### 3-3. コンテンツ差し替え

1. **`src/data/projects.ts`** — 実績を全部書き換える。1 エントリの必須項目は
   `slug` / `title` / `category` / `desc` / `tags` / `gradient`。
   `video`（縦動画は自動でスマホ枠、横動画は `landscape: true`）か `image` のどちらかを置く。
   詳細ページ用に `tagline` / `longDesc` / `challenge` / `solution` / `features` / `techStack` / `results` / `link` を埋める。
2. **`public/projects/`** — サムネ（JPEG 品質 85、幅 1440px 目安）と動画（mp4 / H.264 / 4MB 以下推奨）を配置。
   デモサイトのサムネは headless Chrome で撮れる:
   ```bash
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --headless=new --disable-gpu --hide-scrollbars \
     --window-size=1440,900 --virtual-time-budget=8000 \
     --screenshot=thumb.png "https://example.com/"
   sips -s format jpeg -s formatOptions 85 thumb.png --out thumb.jpg
   ```
3. **`public/profile.png`** / **`public/favicon.svg`** — 写真とファビコンを差し替え。
4. **`src/styles/global.css`** — `--color-accent` を変えるとアクセント色が一括で変わる。
   Tailwind のクラス（`blue-600` 等）を別系統にしたい場合はコンポーネント内を一括置換
   （例: `blue-` → `emerald-`。過去に indigo→blue へ全置換した実績あり、`replace_all` で安全に置換できる）。
5. **`src/pages/privacy.astro`** / **`terms.astro`** — 運営者名・ドメイン・最終更新日を書き換え。
   利用外部サービス（Cloudflare / Turnstile / Resend / Google Fonts）は同じ構成なら変更不要。

### 3-4. ローカル確認

```bash
npm run dev   # http://localhost:4321
```

フォーム送信まで確認したい場合は `.dev.vars.example` を `.dev.vars` にコピーして値を入れ:

```bash
npm run build && npx wrangler pages dev dist
```

---

## 4. 外部サービス設定（クライアントごとに新規作成）

> **原則: クライアントの資産はクライアントのアカウントに作る**（自分のアカウントに同居させない）。
> 少なくとも Cloudflare はクライアント用に別アカウント（またはメンバー招待）を推奨。

### 4-1. Cloudflare Pages プロジェクト作成 + デプロイ

```bash
npx wrangler login                     # 対象アカウントでログイン
npx wrangler pages project create <project-name> --production-branch=main
npm run build
npx wrangler pages deploy dist --project-name=<project-name> --branch=main \
  --commit-dirty=true --commit-message="initial deploy"
```

⚠️ `--commit-message` は **ASCII のみ**。日本語だと `Invalid commit message (code: 8000111)` で失敗する。

### 4-2. Resend（メール送信）

1. https://resend.com/ でアカウント作成（無料 3,000 通/月）
2. API Keys → Create → **「Click to copy」ボタンでコピー**（手動選択はラベル混入・欠落事故が起きやすい。キーは `re_` 始まり 36 文字前後）
3. secrets を登録:
   ```bash
   npx wrangler pages secret put RESEND_API_KEY --project-name=<project-name>
   printf "client@example.com" | npx wrangler pages secret put TO_EMAIL --project-name=<project-name>
   printf "onboarding@resend.dev" | npx wrangler pages secret put FROM_EMAIL --project-name=<project-name>
   ```
4. **secret 変更後は再デプロイしないと反映されない**:
   ```bash
   npx wrangler pages deploy dist --project-name=<project-name> --branch=main --commit-dirty=true
   ```
5. 動作確認（curl で実送信）:
   ```bash
   curl -s -X POST https://<project>.pages.dev/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"テスト","email":"test@example.com","subject":"web","message":"動作確認"}'
   # → {"ok":true} が返り、TO_EMAIL にメールが届けば成功
   ```

### 4-3. 独自ドメイン

1. Cloudflare ダッシュボード → Domain Registration → Register Domains で取得
   - ⚠️ 住所入力は **ローマ字必須**（日本語だと「1文字以上必要」という紛らわしいエラーになる）
2. Workers & Pages → プロジェクト → **Custom domains** → ドメインを追加（DNS/SSL は自動）

### 4-4. Resend ドメイン認証（迷惑メール対策・重要）

1. Resend → Domains → Add Domain → 新ドメインを入力
2. Cloudflare 連携の「承認する」ボタンで DNS（MX / SPF / DKIM）が自動追加される
3. Verified になったら `FROM_EMAIL` を独自ドメインに切替 + 再デプロイ:
   ```bash
   printf "contact@<domain>" | npx wrangler pages secret put FROM_EMAIL --project-name=<project-name>
   npx wrangler pages deploy dist --project-name=<project-name> --branch=main --commit-dirty=true
   ```
   → これで Gmail の受信トレイに直接届く（`onboarding@resend.dev` のままだと迷惑メール行きになりやすい）

### 4-5. Cloudflare Turnstile（スパム対策）

1. Cloudflare ダッシュボード → Turnstile → Add site
   - Domain: 新ドメイン（＋動作確認用に `<project>.pages.dev` も追加可）
   - Widget mode: **Managed**（人間には原則何も表示されない）
2. Site Key / Secret Key を登録:
   ```bash
   # ビルド時に埋め込まれる公開キー → .env に書く（gitignore 済）
   echo "PUBLIC_TURNSTILE_SITE_KEY=0x4AAA..." > .env
   # サーバ側の秘密キー → Pages secret
   printf "0x4AAA..." | npx wrangler pages secret put TURNSTILE_SECRET_KEY --project-name=<project-name>
   ```
3. 再ビルド + 再デプロイ（PUBLIC_ 変数はビルド時埋め込みのため build からやり直す）
4. **未設定でも壊れない設計**: 両キーが無い場合はウィジェット非表示・サーバ検証スキップになる。後付け可。

検証: トークン無しで curl POST → `{"error":"認証チェックが完了していません"}` (400) が返れば有効。

---

## 5. セキュリティ（このテンプレに実装済みのもの）

| 対策 | 実装場所 |
|---|---|
| HTTPS 強制 + HSTS | Cloudflare 標準 + `public/_headers` |
| CSP / X-Frame-Options / nosniff 等 | `public/_headers`（Pages が自動適用） |
| ボット対策（二重） | Turnstile（サーバ側検証）+ ハニーポット `website` フィールド |
| 入力バリデーション | `functions/api/contact.ts`（必須チェック・メール形式・5000字上限） |
| XSS 対策 | 同上 `escapeHtml()` でメールHTML組み立て時にエスケープ |
| 秘密情報の分離 | API キー・宛先メールはすべて Pages の暗号化 secret。**リポジトリと配信HTMLに個人メールを書かない**（Public リポでも安全） |
| 個人情報の最小化 | フォーム項目は名前・メール・会社名(任意)・種別・本文のみ。電話・住所は取らない |
| プライバシーポリシー | `/privacy` `/terms` ページ + フォーム送信ボタン脇にリンク |

**納品前チェックリスト（5点点検）**:
1. □ ボット対策が動く（トークン無し POST が 400 で弾かれる）
2. □ https で配信されている（`curl -sI` で HSTS ヘッダ確認）
3. □ 送信内容の保存先を説明できる（メールのみ・クライアントの受信箱、Resend に短期ログ）
4. □ 不要な項目を取っていない
5. □ プライバシーポリシーへのリンクがフォーム近くにある

---

## 6. 運用・更新

```bash
# 更新の基本サイクル
npm run build
npx wrangler pages deploy dist --project-name=<project-name> --branch=main --commit-dirty=true
git add -A && git commit -m "..." && git push
```

- 実績を足す: `src/data/projects.ts` に 1 エントリ追加 + `public/projects/` に画像/動画 → ビルド・デプロイ
- GitHub リポジトリを Public にする場合: **リポジトリ内にメールアドレス・電話番号が無いことを grep で確認**してから push
  ```bash
  grep -rn "@gmail\|@yahoo\|090-\|080-" src/ functions/ public/ README.md
  ```

---

## 7. ハマりどころ集（実際に踏んだもの）

| 症状 | 原因と対処 |
|---|---|
| フォームが「サーバー設定が不完全」 | secrets 未設定 or 設定後に再デプロイしていない |
| Resend が `API key is invalid` | キーのコピー欠落・ラベル混入。ダッシュボードの Click to copy で取り直す |
| デプロイが `Invalid commit message` | 日本語コミットメッセージが原因。`--commit-message` に ASCII を渡す |
| ドメイン購入フォームでエラー | 住所が日本語。全てローマ字で入力 |
| メールが迷惑メール行き | Resend ドメイン認証（4-4）を実施し FROM を独自ドメインに |
| Turnstile が出ない | `.env` の `PUBLIC_TURNSTILE_SITE_KEY` はビルド時埋め込み。ビルドからやり直す |
| `wrangler pages secret` が `does not exist` | 先に `pages project create` が必要 |
