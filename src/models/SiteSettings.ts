import mongoose, { Schema, Model } from "mongoose";

// Singleton document holding all global, admin-editable site chrome. The schema is
// ported verbatim from the Express backend; types are described loosely where the
// shape is intentionally flexible (homeSections is Mixed, interpreted by the
// storefront by each section's `type`).

export interface IPartner {
  enabled: boolean;
  accessCode: string;
  hero: { title: string; subtitle: string; image: string };
  intro: string;
  process?: { title: string; description: string; image: string }[];
  gallery?: string[];
  video: { url: string; caption: string };
}

export interface ISiteSettings {
  key: string;
  brand: { name: string; logoUrl: string; logoPublicId: string };
  announcementMessages: string[];
  whatsapp: { number: string; message: string; enabled: boolean };
  featureStrip: { icon: string; title: string; sub: string }[];
  footer: {
    columns: { heading: string; links: { label: string; href: string }[] }[];
    social: { label: string; href: string }[];
    payments: string[];
    tagline: string;
  };
  currency: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  homeSections?: any[];
  partner?: IPartner;
  createdAt: Date;
  updatedAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, default: "site", unique: true },
    brand: {
      name: { type: String, default: "mi-या-bi" },
      logoUrl: { type: String, default: "/logo.png" },
      logoPublicId: { type: String, default: "" },
    },
    announcementMessages: {
      type: [String],
      default: [
        "🔥 New season drop is LIVE now!",
        "✈️ International Shipping Available",
        "🏏 Premium sportswear, engineered for performance",
      ],
    },
    whatsapp: {
      number: { type: String, default: "919891829976" },
      message: {
        type: String,
        default: "Hi mi-या-bi! 👋 I'd like to know more about your products.",
      },
      enabled: { type: Boolean, default: true },
    },
    featureStrip: {
      type: [new Schema({ icon: String, title: String, sub: String }, { _id: false })],
      default: [
        { icon: "🚚", title: "Free Shipping", sub: "On orders over ₹1,499" },
        { icon: "🔁", title: "Easy Returns", sub: "7-day hassle-free" },
        { icon: "🔒", title: "Secure Checkout", sub: "100% protected" },
        { icon: "✈️", title: "Ships Worldwide", sub: "International delivery" },
      ],
    },
    footer: {
      columns: {
        type: [
          new Schema(
            { heading: String, links: [{ label: String, href: String, _id: false }] },
            { _id: false }
          ),
        ],
        default: [],
      },
      social: {
        type: [{ label: String, href: String, _id: false }],
        default: [
          { label: "Instagram", href: "https://instagram.com" },
          { label: "Facebook", href: "https://facebook.com" },
          { label: "YouTube", href: "https://youtube.com" },
          { label: "X", href: "https://x.com" },
        ],
      },
      payments: {
        type: [String],
        default: ["VISA", "MC", "AMEX", "UPI", "RuPay", "PayPal"],
      },
      tagline: {
        type: String,
        default:
          "Premium sports, athleisure and team wear. Engineered for performance, designed for the streets.",
      },
    },
    currency: { type: String, default: "INR" },

    homeSections: {
      type: [Schema.Types.Mixed],
      default: undefined,
    },

    partner: {
      enabled: { type: Boolean, default: true },
      accessCode: { type: String, default: "miyaabi2026" },
      hero: {
        title: { type: String, default: "Inside the miyaabi Factory" },
        subtitle: { type: String, default: "A look at how we make it" },
        image: { type: String, default: "" },
      },
      intro: { type: String, default: "" },
      process: {
        type: [
          new Schema(
            { title: String, description: String, image: String },
            { _id: false }
          ),
        ],
        default: undefined,
      },
      gallery: { type: [String], default: undefined },
      video: {
        url: { type: String, default: "" },
        caption: { type: String, default: "" },
      },
    },
  },
  { timestamps: true }
);

export default (mongoose.models.SiteSettings as Model<ISiteSettings>) ??
  mongoose.model<ISiteSettings>("SiteSettings", siteSettingsSchema);
