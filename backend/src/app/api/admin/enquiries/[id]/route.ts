import { z } from "zod";
import { handler, HttpError, json, readJson } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { Enquiry } from "@/models/Enquiry";

export const dynamic = "force-dynamic";

type Params = { id: string };

export const PATCH = handler<Params>(async (req, { params }) => {
  await requireAdmin(req);
  const { id } = await params;
  const { status } = z.object({ status: z.enum(["new", "in_progress", "closed"]) }).parse(await readJson(req));
  const enquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
  if (!enquiry) throw new HttpError(404, "Enquiry not found");
  return json({ enquiry });
});

export const DELETE = handler<Params>(async (req, { params }) => {
  await requireAdmin(req);
  const { id } = await params;
  await Enquiry.findByIdAndDelete(id);
  return json({ ok: true });
});
