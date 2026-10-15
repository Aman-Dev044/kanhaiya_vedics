import { handler, json, readJson } from "@/lib/http";
import { enquirySchema } from "@/lib/validators";
import { Enquiry } from "@/models/Enquiry";

export const POST = handler(async (req) => {
  const data = enquirySchema.parse(await readJson(req));
  await Enquiry.create({ ...data, email: data.email || undefined });
  return json({ ok: true, message: "Thank you! Our team will reach out to you shortly." }, 201);
});
