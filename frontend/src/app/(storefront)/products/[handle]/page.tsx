import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import ProductCarousel from "@/components/ProductCarousel";
import { getProduct, getRelatedProducts } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  return {
    title: product ? `${product.title} — miyaabi` : "Product — miyaabi",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const related = await getRelatedProducts(handle);

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-6">
        <nav className="mb-6 text-[12px] text-ink-soft">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/collections" className="hover:text-ink">
            Collections
          </Link>{" "}
          / <span className="text-ink">{product.title}</span>
        </nav>
        <ProductDetail product={product} />
      </div>

      {related.length > 0 && (
        <ProductCarousel title="You may also like" products={related} />
      )}
    </>
  );
}
