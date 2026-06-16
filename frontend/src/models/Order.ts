import mongoose, { Schema, Model } from "mongoose";

export interface IOrderLine {
  handle: string;
  title: string;
  image: string;
  price: number;
  size: string;
  color: string;
  qty: number;
}

export interface IOrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus =
  | "placed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface IOrder {
  items: IOrderLine[];
  customer: IOrderCustomer;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const lineSchema = new Schema<IOrderLine>(
  {
    handle: String,
    title: String,
    image: String,
    price: Number,
    size: String,
    color: String,
    qty: { type: Number, default: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    items: { type: [lineSchema], default: [] },
    customer: {
      name: { type: String, required: true },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    paymentMethod: { type: String, default: "COD" },
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default (mongoose.models.Order as Model<IOrder>) ??
  mongoose.model<IOrder>("Order", orderSchema);
