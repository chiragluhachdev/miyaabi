import mongoose, { Schema, Model } from "mongoose";

export interface ICollection {
  handle: string;
  title: string;
  group: "shop" | "brand" | "sport" | "feature";
  bannerImage: string;
  description: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    handle: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    group: {
      type: String,
      enum: ["shop", "brand", "sport", "feature"],
      default: "shop",
    },
    bannerImage: { type: String, default: "" },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Collection as Model<ICollection>) ??
  mongoose.model<ICollection>("Collection", collectionSchema);
