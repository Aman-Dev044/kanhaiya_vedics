import { handler, json } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { Enquiry } from "@/models/Enquiry";

export const dynamic = "force-dynamic";

export const GET = handler(async (req) => {
  await requireAdmin(req);
  const type = req.nextUrl.searchParams.get("type");
  const filter = type && ["contact", "subscription", "newsletter"].includes(type) ? { type } : {};
  const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 }).limit(500);
  return json({ enquiries });
});
