import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import {
  queryProducts,
  queryProductByHandle,
  queryRelated,
  queryCollections,
  queryCollectionByHandle,
  queryBanners,
  querySettings,
  type ProductQuery,
} from "./queries";

// Cached read layer. Public storefront reads (RSC + /api) go through these so they
// hit MongoDB only on a cache miss or after a tag revalidation. Admin mutations
// call revalidate(...) to refresh instantly (plan Phase 7). Admin-only reads
// (queryAllCollections, full partner) are intentionally NOT cached.

export const TAGS = {
  products: "products",
  collections: "collections",
  banners: "banners",
  settings: "settings",
} as const;

const REVALIDATE = 300; // seconds — also acts as a safety TTL behind tag invalidation

// unstable_cache serializes the return value; round-trip Mongoose lean docs
// (ObjectId/Date) to plain JSON so cached and fresh responses are identical.
const plain = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

export const getCachedProducts = unstable_cache(
  async (params: ProductQuery) => plain(await queryProducts(params)),
  ["products-list"],
  { tags: [TAGS.products], revalidate: REVALIDATE }
);

export const getCachedProductByHandle = unstable_cache(
  async (handle: string) => plain(await queryProductByHandle(handle)),
  ["product-by-handle"],
  { tags: [TAGS.products], revalidate: REVALIDATE }
);

export const getCachedRelated = unstable_cache(
  async (handle: string, limit: number) => plain(await queryRelated(handle, limit)),
  ["product-related"],
  { tags: [TAGS.products], revalidate: REVALIDATE }
);

// Counts depend on products too, so this is tagged with both.
export const getCachedCollections = unstable_cache(
  async (withCounts: boolean) => plain(await queryCollections(withCounts)),
  ["collections-list"],
  { tags: [TAGS.collections, TAGS.products], revalidate: REVALIDATE }
);

export const getCachedCollectionByHandle = unstable_cache(
  async (handle: string) => plain(await queryCollectionByHandle(handle)),
  ["collection-by-handle"],
  { tags: [TAGS.collections, TAGS.products], revalidate: REVALIDATE }
);

export const getCachedBanners = unstable_cache(
  async () => plain(await queryBanners()),
  ["banners-list"],
  { tags: [TAGS.banners], revalidate: REVALIDATE }
);

export const getCachedSettings = unstable_cache(
  async () => plain(await querySettings()),
  ["settings"],
  { tags: [TAGS.settings], revalidate: REVALIDATE }
);

// Invalidate one or more cache tags after a mutation. Next 16 requires a cache-life
// profile as the 2nd arg; "max" purges the tag immediately on-demand.
export function revalidate(...tags: string[]): void {
  for (const tag of tags) revalidateTag(tag, "max");
}
