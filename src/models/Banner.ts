import mongoose, { Schema, Model } from "mongoose";

export interface IBanner {
  image: string;
  eyebrow: string;
  title: string;
  cta: string;
  href: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    image: { type: String, default: "" },
    eyebrow: { type: String, default: "" },
    title: { type: String, required: true },
    cta: { type: String, default: "Shop Now" },
    href: { type: String, default: "/collections" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Banner as Model<IBanner>) ??
  mongoose.model<IBanner>("Banner", bannerSchema);
