/**
 * 居酒屋公式LINEガチャ：共通ロジック
 *
 * - 賞品テーブル / 当選確率
 * - 抽選アルゴリズム
 * - 引換コード生成
 *
 * このモジュールは Cloudflare Pages Functions（functions/api/line-webhook.ts）と
 * デモページ（src/pages/gacha-demo.astro）の両方から参照されます。
 */

export type Tier = "SSR" | "SR" | "R" | "N" | "MISS";

export interface Prize {
  id: string;
  tier: Tier;
  /** 賞品名（LINE Flex / デモカード両方に表示） */
  name: string;
  /** 引換時の注意書き */
  description: string;
  /** 抽選ウェイト（合計 1000） */
  weight: number;
  /** 視覚的なアイコン */
  emoji: string;
  /** デモカード用 Tailwind グラデーション */
  gradient: string;
  /** LINE Flex Message ヘッダー背景色 */
  color: string;
}

export const TIER_LABEL: Record<Tier, string> = {
  SSR: "★★★ 大当たり！",
  SR: "★★ 当たり！",
  R: "★ 中当たり",
  N: "○ 小当たり",
  MISS: "ハズレ",
};

export const TIER_RING: Record<Tier, string> = {
  SSR: "ring-amber-400 shadow-amber-500/40",
  SR: "ring-rose-400 shadow-rose-500/40",
  R: "ring-blue-400 shadow-blue-500/30",
  N: "ring-emerald-400 shadow-emerald-500/30",
  MISS: "ring-zinc-300 shadow-zinc-500/20",
};

export const PRIZES: Prize[] = [
  {
    id: "ssr-meal-5000",
    tier: "SSR",
    name: "5,000円分 お食事券",
    description: "次回ご来店時にお会計から5,000円をサービス。系列店全店でご利用可。",
    weight: 10,
    emoji: "👑",
    gradient: "from-amber-300 via-yellow-300 to-orange-400",
    color: "#F59E0B",
  },
  {
    id: "sr-wagyu",
    tier: "SR",
    name: "黒毛和牛ステーキ 1皿サービス",
    description: "通常2,200円の名物・黒毛和牛ステーキを1皿無料に。",
    weight: 40,
    emoji: "🥩",
    gradient: "from-rose-400 via-red-400 to-pink-500",
    color: "#E11D48",
  },
  {
    id: "sr-nomihodai",
    tier: "SR",
    name: "飲み放題 半額",
    description: "通常2,000円の2時間飲み放題が1,000円。当日のみ有効。",
    weight: 50,
    emoji: "🍻",
    gradient: "from-fuchsia-400 via-rose-400 to-red-400",
    color: "#DB2777",
  },
  {
    id: "r-beer",
    tier: "R",
    name: "生ビール 1杯 無料",
    description: "ご注文時にこの画面をスタッフへお見せください。",
    weight: 100,
    emoji: "🍺",
    gradient: "from-amber-300 to-yellow-400",
    color: "#F59E0B",
  },
  {
    id: "r-karaage",
    tier: "R",
    name: "唐揚げ 1皿サービス",
    description: "鶏もも肉の特製唐揚げ（5個入り）を1皿無料に。",
    weight: 100,
    emoji: "🍗",
    gradient: "from-orange-300 to-amber-400",
    color: "#F97316",
  },
  {
    id: "n-otoshi",
    tier: "N",
    name: "お通し 無料",
    description: "お通し代（500円）をサービスいたします。",
    weight: 200,
    emoji: "🥢",
    gradient: "from-emerald-300 to-teal-400",
    color: "#10B981",
  },
  {
    id: "n-edamame",
    tier: "N",
    name: "枝豆 1皿サービス",
    description: "塩茹で枝豆を1皿無料でご提供。",
    weight: 200,
    emoji: "🫛",
    gradient: "from-lime-300 to-green-400",
    color: "#22C55E",
  },
  {
    id: "miss-5off",
    tier: "MISS",
    name: "次回 5%OFF クーポン",
    description: "残念！次回ご来店時のお会計から5%OFF。",
    weight: 300,
    emoji: "🎟️",
    gradient: "from-zinc-300 to-zinc-400",
    color: "#71717A",
  },
];

export const TOTAL_WEIGHT = PRIZES.reduce((sum, p) => sum + p.weight, 0);

export function rollPrize(rand: number = Math.random()): Prize {
  const target = rand * TOTAL_WEIGHT;
  let acc = 0;
  for (const p of PRIZES) {
    acc += p.weight;
    if (target < acc) return p;
  }
  return PRIZES[PRIZES.length - 1];
}

/** 8文字の引換コード（"XXXX-XXXX"形式、紛らわしい 0/O/1/I は除外） */
export function generateCouponCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let code = "";
  for (let i = 0; i < bytes.length; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

/** Asia/Tokyo の今日（YYYY-MM-DD） */
export function todayJST(): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

/** 当選確率（%）を計算するヘルパ（デモページの説明用） */
export function probabilityPercent(prize: Prize): string {
  const pct = (prize.weight / TOTAL_WEIGHT) * 100;
  return pct < 1 ? pct.toFixed(1) : pct.toFixed(0);
}
