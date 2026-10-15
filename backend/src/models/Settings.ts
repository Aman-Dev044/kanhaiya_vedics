import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * Single-document store for everything the admin can configure without a deploy:
 * brand copy, contact details, delivery pricing, hero/landing text, SEO defaults, socials.
 */
const SettingsSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true },

    brand: {
      name: { type: String, default: "Kanhaiya Vedics" },
      tagline: { type: String, default: "From Farm to Homes" },
      description: {
        type: String,
        default:
          "Fresh raw farm milk and traditional Vedic bilona ghee from desi indigenous cows — sourced with care and delivered to your home.",
      },
    },

    contact: {
      phone: { type: String, default: "+91 98765 43210" },
      whatsapp: { type: String, default: "919876543210" },
      email: { type: String, default: "hello@kanhaiyavedics.com" },
      address: { type: String, default: "Kanhaiya Vedics Farm, Vrindavan, Uttar Pradesh, India" },
      hours: { type: String, default: "Mon – Sun · 5:30 AM – 8:00 PM" },
    },

    social: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      youtube: { type: String, default: "" },
      x: { type: String, default: "" },
    },

    delivery: {
      fee: { type: Number, default: 40, min: 0 },
      freeAbove: { type: Number, default: 499, min: 0 },
      serviceablePincodes: { type: [String], default: [] }, // empty = deliver everywhere
      morningSlot: { type: String, default: "6:00 AM – 8:30 AM" },
      eveningSlot: { type: String, default: "5:00 PM – 7:30 PM" },
      codEnabled: { type: Boolean, default: true },
      upiOnDeliveryEnabled: { type: Boolean, default: true },
    },

    announcement: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: "Free home delivery on orders above ₹499 · Fresh milk every morning" },
    },

    hero: {
      eyebrow: { type: String, default: "Pure · Desi · Vedic" },
      title: { type: String, default: "Milk the way nature intended." },
      subtitle: {
        type: String,
        default:
          "Raw farm milk and hand-churned bilona ghee from grass-fed desi indigenous cows. No preservatives, no shortcuts — just purity, delivered fresh to your doorstep.",
      },
      ctaText: { type: String, default: "Shop Fresh Milk" },
    },

    stats: {
      type: [new Schema({ value: String, label: String }, { _id: false })],
      default: [
        { value: "100%", label: "Desi indigenous cows" },
        { value: "0", label: "Preservatives or additives" },
        { value: "< 12 hrs", label: "Farm to your doorstep" },
        { value: "Daily", label: "Morning doorstep delivery" },
      ],
    },

    // Shown on the home page only when at least one is added — use real customer words.
    testimonials: {
      type: [
        new Schema(
          { name: String, location: String, quote: String, rating: { type: Number, default: 5 } },
          { _id: false },
        ),
      ],
      default: [],
    },

    faqs: {
      type: [new Schema({ question: String, answer: String }, { _id: false })],
      default: [
        {
          question: "Where does your milk come from?",
          answer:
            "All our milk comes from desi indigenous cows raised on our partner farm. They graze freely and are fed natural fodder — no hormones, no shortcuts.",
        },
        {
          question: "Is the milk raw? Do I need to boil it?",
          answer:
            "Yes, our farm milk is raw and unprocessed, so please boil it before drinking. Keep it refrigerated below 5°C and consume within 2 days of the packaging date.",
        },
        {
          question: "What makes bilona ghee different?",
          answer:
            "Bilona ghee is made the traditional Vedic way: milk is set into curd, hand-churned to separate makkhan, and the makkhan is slow-cooked into ghee. It is richer in aroma and texture than ghee made from cream.",
        },
        {
          question: "When do you deliver?",
          answer:
            "We deliver in a morning slot and an evening slot. You can choose your preferred slot at checkout.",
        },
        {
          question: "Can I get milk delivered every day?",
          answer:
            "Yes! Request a daily milk subscription from the Subscription page and our team will set up a regular delivery schedule for you.",
        },
        {
          question: "What payment methods do you accept?",
          answer: "You can pay with cash or UPI at the time of delivery.",
        },
      ],
    },

    seo: {
      title: { type: String, default: "Kanhaiya Vedics — Raw Farm Milk & Vedic Bilona Ghee from Desi Cows" },
      description: {
        type: String,
        default:
          "Order fresh raw farm milk and traditional bilona desi cow ghee online. Sourced from desi indigenous cows, delivered from farm to your home.",
      },
      keywords: {
        type: [String],
        default: [
          "desi cow milk",
          "raw farm milk",
          "bilona ghee",
          "vedic ghee",
          "desi cow ghee",
          "fresh milk delivery",
          "farm fresh milk",
          "Kanhaiya Vedics",
        ],
      },
    },

    theme: {
      defaultMode: { type: String, enum: ["light", "dark", "system"], default: "system" },
    },
  },
  { timestamps: true, minimize: false },
);

SettingsSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.__v;
    delete ret._id;
    delete ret.key;
    return ret;
  },
});

export type SettingsFields = InferSchemaType<typeof SettingsSchema>;

export const Settings: Model<SettingsFields> =
  (mongoose.models.Settings as Model<SettingsFields>) ||
  mongoose.model<SettingsFields>("Settings", SettingsSchema);

/** Returns the settings document, creating it with defaults on first use. */
export async function getSettings() {
  return Settings.findOneAndUpdate(
    { key: "site" },
    { $setOnInsert: { key: "site" } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}
