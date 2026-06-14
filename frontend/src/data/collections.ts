import { Collection, NavItem } from "./types";
import { PRODUCTS } from "./products";

type ColSeed = {
  handle: string;
  title: string;
  group: Collection["group"];
  description?: string;
};

const COL_SEEDS: ColSeed[] = [
  { handle: "gujarat-titans", title: "Gujarat Titans", group: "feature", description: "Official supporter merchandise — jerseys, tees, caps and more." },
  { handle: "fan-jersey", title: "Fan Jersey", group: "feature" },
  { handle: "canada-cricket", title: "Canada Cricket", group: "feature" },
  { handle: "sale", title: "Sale", group: "feature", description: "Limited-time markdowns across the store." },

  { handle: "cricket", title: "Cricket", group: "sport" },
  { handle: "football", title: "Football", group: "sport" },
  { handle: "running", title: "Running", group: "sport" },
  { handle: "cycling-1", title: "Cycling", group: "sport" },
  { handle: "fitness-sports-yoga", title: "Fitness, Sports & Yoga", group: "sport" },
  { handle: "triathlon-trisuits", title: "Triathlon / Trisuits", group: "sport" },

  { handle: "jersey", title: "Jersey", group: "shop" },
  { handle: "tees", title: "Tees", group: "shop" },
  { handle: "polos", title: "Polos", group: "shop" },
  { handle: "jackets-hoodies", title: "Jackets & Hoodies", group: "shop" },
  { handle: "tracksuits", title: "Tracksuits", group: "shop" },
  { handle: "shorts", title: "Shorts", group: "shop" },
  { handle: "pants-leggings", title: "Pants & Leggings", group: "shop" },
  { handle: "caps", title: "Caps", group: "shop" },
  { handle: "hats", title: "Hats", group: "shop" },
  { handle: "bandana", title: "Bandana", group: "shop" },
  { handle: "bagpacks", title: "Backpacks", group: "shop" },
  { handle: "kit-bag", title: "Kit Bag", group: "shop" },
  { handle: "sipper", title: "Sipper", group: "shop" },
  { handle: "key-chain", title: "Key Chain", group: "shop" },
];

export const COLLECTIONS: Collection[] = COL_SEEDS.map((c) => ({
  handle: c.handle,
  title: c.title,
  group: c.group,
  bannerImage: `/img/banners/collection.svg`,
  description:
    c.description ??
    `Shop the latest ${c.title} range — premium fabrics, athletic fits and fan-ready designs.`,
  productHandles: PRODUCTS.filter((p) => p.collectionHandles.includes(c.handle)).map(
    (p) => p.handle
  ),
}));

export const COLLECTION_MAP: Record<string, Collection> = Object.fromEntries(
  COLLECTIONS.map((c) => [c.handle, c])
);

const byGroup = (g: Collection["group"]) =>
  COLLECTIONS.filter((c) => c.group === g).map((c) => ({
    label: c.title,
    href: `/collections/${c.handle}`,
  }));

export const NAV: NavItem[] = [
  {
    label: "SHOP",
    href: "/collections",
    columns: [
      { heading: "By Sport", links: byGroup("sport") },
      { heading: "By Category", links: byGroup("shop").slice(0, 8) },
      { heading: "Accessories", links: byGroup("shop").slice(8) },
    ],
  },
  {
    label: "BRAND SHOP",
    href: "/collections/gujarat-titans",
    columns: [
      {
        heading: "Featured",
        links: byGroup("feature"),
      },
      {
        heading: "Collaborations",
        links: [
          { label: "Gujarat Titans", href: "/collections/gujarat-titans" },
          { label: "Canada Cricket", href: "/collections/canada-cricket" },
          { label: "Fan Jersey", href: "/collections/fan-jersey" },
        ],
      },
    ],
  },
  { label: "BULK ENQUIRY", href: "/pages/bulk-enquiry" },
  { label: "SALE", href: "/collections/sale", highlight: true },
];
