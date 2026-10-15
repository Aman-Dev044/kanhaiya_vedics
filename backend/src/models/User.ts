import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose";

const AddressSchema = new Schema(
  {
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    landmark: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer", index: true },
    address: { type: AddressSchema },
  },
  { timestamps: true },
);

UserSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export type UserFields = InferSchemaType<typeof UserSchema>;
export type UserDoc = HydratedDocument<UserFields>;

export const User: Model<UserFields> =
  (mongoose.models.User as Model<UserFields>) || mongoose.model<UserFields>("User", UserSchema);
