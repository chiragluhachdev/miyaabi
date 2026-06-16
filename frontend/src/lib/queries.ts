import "server-only";
import mongoose from "mongoose";
import { dbConnect } from "./db";
import Product from "@/models/Product";
import Collection from "@/models/Collection";
import Banner from "@/models/Banner";
import SiteSettings from "@/models/SiteSettings";
import Order from "@/models/Order";

// Server-only data-access layer. Both the /api route handlers and (from Step 3) the
// storefront RSCs call these directly — no self-HTTP hop. Return shapes match the
// old Express controllers exactly so responses stay byte-compatible during cutover.

export interface ProductQuery {
  collection?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
  limit?: number;
  handles?: string; // comma-separated
}

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  featured: { createdOrder: -1 },
  "best-selling": { popularity: -1 },
  alpha: { title: 1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  "date-old": { createdAt: 1 },
  "date-new": { createdAt: -1 },
};

export async function queryProducts(params: ProductQuery) {
  await dbConnect();
  const { collection, search, sort, featured, limit, handles } = params;
  const filter: Record<string, unknown> = {};
  if (collection) filter.collectionHandles = collection;
  if (featured) filter.featured = true;
  if (search) {
    const rx = new RegExp(
      String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    filter.$or = [
      { title: rx },
      { description: rx },
      { tags: rx },
      { fabric: rx },
      { fit: rx },
      { brand: rx },
    ];
  }
  if (handles) {
    filter.handle = { $in: String(handles).split(",").filter(Boolean) };
  }

  let q = Product.find(filter).sort(SORT_MAP[sort || ""] || { createdOrder: -1 });
  if (limit) q = q.limit(Number(limit));
  return q.lean();
}

export async function queryProductByHandle(handle: string) {
  await dbConnect();
  return Product.findOne({ handle }).lean();
}

export async function queryRelated(handle: string, limit = 4) {
  await dbConnect();
  const product = await Product.findOne({ handle }).lean();
  if (!product) return null;
  return Product.find({
    handle: { $ne: product.handle },
    collectionHandles: { $in: product.collectionHandles },
  })
    .limit(Number(limit) || 4)
    .lean();
}

export async function queryCollections(withCounts = false) {
  await dbConnect();
  const collections = await Collection.find({ active: true })
    .sort({ order: 1, title: 1 })
    .lean();

  if (withCounts) {
    const counts = await Product.aggregate<{ _id: string; n: number }>([
      { $unwind: "$collectionHandles" },
      { $group: { _id: "$collectionHandles", n: { $sum: 1 } } },
    ]);
    const map = Object.fromEntries(counts.map((c) => [c._id, c.n]));
    collections.forEach((c) => {
      (c as unknown as Record<string, unknown>).productCount = map[c.handle] || 0;
    });
  }
  return collections;
}

export async function queryAllCollections() {
  await dbConnect();
  return Collection.find().sort({ order: 1, title: 1 }).lean();
}

export async function queryCollectionByHandle(handle: string) {
  await dbConnect();
  const collection = await Collection.findOne({ handle }).lean();
  if (!collection) return null;
  const products = await Product.find({ collectionHandles: collection.handle }).lean();
  return { collection, products };
}

export async function queryBanners(includeInactive = false) {
  await dbConnect();
  const filter = includeInactive ? {} : { active: true };
  return Banner.find(filter).sort({ order: 1, createdAt: 1 }).lean();
}

// Singleton settings doc, created on first read (mirrors the Express getOrCreate).
async function getOrCreateSettings() {
  await dbConnect();
  let settings = await SiteSettings.findOne({ key: "site" });
  if (!settings) settings = await SiteSettings.create({ key: "site" });
  return settings;
}

// Public settings — never expose the gated partner area.
export async function querySettings() {
  const settings = await getOrCreateSettings();
  const obj = settings.toObject();
  delete obj.partner;
  return obj;
}

export async function queryOrderById(id: string) {
  await dbConnect();
  if (!mongoose.isValidObjectId(id)) return null;
  return Order.findById(id).lean();
}

export { getOrCreateSettings };
