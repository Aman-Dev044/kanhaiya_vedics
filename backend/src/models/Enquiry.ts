import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// Contact-form messages, milk-subscription requests and newsletter sign-ups.
const EnquirySchema = new Schema(
  {
    type: { type: String, enum: ["contact", "subscription", "newsletter"], required: true, index: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, trim: true, maxlength: 2000 },
    status: { type: String, enum: ["new", "in_progress", "closed"], default: "new" },
  },
  { timestamps: true },
);

EnquirySchema.index({ type: 1, email: 1 });

export type EnquiryFields = InferSchemaType<typeof EnquirySchema>;

export const Enquiry: Model<EnquiryFields> =
  (mongoose.models.Enquiry as Model<EnquiryFields>) ||
  mongoose.model<EnquiryFields>("Enquiry", EnquirySchema);
