import { Product } from "./types";

const C = {
  navy: { name: "Navy", hex: "#0f1b3d" },
  sky: { name: "Sky", hex: "#36a9e1" },
  red: { name: "Red", hex: "#e11b22" },
  black: { name: "Black", hex: "#16181d" },
  white: { name: "White", hex: "#f4f4f2" },
  coral: { name: "Coral", hex: "#ff6f61" },
  green: { name: "Green", hex: "#1f9d55" },
  grey: { name: "Grey", hex: "#9aa0a6" },
  orange: { name: "Orange", hex: "#f2711c" },
};

const APPAREL = ["S", "M", "L", "XL", "XXL", "3XL"];
const ACC = ["One Size"];

type Seed = {
  handle: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  imgs: number; // number of placeholder views
  sizes: string[];
  colors: { name: string; hex: string }[];
  brand: string;
  cols: string[];
  available?: boolean;
  pop: number;
};

const SEEDS: Seed[] = [
  // ---- Gujarat Titans / fan jersey ----
  { handle: "official-match-edition-half-sleeve-jersey", title: "Official Match Edition Half Sleeve Jersey - Gujarat", price: 1999, imgs: 3, sizes: APPAREL, colors: [C.navy, C.sky], brand: "miyaabi", cols: ["gujarat-titans", "fan-jersey", "jersey", "cricket"], pop: 98 },
  { handle: "official-training-jersey-gujarat", title: "Official Training Jersey - Gujarat", price: 2199, imgs: 3, sizes: APPAREL, colors: [C.sky, C.navy], brand: "miyaabi", cols: ["gujarat-titans", "fan-jersey", "jersey"], pop: 95 },
  { handle: "official-training-jersey-half-sleeve-coral", title: "Official Training Jersey Half Sleeve Coral - Gujarat", price: 2199, imgs: 2, sizes: APPAREL, colors: [C.coral, C.white], brand: "miyaabi", cols: ["gujarat-titans", "fan-jersey", "jersey"], pop: 90 },
  { handle: "official-match-edition-long-sleeve-jersey", title: "Official Match Edition Long Sleeve Jersey - Gujarat", price: 2199, imgs: 2, sizes: APPAREL, colors: [C.navy, C.black], brand: "miyaabi", cols: ["gujarat-titans", "fan-jersey", "jersey"], pop: 88 },
  { handle: "gujarat-titans-supporter-tee", title: "Gujarat Titans Supporter Tee", price: 1199, compareAtPrice: 1499, imgs: 2, sizes: APPAREL, colors: [C.navy, C.white], brand: "miyaabi", cols: ["gujarat-titans", "tees", "sale"], pop: 84 },
  { handle: "gujarat-titans-fan-cap", title: "Gujarat Titans Fan Cap", price: 799, imgs: 2, sizes: ACC, colors: [C.navy, C.sky], brand: "miyaabi", cols: ["gujarat-titans", "caps", "hats"], pop: 80 },

  // ---- Cricket ----
  { handle: "pro-cricket-whites-half-sleeve", title: "Pro Cricket Whites Half Sleeve", price: 1799, imgs: 2, sizes: APPAREL, colors: [C.white, C.grey], brand: "miyaabi", cols: ["cricket", "jersey"], pop: 76 },
  { handle: "canada-cricket-home-jersey", title: "Canada Cricket Home Jersey", price: 2499, imgs: 3, sizes: APPAREL, colors: [C.red, C.white], brand: "miyaabi", cols: ["canada-cricket", "cricket", "fan-jersey", "jersey"], pop: 79 },
  { handle: "canada-cricket-away-jersey", title: "Canada Cricket Away Jersey", price: 2499, imgs: 2, sizes: APPAREL, colors: [C.white, C.red], brand: "miyaabi", cols: ["canada-cricket", "cricket", "fan-jersey", "jersey"], pop: 72 },
  { handle: "canada-cricket-training-tee", title: "Canada Cricket Training Tee", price: 1299, compareAtPrice: 1599, imgs: 2, sizes: APPAREL, colors: [C.red, C.black], brand: "miyaabi", cols: ["canada-cricket", "cricket", "tees", "sale"], pop: 70 },
  { handle: "cricket-match-trousers", title: "Cricket Match Trousers", price: 1599, imgs: 2, sizes: APPAREL, colors: [C.white, C.navy], brand: "miyaabi", cols: ["cricket", "pants-leggings"], pop: 64 },

  // ---- Football ----
  { handle: "club-football-home-kit", title: "Club Football Home Kit", price: 1899, imgs: 2, sizes: APPAREL, colors: [C.red, C.black], brand: "miyaabi", cols: ["football", "jersey", "fan-jersey"], pop: 74 },
  { handle: "football-training-shorts", title: "Football Training Shorts", price: 899, imgs: 2, sizes: APPAREL, colors: [C.black, C.navy], brand: "miyaabi", cols: ["football", "shorts"], pop: 60 },

  // ---- Running ----
  { handle: "lightweight-running-tee", title: "Lightweight Running Tee", price: 999, imgs: 2, sizes: APPAREL, colors: [C.sky, C.grey], brand: "miyaabi", cols: ["running", "tees", "fitness-sports-yoga"], pop: 68 },
  { handle: "marathon-running-shorts", title: "Marathon Running Shorts", price: 1099, imgs: 2, sizes: APPAREL, colors: [C.black, C.orange], brand: "miyaabi", cols: ["running", "shorts"], pop: 58 },
  { handle: "performance-running-jacket", title: "Performance Running Jacket", price: 2899, compareAtPrice: 3499, imgs: 2, sizes: APPAREL, colors: [C.black, C.red], brand: "miyaabi", cols: ["running", "jackets-hoodies", "sale"], pop: 66 },

  // ---- Cycling / Triathlon ----
  { handle: "aero-cycling-jersey", title: "Aero Cycling Jersey", price: 2599, imgs: 2, sizes: APPAREL, colors: [C.orange, C.black], brand: "miyaabi", cols: ["cycling-1", "jersey"], pop: 62 },
  { handle: "tri-suit-elite", title: "Tri Suit Elite", price: 4499, imgs: 2, sizes: APPAREL, colors: [C.navy, C.sky], brand: "miyaabi", cols: ["triathlon-trisuits", "cycling-1"], pop: 55 },

  // ---- Fitness / Yoga ----
  { handle: "training-polo-dryfit", title: "Training Polo Dry-Fit", price: 1399, imgs: 2, sizes: APPAREL, colors: [C.navy, C.green], brand: "miyaabi", cols: ["polos", "fitness-sports-yoga"], pop: 71 },
  { handle: "everyday-athleisure-tee", title: "Everyday Athleisure Tee", price: 899, compareAtPrice: 1199, imgs: 2, sizes: APPAREL, colors: [C.grey, C.black], brand: "miyaabi", cols: ["tees", "fitness-sports-yoga", "sale"], pop: 73 },
  { handle: "yoga-flex-leggings", title: "Yoga Flex Leggings", price: 1499, imgs: 2, sizes: APPAREL, colors: [C.black, C.coral], brand: "miyaabi", cols: ["pants-leggings", "fitness-sports-yoga"], pop: 67 },
  { handle: "zip-through-training-hoodie", title: "Zip-Through Training Hoodie", price: 2299, imgs: 2, sizes: APPAREL, colors: [C.navy, C.grey], brand: "miyaabi", cols: ["jackets-hoodies"], pop: 69 },
  { handle: "all-weather-tracksuit", title: "All-Weather Tracksuit", price: 3199, imgs: 2, sizes: APPAREL, colors: [C.black, C.navy], brand: "miyaabi", cols: ["tracksuits"], pop: 61 },

  // ---- Accessories ----
  { handle: "performance-sports-cap", title: "Performance Sports Cap", price: 699, imgs: 2, sizes: ACC, colors: [C.black, C.red], brand: "miyaabi", cols: ["caps", "hats"], pop: 57 },
  { handle: "team-bandana", title: "Team Bandana", price: 349, imgs: 1, sizes: ACC, colors: [C.navy, C.red], brand: "miyaabi", cols: ["bandana"], pop: 44 },
  { handle: "pro-kit-bag", title: "Pro Kit Bag", price: 2799, imgs: 2, sizes: ACC, colors: [C.black, C.navy], brand: "miyaabi", cols: ["kit-bag", "bagpacks"], pop: 59 },
  { handle: "essential-backpack", title: "Essential Backpack", price: 1899, imgs: 2, sizes: ACC, colors: [C.black, C.grey], brand: "miyaabi", cols: ["bagpacks"], pop: 56 },
  { handle: "insulated-sipper-750ml", title: "Insulated Sipper 750ml", price: 599, compareAtPrice: 799, imgs: 1, sizes: ACC, colors: [C.sky, C.black], brand: "miyaabi", cols: ["sipper", "sale"], pop: 63 },
  { handle: "team-keychain", title: "Team Keychain", price: 199, imgs: 1, sizes: ACC, colors: [C.red, C.navy], brand: "miyaabi", cols: ["key-chain"], available: false, pop: 30 },
  { handle: "supporter-shorts", title: "Supporter Shorts", price: 999, imgs: 2, sizes: APPAREL, colors: [C.navy, C.black], brand: "miyaabi", cols: ["shorts", "gujarat-titans"], pop: 52 },
];

function buildImages(handle: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => `/img/products/${handle}-${i + 1}.svg`);
}

export const PRODUCTS: Product[] = SEEDS.map((s, idx) => {
  const onSale = s.compareAtPrice != null;
  const available = s.available !== false;
  return {
    handle: s.handle,
    title: s.title,
    price: s.price,
    compareAtPrice: s.compareAtPrice,
    images: buildImages(s.handle, s.imgs),
    sizes: s.sizes,
    colors: s.colors,
    brand: s.brand,
    collectionHandles: s.cols,
    available,
    badge: !available ? "Sold out" : onSale ? "Sale" : undefined,
    description:
      "Engineered for performance and built for fans. Premium moisture-wicking fabric with a tailored athletic fit, reinforced stitching, and a breathable finish — equally at home on the pitch and on the street.",
    popularity: s.pop,
    createdOrder: SEEDS.length - idx,
  };
});

export const PRODUCT_MAP: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.handle, p])
);
