export interface Feature {
  title: string;
  desc?: string;
}

export interface Result {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  /** Hero copy on the detail page */
  tagline?: string;
  /** Short description used on the Portfolio card */
  desc: string;
  /** Longer overview shown at the top of the detail page */
  longDesc?: string;
  /** Tag chips on the card */
  tags: string[];
  /** Background gradient classes used by the card and hero media frame */
  gradient: string;
  /** Optional demo video (relative to /public) */
  video?: string;
  /** When true, video is treated as landscape (full-bleed object-cover) */
  landscape?: boolean;
  /** Optional static thumbnail image (relative to /public) */
  image?: string;
  /** External link (e.g. live demo or App Store) shown on the detail page */
  link?: string;
  /** Label for the external link button */
  linkLabel?: string;
  /** Year string for the detail page meta */
  year?: string;
  /** Problem statement on the detail page */
  challenge?: string;
  /** Solution / approach */
  solution?: string;
  /** Major feature list (icon list on detail page) */
  features?: Feature[];
  /** Tech stack chips on the detail page */
  techStack?: string[];
  /** Results / metrics shown as stat cards */
  results?: Result[];
}

export const projects: Project[] = [
  {
    slug: "vehicle-log",
    title: "社用車走行日報",
    category: "業務SaaS",
    tagline: "社用車のドライバー業務を、GPS とスマホで自動化",
    desc: "社用車を使う企業向けの走行・日報管理アプリ。GPS 自動記録で日報作成時間を 80% 削減。",
    longDesc:
      "営業・配送・現場巡回など、社用車を日常的に運用する中小企業のための業務アプリ。スマホをポケットに入れておくだけで GPS が走行ログを記録し、日報の素材として自動的に残ります。手書き・転記の作業を限りなくゼロに近づけ、ドライバーが本業に集中できる環境を整えます。",
    tags: ["業務SaaS", "GPS連携", "モバイル対応"],
    gradient: "from-blue-200 to-sky-200 dark:from-blue-900 dark:to-sky-900",
    video: "/projects/vehicle-log-demo.mp4",
    year: "2026",
    challenge:
      "ドライバーは毎日の業務後に、走行距離・訪問先・燃料補給などを手書きで日報にまとめる必要があり、それ自体が大きな負担となっていました。記録漏れや転記ミスも多く、月末の集計では管理者にも大量の確認工数が発生していました。",
    solution:
      "スマホの GPS で走行ログを自動取得し、訪問先・距離・経路を日報の素材として保存する仕組みを構築。ドライバーの入力欄は最小限にとどめ、「内容に間違いがないか確認 → 提出」のワンタップで完結するフローを実現しました。",
    features: [
      { title: "GPS による走行ログ自動記録", desc: "スマホをポケットに入れておくだけで、走行距離・経路・滞在時間を自動記録。" },
      { title: "スマホ完結の日報入力", desc: "自動取得した情報をベースに、必要箇所のみ確認・補完すれば提出完了。" },
      { title: "管理者ダッシュボード", desc: "全ドライバーの稼働状況・走行履歴をクラウドで一元管理。" },
      { title: "PDF / CSV 出力", desc: "月末の集計や経理連携に必要なフォーマットで一括出力。" },
    ],
    techStack: ["業務SaaS", "GPS連携", "モバイル対応", "クラウド管理"],
    results: [
      { label: "日報作成時間", value: "-80%" },
      { label: "記録漏れ", value: "ほぼ解消" },
    ],
  },
  {
    slug: "business-log",
    title: "業務日報アプリ",
    category: "業務SaaS",
    tagline: "営業職の「報告作業」を、最短ルートで終わらせる",
    desc: "営業職向けの業務日報作成アプリ。提出・確認・集計までを一元化し、報告業務の負荷を軽減。",
    longDesc:
      "営業・外回り職向けの業務日報作成アプリ。「日報を書くために残業する」状態をなくすことを目標に、入力テンプレート・前日からのコピー・スマホ完結のフローを設計しました。マネージャー側も提出状況・コメントを画面ひとつで把握できます。",
    tags: ["業務SaaS", "営業支援", "レポート"],
    gradient: "from-cyan-200 to-blue-200 dark:from-cyan-900 dark:to-blue-900",
    video: "/projects/business-log-demo.mp4",
    year: "2026",
    challenge:
      "営業職は日々の活動報告を Excel やメールで提出する慣習が残り、入力フォーマットがバラバラ・集計に時間がかかる・進捗が見えづらい、という共通の悩みを抱えていました。",
    solution:
      "スマホひとつで完結する日報入力フォームと、マネージャー向けの提出ステータス画面をセットで提供。テンプレート化により入力時間そのものを短縮し、提出された情報はそのまま検索・集計できる構造で保存します。",
    features: [
      { title: "テンプレート化された日報入力", desc: "業種・職種に合わせた入力項目で、迷わず短時間で記入可能。" },
      { title: "前日のコピー・下書き保存", desc: "毎日同じ案件に取り組む営業でも、二度手間なく日報を作成。" },
      { title: "提出状況の可視化", desc: "マネージャーは誰が何を提出済かを一目で把握。コメント返信も同画面で完結。" },
      { title: "検索・集計", desc: "顧客別・案件別・期間別に過去の日報を検索し、傾向を把握。" },
    ],
    techStack: ["業務SaaS", "営業支援", "レポート"],
    results: [
      { label: "日報入力にかかる時間", value: "短縮" },
      { label: "提出率の可視化", value: "リアルタイム" },
    ],
  },
  {
    slug: "attendance",
    title: "出勤管理システム",
    category: "業務システム",
    tagline: "打刻から月次集計・帳票出力まで、これ一つ",
    desc: "従業員の打刻から勤怠集計、PDF 出力までを一元管理する勤怠システム。中小企業向けに最適化。",
    longDesc:
      "中小企業向けの勤怠管理 SaaS。従業員側は出退勤の打刻だけ、管理者側は月次集計・帳票出力までクラウドで完結します。給与計算ソフトとの連携も意識し、CSV / PDF / Word 形式で柔軟に出力できる構成にしています。",
    tags: ["React", "Firebase", "Vite"],
    gradient: "from-emerald-200 to-teal-200 dark:from-emerald-900 dark:to-teal-900",
    video: "/projects/kintai-demo.mp4",
    landscape: true,
    link: "https://kintai-cloud-eight.vercel.app/",
    linkLabel: "ライブデモを開く",
    year: "2026",
    challenge:
      "紙のタイムカード・Excel での集計を続けている中小企業では、月末の集計に大きな工数がかかり、転記ミスも発生しがちです。一方で大手の勤怠 SaaS は機能が多すぎて使いこなせず、コストも高くつくという課題がありました。",
    solution:
      "シンプルな打刻画面と、必要十分な集計・出力機能のみに絞った管理ダッシュボードを提供。Firebase によるリアルタイム同期で、打刻と同時に管理者画面にも反映されます。",
    features: [
      { title: "従業員専用の打刻画面", desc: "ログイン後すぐに出退勤を打刻できる、迷わない UI。" },
      { title: "管理者ダッシュボード", desc: "従業員別・期間別の勤怠を一覧表示し、月次集計までワンクリック。" },
      { title: "PDF / Word 帳票出力", desc: "html2pdf.js + docx で、勤怠表を印刷・配布しやすい形式に出力。" },
      { title: "Firebase 認証", desc: "従業員アカウントを管理者が安全に発行・管理。" },
    ],
    techStack: ["React 19", "Firebase", "Vite", "html2pdf.js", "docx"],
    results: [
      { label: "月次集計の工数", value: "大幅削減" },
      { label: "帳票出力", value: "PDF / Word 対応" },
    ],
  },
  {
    slug: "mitsumine-genba",
    title: "三峰建設 現場公開サイト（デモ）",
    category: "現場公開サイト",
    tagline: "工事現場の「今」を、地域住民に届けるための情報発信サイト",
    desc: "河川堤防整備工事の現場公開サイトデモ。工事概要・工程・お知らせを地域住民向けに発信するための特設サイト。",
    longDesc:
      "公共工事における「工事看板」の Web 版として機能する現場公開サイトのデモ。国土交通省・自治体案件で運用が広まりつつある「1 工事 1 サイト」の考え方に沿って、工事概要・区域図・計画工程表・お知らせ・周辺への配慮までを 1 サイトに集約。地域住民が工事の目的や進捗を把握しやすい構成にしました。",
    tags: ["現場公開サイト", "公共工事", "レスポンシブ"],
    gradient: "from-slate-200 to-blue-200 dark:from-slate-800 dark:to-blue-900",
    image: "/projects/mitsumine-thumb.jpg",
    link: "https://mitsumine-genba-demo.pages.dev/",
    linkLabel: "デモサイトを開く",
    year: "2026",
    challenge:
      "公共工事の情報発信は、現場に設置される「工事看板」に依存する運用が主流でした。しかし通行者や周辺住民が看板の前に立ち止まる機会は限られ、工事目的や工程が伝わりにくいという課題があります。一方、国交省の情報開示強化の流れの中で、Web 上でも工事情報を継続的に発信できる仕組みが求められるようになりました。",
    solution:
      "「1 工事 1 サイト」の運用を想定し、工事概要・場所・工程・お知らせ・お問い合わせという情報設計に整理。紺色をベースとした信頼感のある配色に、断面図・位置図の SVG、マスコットキャラクターなど、公共案件らしい安心感と親しみやすさを両立させたデザインでまとめました。",
    features: [
      { title: "工事概要ページ", desc: "工事名・場所・工期・発注者・受注者・目的をコンパクトに一覧。" },
      { title: "計画工程表", desc: "月別の進捗計画を可視化し、地域住民が「いつ何をやっているのか」を把握できる。" },
      { title: "工事のお知らせ", desc: "通行止め・夜間工事・重機搬入などの情報を継続的に発信。" },
      { title: "位置図・断面図（SVG）", desc: "工事の場所と構造をインライン SVG で描画し、印刷・拡大でもクリアに閲覧可能。" },
      { title: "マスコットキャラクター", desc: "工事の親しみやすさを演出し、地域住民との心理的な距離を縮める。" },
      { title: "周辺配慮のご案内", desc: "騒音対策・振動対策・環境保全への取り組みを明示し、住民の不安を軽減。" },
    ],
    techStack: ["HTML/CSS", "インライン SVG", "Cloudflare Pages", "レスポンシブ"],
    results: [
      { label: "情報開示の粒度", value: "1 工事 1 サイト" },
      { label: "対象オーディエンス", value: "周辺住民 / 通行者" },
      { label: "本番想定構成", value: "即運用可能" },
    ],
  },
  {
    slug: "aoba-kensetsu",
    title: "株式会社青葉建設（デモ）",
    category: "Webサイト制作",
    tagline: "地域に根ざした土木会社のための、本格コーポレートサイト",
    desc: "宮城県仙台市の土木建設会社向けデモサイト。工事情報・事業内容・施工実績・採用情報までを網羅した多ページ構成のコーポレートサイト。",
    longDesc:
      "地域インフラを担う土木建設会社のためのコーポレートサイトデモ。発注者（自治体・元請）への信頼形成と、地域住民への工事情報発信、そして将来の担い手となる若手の採用、という 3 つの目的を 1 つのサイトで両立できるよう設計しました。トップでは現在進行中の工事プロジェクトを大きく打ち出し、会社概要・事業内容・施工実績・採用・お知らせまでを多ページ構成で網羅しています。",
    tags: ["Webサイト制作", "コーポレートサイト", "採用強化"],
    gradient: "from-teal-200 to-emerald-200 dark:from-teal-900 dark:to-emerald-900",
    image: "/projects/aoba-thumb.jpg",
    link: "https://aobakensetsu.pages.dev/",
    linkLabel: "デモサイトを開く",
    year: "2026",
    challenge:
      "地方の中小土木会社では、Web サイトが「会社案内 PDF をそのまま貼っただけ」「数年前の更新で止まっている」というケースが多く、発注者・地域住民・採用候補者のいずれに対しても十分に情報が届いていないのが実情でした。特に若手採用の場面では、サイトの古さがそのまま「働きたくない会社」という印象に直結してしまいます。",
    solution:
      "「現在進行中の工事を主役に据える」構成をトップに採用し、地域住民が知りたい情報（場所・期間・施工主体）を真っ先に提示。会社概要・事業内容・施工実績ページで発注者向けの信頼情報を整理し、採用情報ページでは募集職種・福利厚生・先輩の声まで踏み込んで、3 種類のオーディエンスを 1 サイトで満足させる構造にまとめました。",
    features: [
      { title: "工事情報を主役にしたトップページ", desc: "現在進行中の工事プロジェクトをヒーローで大きく打ち出し、地域住民への情報発信を最優先に設計。" },
      { title: "会社概要・沿革・代表挨拶", desc: "発注者・取引先が事前に知りたい基本情報を、企業の物語性を保ちながら整理。" },
      { title: "4 つの事業領域を明確化", desc: "道路・橋梁・上下水道・造成土木の 4 領域を区分けして提示し、強みを伝わりやすく構造化。" },
      { title: "施工実績ギャラリー", desc: "過去の主要工事と表彰歴を併記し、技術力と実績を一目で訴求。" },
      { title: "採用情報ページ", desc: "募集職種・福利厚生・働く魅力までカバーし、求職者の意思決定に必要な情報を一気通貫で提供。" },
      { title: "お知らせ・更新履歴", desc: "新着情報を継続的に発信できる枠を確保し、サイトの「生きている感」を演出。" },
    ],
    techStack: ["Cloudflare Pages", "コーポレートサイト", "レスポンシブ", "セマンティックHTML"],
    results: [
      { label: "ページ構成", value: "6 ページ網羅" },
      { label: "対応オーディエンス", value: "発注者 / 住民 / 採用" },
      { label: "本番想定構成", value: "即運用可能" },
    ],
  },
  {
    slug: "yakumo-genba",
    title: "八雲建設 現場公開サイト（デモ）",
    category: "現場公開サイト",
    tagline: "遊水地整備工事の情報を、モダンなデザインで地域に届ける",
    desc: "遊水地整備工事の現場公開サイトデモ第 2 弾。白基調 × オレンジのモダンなデザインで、地域住民への情報発信を実現。",
    longDesc:
      "現場公開サイトのデザイン違いデモ。同じ情報構成（工事概要・工事内容・進捗・お知らせ・お問い合わせ）を、モダンな Web デザインの語彙で表現しました。左端の巨大英字ウォーターマーク・ゴースト番号・ヒーロースライダーなど、地方建設会社のサイトとして目を引く演出を取り入れつつ、公共案件としての節度は保っています。",
    tags: ["現場公開サイト", "モダンデザイン", "レスポンシブ"],
    gradient: "from-orange-200 to-yellow-200 dark:from-orange-900 dark:to-yellow-900",
    image: "/projects/yakumo-thumb.jpg",
    link: "https://yakumo-genba-demo.pages.dev/",
    linkLabel: "デモサイトを開く",
    year: "2026",
    challenge:
      "現場公開サイトを標準構成で作ると「どこも似た印象になってしまう」という課題があります。とはいえ、公共工事の性格上、派手すぎるデザインは避けたい。標準的な情報構成を保ちつつ、モダンで印象に残るビジュアルを実現する落としどころを模索しました。",
    solution:
      "白基調 × オレンジ (#ef8200) のシンプルな配色に、巨大な英字ウォーターマーク・ゴースト番号などのタイポグラフィ演出を組み合わせ、モダンな建設サイトのトレンドを取り入れました。3 枚のヒーロースライダーで工事のスケール感を演出しつつ、5 ページ構成で必要情報は網羅しています。",
    features: [
      { title: "モダンなヒーローセクション", desc: "3 枚の写真スライダー + カウンターで工事のスケール感を演出。" },
      { title: "左端の英字ウォーターマーク", desc: "各セクションに巨大英字を配置し、ページ全体に統一感とデザイン性を付与。" },
      { title: "ゴースト番号（01〜05）", desc: "セクション見出しに大きなゴースト番号を配置し、視覚的リズムを生成。" },
      { title: "工事進捗状況ページ", desc: "現在の進捗率とマイルストーンをタイムラインで開示。" },
      { title: "5 ページ構成", desc: "トップ / 工事内容 / 進捗 / お知らせ / お問い合わせ、必要十分の情報設計。" },
      { title: "ブランドカラー（オレンジ）", desc: "白基調に差し色オレンジで、地方建設会社の温かみと現代性を両立。" },
    ],
    techStack: ["HTML/CSS", "Google Fonts", "Cloudflare Pages", "レスポンシブ"],
    results: [
      { label: "デザイン方向性", value: "モダン建設" },
      { label: "ページ構成", value: "5 ページ" },
      { label: "本番想定構成", value: "即運用可能" },
    ],
  },
  {
    slug: "koguchi-seisan",
    title: "小口現金精算アプリ",
    category: "業務SaaS",
    tagline: "経費精算を、現場のスマホで 3 分で完結",
    desc: "経費精算をスマホで完結。領収書添付・自動計算・承認フローまで対応した小口現金精算アプリ。",
    longDesc:
      "現場と経理をつなぐ、小口現金精算のクラウドサービス。現場の申請者はスマホで領収書を撮影 → 必要事項を入力 → ワンタップでクラウド送信。経理側はダッシュボードで全申請を一元管理し、承認・差戻し・CSV 出力までを画面ひとつで完結できます。",
    tags: ["Firebase", "モバイル対応", "業務SaaS"],
    gradient: "from-amber-200 to-yellow-200 dark:from-amber-900 dark:to-yellow-900",
    image: "/projects/koguchi-thumb.png",
    link: "https://koguchi-seisan.web.app/%E5%96%B6%E6%A5%AD%E8%B3%87%E6%96%99_%E3%83%87%E3%83%A2%E5%8B%95%E7%94%BB.html",
    linkLabel: "営業デモプレゼンを開く",
    year: "2026",
    challenge:
      "現場で発生する小口現金精算は、紙の書類のやり取り・FAX・口頭でのやり取りが残りがちで、書類の紛失や集計漏れ・承認状況の不透明さが日常的に発生していました。",
    solution:
      "申請者・承認者・経理それぞれの画面を分けつつ、データはクラウド (Firestore) に一元化。スマホでも PC でも同じ情報にアクセスでき、申請から承認・集計までシームレスに進められる仕組みを構築しました。",
    features: [
      { title: "現場の申請者: スマホで 3 分", desc: "基本情報を入力 → 明細追加 → 領収書を撮影添付 → ワンタップでクラウド送信。" },
      { title: "経理・管理者ダッシュボード", desc: "Firebase Auth による安全なログインのもと、全申請の状況・合計を可視化。" },
      { title: "領収書の写真・PDF 添付", desc: "明細ごとにカメラで撮影、または PDF を添付して証憑を保存。" },
      { title: "ステータス管理（未処理 / 承認済 / 差戻し）", desc: "進捗が可視化され、口頭でのやり取りや「忘れ」が発生しない。" },
      { title: "検索・CSV 出力", desc: "氏名・期間・ステータスで検索、Excel BOM 付き CSV でそのまま会計連携。" },
    ],
    techStack: ["Firebase", "Firestore", "Firebase Auth", "Hosting", "モバイル Web"],
    results: [
      { label: "申請から承認まで", value: "スマホで完結" },
      { label: "書類の紛失", value: "ゼロ化" },
      { label: "経理工数", value: "大幅削減" },
    ],
  },
  {
    slug: "hiyari-hatto",
    title: "ヒヤリハット報告アプリ",
    category: "業務SaaS",
    tagline: "現場の「ひやっ」を 30 秒で共有、再発防止までクラウドで一気通貫",
    desc: "建設・製造現場のヒヤリハット報告をスマホで簡単記録。写真添付・自動集計・管理者通知で、安全管理を仕組み化。",
    longDesc:
      "建設・製造業をはじめとする現場では、重大事故の手前に必ず「ヒヤリハット」が存在します。本アプリは、現場で起きた「危なかった事例」をスマホで 30 秒以内に報告できる仕組みを提供。報告のハードルを限界まで下げ、集まった事例を分析・対策までクラウドで一気通貫で扱います。",
    tags: ["業務SaaS", "安全管理", "モバイル対応"],
    gradient: "from-red-200 to-rose-200 dark:from-red-900 dark:to-rose-900",
    video: "/projects/hiyari-hatto-demo.mp4",
    landscape: true,
    year: "2026",
    challenge:
      "ヒヤリハットは、重大事故を未然に防ぐための重要な情報源。しかし手書き用紙や朝礼での口頭報告に依存している現場が多く、提出のハードルが高いために報告が形骸化し、貴重な事例がそのまま埋もれてしまう状況が日常的に発生していました。",
    solution:
      "スマホで 30 秒、写真 1 枚と数タップで報告完了するインターフェースを設計。報告された事例は自動でクラウドに集約され、安全管理者にリアルタイム通知が届きます。さらに過去事例を業種・場所・原因別に検索・分析できる管理ダッシュボードを提供し、報告 → 分析 → 対策 → 再発防止のサイクルを回せる仕組みにしました。",
    features: [
      { title: "30 秒で完了する報告フロー", desc: "テンプレートから日時・場所・状況を選択 → 写真撮影 → 送信。最短数十秒で完了。" },
      { title: "写真・コメント添付", desc: "現場写真を添付できるため、状況がリアルに共有でき、管理者の判断が早まる。" },
      { title: "リアルタイム通知", desc: "報告と同時に安全管理者・現場責任者へ通知が飛び、即時対応が可能。" },
      { title: "管理者ダッシュボード", desc: "全報告の一覧・統計・検索・CSV 出力。月次の安全衛生委員会資料がワンクリック。" },
      { title: "業種・原因別の分析", desc: "「滑落」「挟まれ」「飛来」などのカテゴリで集計し、頻出パターンを可視化。" },
      { title: "事例ナレッジ化", desc: "報告を匿名化して全社で共有、教育資料としても活用可能。" },
    ],
    techStack: ["Firebase", "Firestore", "Firebase Auth", "モバイル Web", "PWA"],
    results: [
      { label: "報告所要時間", value: "30 秒" },
      { label: "報告のハードル", value: "大幅低減" },
      { label: "再発防止サイクル", value: "クラウド完結" },
    ],
  },
  {
    slug: "paid-leave",
    title: "有給休暇管理システム",
    category: "業務SaaS",
    tagline: "申請から承認・残日数管理まで、スマホで完結する有給管理",
    desc: "従業員の有給休暇申請・承認・消化状況をクラウドで一元管理。年 5 日取得義務にも自動で対応する労務管理 SaaS。",
    longDesc:
      "中小企業向けの有給休暇管理 SaaS。従業員はスマホから数タップで申請、上長は同じ画面で承認・差戻しが可能。残日数・取得状況・年 5 日取得義務の進捗まで自動でカウントするため、紙の申請書 / Excel での管理から完全に脱却できます。労務担当者の月次工数を大幅に削減することを目的に設計しました。",
    tags: ["業務SaaS", "労務管理", "モバイル対応"],
    gradient: "from-lime-200 to-green-200 dark:from-lime-900 dark:to-green-900",
    video: "/projects/paid-leave-demo.mp4",
    landscape: true,
    year: "2026",
    challenge:
      "中小企業では、有給休暇の申請が紙の届出書、消化管理が Excel という運用が多く残っています。労基法改正により年 5 日の取得が義務化されたものの、誰が何日取れているか・あと何日取らせる必要があるかを把握するために、労務担当者が手作業で集計せざるを得ない状況が続いていました。",
    solution:
      "スマホ完結の申請・承認フローと、残日数・年 5 日進捗を自動で可視化するダッシュボードをセットで提供。従業員は隙間時間に申請、上長はその場でワンタップ承認、労務担当者は月次の集計を画面で眺めるだけ、という流れを実現しました。",
    features: [
      { title: "スマホからの申請フォーム", desc: "日付選択 → 申請理由 → 上長を選択して送信。半休・時間有給にも対応。" },
      { title: "上長のワンタップ承認", desc: "通知から該当画面に直接ジャンプ、承認 / 差戻しを一画面で処理。" },
      { title: "残日数の自動計算", desc: "入社日 / 勤続年数から付与日数を自動算定し、消化分をリアルタイムに反映。" },
      { title: "年 5 日取得義務の進捗管理", desc: "対象者・残必要日数を一覧で把握。期限が近い従業員はアラートで警告。" },
      { title: "管理者ダッシュボード", desc: "全従業員の申請履歴・残日数・取得状況を一元表示し、CSV 出力にも対応。" },
      { title: "通知 / リマインド", desc: "申請・承認・差戻しの各タイミングで関係者に通知が届く。" },
    ],
    techStack: ["Firebase", "Firestore", "Firebase Auth", "モバイル Web", "PWA"],
    results: [
      { label: "申請から承認まで", value: "スマホで完結" },
      { label: "労務担当者の月次工数", value: "大幅削減" },
      { label: "年 5 日取得義務", value: "自動進捗管理" },
    ],
  },
];
