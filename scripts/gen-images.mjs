// Generates self-contained placeholder SVGs for products, banners and category tiles.
// Run with: node scripts/gen-images.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = (p) => {
  const d = join(root, "public", p);
  mkdirSync(d, { recursive: true });
  return d;
};

// Deterministic hue from string
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function palette(seed) {
  const sets = [
    ["#0f1b3d", "#36a9e1"],
    ["#e11b22", "#16181d"],
    ["#ff6f61", "#0f1b3d"],
    ["#1f9d55", "#16181d"],
    ["#f2711c", "#16181d"],
    ["#36a9e1", "#0f1b3d"],
    ["#16181d", "#e11b22"],
    ["#9aa0a6", "#16181d"],
  ];
  return sets[hash(seed) % sets.length];
}
function unslug(s) {
  return s
    .replace(/-\d+$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// --- Jersey/apparel silhouette placeholder ---
function productSVG(handle, view) {
  const [c1, c2] = palette(handle);
  const id = `g${hash(handle + view)}`;
  const label = esc(unslug(handle));
  const viewLabel = `View ${view}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720" width="600" height="720" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="720" fill="#f2f2f0"/>
  <g transform="translate(300,300)">
    <path transform="translate(-150,-150)" d="M95 30 L40 70 L10 150 L60 185 L70 150 L70 330 L230 330 L230 150 L240 185 L290 150 L260 70 L205 30 C190 60 110 60 95 30 Z"
      fill="url(#${id})" stroke="rgba(0,0,0,0.12)" stroke-width="3"/>
    <circle cx="0" cy="40" r="36" fill="rgba(255,255,255,0.9)"/>
    <text x="0" y="52" text-anchor="middle" font-family="Public Sans, Arial, sans-serif" font-style="italic" font-size="34" font-weight="900" fill="${c1}">mi</text>
  </g>
  <rect x="40" y="620" width="${20 + (hash(handle) % 60)}" height="8" rx="4" fill="${c1}" opacity="0.5"/>
  <text x="40" y="676" font-family="Public Sans, Arial, sans-serif" font-size="26" font-weight="700" fill="#16181d">${label}</text>
  <text x="40" y="706" font-family="Public Sans, Arial, sans-serif" font-size="18" fill="#7a7f87">${viewLabel} · miyaabi</text>
</svg>`;
}

// --- Wide hero banner ---
function bannerSVG(name, title, subtitle, seed) {
  const [c1, c2] = palette(seed);
  const id = `b${hash(seed)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 720" width="1600" height="720" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="0.6" stop-color="${c2}"/>
      <stop offset="1" stop-color="#0a1024"/>
    </linearGradient>
    <radialGradient id="${id}b" cx="0.7" cy="0.3" r="0.8">
      <stop offset="0" stop-color="rgba(255,255,255,0.18)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="720" fill="url(#${id})"/>
  <rect width="1600" height="720" fill="url(#${id}b)"/>
  <g opacity="0.12" stroke="#fff" stroke-width="2">
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 200}" y1="0" x2="${i * 200 + 300}" y2="720"/>`).join("")}
  </g>
  <g opacity="0.10">
    ${Array.from({ length: 5 }, (_, i) => `<circle cx="${1250 + (i % 2) * 120}" cy="${200 + i * 90}" r="${50 + i * 14}" fill="none" stroke="#fff" stroke-width="3"/>`).join("")}
  </g>
  <text x="1470" y="660" text-anchor="end" font-family="Public Sans, Arial, sans-serif" font-style="italic" font-size="48" font-weight="900" fill="#ffffff" opacity="0.22">mi-<tspan fill="#e11b22">या</tspan>-bi</text>
</svg>`;
}

// --- Square category tile ---
function tileSVG(name, label, seed) {
  const [c1, c2] = palette(seed);
  const id = `t${hash(seed)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img" aria-label="${esc(label)}">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
  </linearGradient></defs>
  <rect width="600" height="600" fill="url(#${id})"/>
  <g opacity="0.14" stroke="#fff" stroke-width="2">
    ${Array.from({ length: 7 }, (_, i) => `<circle cx="300" cy="300" r="${60 + i * 45}" fill="none"/>`).join("")}
  </g>
  <rect x="0" y="500" width="600" height="100" fill="rgba(225,27,34,0.92)"/>
  <text x="30" y="565" font-family="Public Sans, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" letter-spacing="1">${esc(label.toUpperCase())}</text>
</svg>`;
}

// ---- Products (mirror handles + view counts from products.ts) ----
const PRODUCTS = [
  ["official-match-edition-half-sleeve-jersey", 3],
  ["official-training-jersey-gujarat", 3],
  ["official-training-jersey-half-sleeve-coral", 2],
  ["official-match-edition-long-sleeve-jersey", 2],
  ["gujarat-titans-supporter-tee", 2],
  ["gujarat-titans-fan-cap", 2],
  ["pro-cricket-whites-half-sleeve", 2],
  ["canada-cricket-home-jersey", 3],
  ["canada-cricket-away-jersey", 2],
  ["canada-cricket-training-tee", 2],
  ["cricket-match-trousers", 2],
  ["club-football-home-kit", 2],
  ["football-training-shorts", 2],
  ["lightweight-running-tee", 2],
  ["marathon-running-shorts", 2],
  ["performance-running-jacket", 2],
  ["aero-cycling-jersey", 2],
  ["tri-suit-elite", 2],
  ["training-polo-dryfit", 2],
  ["everyday-athleisure-tee", 2],
  ["yoga-flex-leggings", 2],
  ["zip-through-training-hoodie", 2],
  ["all-weather-tracksuit", 2],
  ["performance-sports-cap", 2],
  ["team-bandana", 1],
  ["pro-kit-bag", 2],
  ["essential-backpack", 2],
  ["insulated-sipper-750ml", 1],
  ["team-keychain", 1],
  ["supporter-shorts", 2],
];

const pDir = outDir("img/products");
let count = 0;
for (const [handle, views] of PRODUCTS) {
  for (let v = 1; v <= views; v++) {
    writeFileSync(join(pDir, `${handle}-${v}.svg`), productSVG(handle, v));
    count++;
  }
}

// ---- Hero banners ----
const bDir = outDir("img/banners");
writeFileSync(join(bDir, "hero-1.svg"), bannerSVG("hero-1", "Official Merchandise Partner", "GUJARAT TITANS × T10", "hero-one"));
writeFileSync(join(bDir, "hero-2.svg"), bannerSVG("hero-2", "Match Edition Jerseys", "NEW SEASON DROP", "hero-two"));
writeFileSync(join(bDir, "hero-3.svg"), bannerSVG("hero-3", "International Shipping", "WORN BY CHAMPIONS", "hero-three"));
writeFileSync(join(bDir, "collection.svg"), bannerSVG("collection", "Shop The Collection", "PREMIUM SPORTSWEAR", "collection-banner"));

// ---- Category tiles ----
const cDir = outDir("img/tiles");
const tiles = [
  ["clubs-academies", "Clubs & Academies"],
  ["leagues-partnership", "Leagues & Partnership"],
  ["school-alumni", "School & Alumni"],
  ["brand-shops", "Brand Shops"],
  ["cricket", "Cricket"],
  ["running", "Running"],
  ["football", "Football"],
  ["triathlon", "Triathlon"],
  ["cycling", "Cycling"],
  ["fitness", "Fitness & Yoga"],
];
for (const [slug, label] of tiles) {
  writeFileSync(join(cDir, `${slug}.svg`), tileSVG(slug, label, slug));
}

console.log(`Generated ${count} product images, 4 banners, ${tiles.length} tiles.`);
