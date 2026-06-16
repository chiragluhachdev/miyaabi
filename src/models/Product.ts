import mongoose, { Schema, Model } from "mongoose";

export interface IProductColor {
  name: string;
  hex: string;
}

export interface IProduct {
  handle: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  sizes: string[];
  colors: IProductColor[];
  brand: string;
  collectionHandles: string[];
  available: boolean;
  stock: number;
  comingSoon: boolean;
  badge: string;
  tags: string[];
  fabric: string;
  gsm: number;
  fit: string;
  washCare: string;
  countryOfOrigin: string;
  returnPolicy: string;
  shippingTime: string;
  popularity: number;
  featured: boolean;
  createdOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const colorSchema = new Schema<IProductColor>(
  { name: { type: String, required: true }, hex: { type: String, default: "#000000" } },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    handle: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null },
    images: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    colors: { type: [colorSchema], default: [] },
    brand: { type: String, default: "miyaabi" },
    collectionHandles: { type: [String], default: [], index: true },
    available: { type: Boolean, default: true },
    stock: { type: Number, default: 25 },
    comingSoon: { type: Boolean, default: false },
    badge: { type: String, default: "" },
    tags: { type: [String], default: [] },
    fabric: { type: String, default: "" },
    gsm: { type: Number, default: 0 },
    fit: { type: String, default: "" },
    washCare: { type: String, default: "" },
    countryOfOrigin: { type: String, default: "India" },
    returnPolicy: { type: String, default: "Easy 7-day return" },
    shippingTime: { type: String, default: "Ships in 2–4 days" },
    popularity: { type: Number, default: 50 },
    featured: { type: Boolean, default: false },
    createdOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text" });

export default (mongoose.models.Product as Model<IProduct>) ??
  mongoose.model<IProduct>("Product", productSchema);
