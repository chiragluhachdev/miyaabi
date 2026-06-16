import HeroSlideshow from "@/components/HeroSlideshow";
import FeatureStrip from "@/components/FeatureStrip";
import ProductCarousel from "@/components/ProductCarousel";
import PromoBand from "@/components/PromoBand";
import { TileGrid, TileCarousel } from "@/components/CategoryTiles";
import Reveal from "@/components/Reveal";
import {
  getBanners,
  getSettings,
  getSectionProducts,
  DEFAULT_SETTINGS,
} from "@/lib/api";
import { HomeSection, Product } from "@/data/types";

export default async function Home() {
  const [banners, settings] = await Promise.all([getBanners(), getSettings()]);
  const configured =
    settings.homeSections && settings.homeSections.length
      ? settings.homeSections
      : DEFAULT_SETTINGS.homeSections || [];
  const sections = configured.filter((s) => s.enabled !== false);

  // Pre-resolve products for every product-carousel section.
  const carouselProducts: Record<string, Product[]> = {};
  await Promise.all(
    sections
      .filter((s) => s.type === "product-carousel")
      .map(async (s) => {
        carouselProducts[s.id] = await getSectionProducts(s);
      })
  );

  return (
    <>
      <HeroSlideshow slides={banners} />
      <Reveal y={16}>
        <FeatureStrip features={settings.featureStrip} />
      </Reveal>

      {sections.map((s) => (
        <Reveal key={s.id}>
          <SectionRenderer
            section={s}
            products={carouselProducts[s.id] || []}
          />
        </Reveal>
      ))}
    </>
  );
}

function SectionRenderer({
  section,
  products,
}: {
  section: HomeSection;
  products: Product[];
}) {
  switch (section.type) {
    case "product-carousel":
      if (!products.length) return null;
      return (
        <ProductCarousel
          title={section.title || "Products"}
          products={products}
          viewAllHref={section.viewAllHref}
        />
      );
    case "tile-grid":
      if (!section.tiles?.length) return null;
      return <TileGrid title={section.title || ""} tiles={section.tiles} />;
    case "tile-carousel":
      if (!section.tiles?.length) return null;
      return <TileCarousel title={section.title || ""} tiles={section.tiles} />;
    case "promo":
      return (
        <PromoBand
          eyebrow={section.eyebrow}
          title={section.title || ""}
          text={section.text}
          cta={section.cta}
          href={section.href}
        />
      );
    default:
      return null;
  }
}
