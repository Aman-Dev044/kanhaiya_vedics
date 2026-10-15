import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const VariantSchema = new Schema(
  {
    sku: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true }, // e.g. "1 Litre"
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false },
);

const FaqSchema = new Schema(
  { question: { type: String, required: true }, answer: { type: String, required: true } },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, enum: ["milk", "ghee"], required: true, index: true },
    tagline: { type: String, trim: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    variants: {
      type: [VariantSchema],
      validate: [(v: unknown[]) => v.length > 0, "At least one variant is required"],
    },
    highlights: { type: [String], default: [] },
    storage: { type: String },
    shelfLife: { type: String },
    usage: { type: String },
    faqs: { type: [FaqSchema], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true },
);

ProductSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.__v;
    return ret;
  },
});

export type ProductFields = InferSchemaType<typeof ProductSchema>;

export const Product: Model<ProductFields> =
  (mongoose.models.Product as Model<ProductFields>) ||
  mongoose.model<ProductFields>("Product", ProductSchema);
