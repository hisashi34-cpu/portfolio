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
    slug: "sendai-kaitai",
    title: "仙台解体センター（デモ）",
    category: "Webサイト制作",
    tagline: "地元の解体業者を、地域 No.1 へ押し上げる集客サイト",
    desc: "宮城県仙台市の解体業者向けデモサイト。施工事例・料金・問い合わせまでを一気通貫で見せる集客特化型コーポレート LP。",
    longDesc:
      "解体業界は地域密着・口コミ中心の文化が強く、Web で問い合わせ動線を持たない地元業者がまだ多数を占めます。一方で発注側（住宅オーナー・空き家相続人・店舗オーナー）は、依頼前にネットで業者を比較したいと考えており、ここに大きな機会のギャップが生まれています。本デモはその溝を埋めるための「地元業者向け集客 LP テンプレート」として制作しました。",
    tags: ["Webサイト制作", "LP制作", "ローカルSEO"],
    gradient: "from-rose-200 to-orange-200 dark:from-rose-900 dark:to-orange-900",
    image: "/projects/kaitai-thumb.png",
    link: "https://sendai-kaitai-demo.netlify.app/",
    linkLabel: "デモサイトを開く",
    year: "2026",
    challenge:
      "解体業者の Web サイトは、サービス内容や料金が不明瞭で、問い合わせまでの動線が長いケースが目立ちます。検討中のユーザーは複数業者を比較したいのに、必要な情報が揃わないため離脱してしまい、見込み客の取りこぼしが発生していました。",
    solution:
      "「依頼前に確認したい情報がすべて揃っている」という体験をゴールに、サービス・実績・料金・信頼性・対応エリアを 1 ページに集約。LINE・電話・メールの 3 チャネルの問い合わせ動線をヘッダーで常時提示し、ユーザーの好みに合わせていつでもコンタクトできる構成にしました。",
    features: [
      { title: "サービス別の見せ方", desc: "住宅・店舗・プチ解体（残置物処分）を区分けして提示し、ユーザーが自分に合うサービスをすぐ見つけられる構成。" },
      { title: "施工事例ギャラリー", desc: "過去の解体事例をビフォーアフターを含めて紹介し、業者選びの安心材料に。" },
      { title: "明朗会計の料金目安", desc: "木造・鉄骨・RC 造それぞれの坪単価目安を公開し、相見積もりに不安なく挑める安心感を演出。" },
      { title: "8 つの約束で信頼を可視化", desc: "近隣配慮・廃棄物適正処理・追加料金なしなどの項目を明文化し、初見訪問者の不安を払拭。" },
      { title: "LINE / 電話 / メールの 3 動線", desc: "ヘッダー固定の CTA でユーザーの好みに合わせて即時コンタクト可能。" },
      { title: "対応エリアマップ", desc: "宮城県内の対応範囲を視覚化し、想定外エリアからの誤クリック流入を抑制。" },
    ],
    techStack: ["Netlify", "コーポレートLP", "ローカルSEO", "レスポンシブ"],
    results: [
      { label: "問い合わせ動線", value: "3 チャネル" },
      { label: "1 ページ集約", value: "全要素網羅" },
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
];
