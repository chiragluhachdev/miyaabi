import { Collection, NavItem } from "@/data/types";

// Build the header navigation from the live collections list.
export function buildNav(collections: Collection[]): NavItem[] {
  const byGroup = (g: Collection["group"]) =>
    collections
      .filter((c) => c.group === g)
      .map((c) => ({ label: c.title, href: `/collections/${c.handle}` }));

  const sport = byGroup("sport");
  const shop = byGroup("shop");
  const feature = byGroup("feature");

  return [
    {
      label: "SHOP",
      href: "/collections",
      columns: [
        { heading: "By Sport", links: sport },
        { heading: "By Category", links: shop.slice(0, 8) },
        { heading: "Accessories", links: shop.slice(8) },
      ].filter((c) => c.links.length),
    },
    {
      label: "BRAND SHOP",
      href: "/collections",
      columns: [{ heading: "Featured", links: feature }].filter(
        (c) => c.links.length
      ),
    },
    { label: "BULK ENQUIRY", href: "/pages/bulk-enquiry" },
    { label: "SALE", href: "/collections/sale", highlight: true },
  ];
}
