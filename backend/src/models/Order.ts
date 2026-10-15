import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;
export const PAYMENT_STATUSES = ["pending", "paid", "refunded"] as const;
export const PAYMENT_METHODS = ["cod", "upi_on_delivery"] as const;
export const DELIVERY_SLOTS = ["morning", "evening"] as const;

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String },
    sku: { type: String, required: true },
    variantLabel: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      phone: { type: String, required: true, index: true },
    },
    shippingAddress: {
      line1: { type: String, required: true },
      line2: String,
      landmark: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: PAYMENT_METHODS, default: "cod" },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "pending" },
    status: { type: String, enum: ORDER_STATUSES, default: "placed", index: true },
    deliverySlot: { type: String, enum: DELIVERY_SLOTS, default: "morning" },
    notes: { type: String, maxlength: 500 },
    statusHistory: {
      type: [
        new Schema(
          { status: String, note: String, at: { type: Date, default: Date.now } },
          { _id: false },
        ),
      ],
      default: [],
    },
  },
  { timestamps: true },
);

OrderSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.__v;
    return ret;
  },
});

export type OrderFields = InferSchemaType<typeof OrderSchema>;

export const Order: Model<OrderFields> =
  (mongoose.models.Order as Model<OrderFields>) || mongoose.model<OrderFields>("Order", OrderSchema);
