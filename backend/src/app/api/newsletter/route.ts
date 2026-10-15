import { handler, json, readJson } from "@/lib/http";
import { newsletterSchema } from "@/lib/validators";
import { Enquiry } from "@/models/Enquiry";

export const POST = handler(async (req) => {
  const { email } = newsletterSchema.parse(await readJson(req));
  await Enquiry.updateOne(
    { type: "newsletter", email },
    { $setOnInsert: { type: "newsletter", email } },
    { upsert: true },
  );
  return json({ ok: true, message: "You're subscribed! Fresh updates are on their way." }, 201);
});
