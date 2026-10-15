import { z } from "zod";
import { handler, HttpError, json, readJson } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export const PATCH = handler<{ id: string }>(async (req, { params }) => {
  const admin = await requireAdmin(req);
  const { id } = await params;
  const { role } = z.object({ role: z.enum(["customer", "admin"]) }).parse(await readJson(req));
  if (String(admin._id) === id && role !== "admin") {
    throw new HttpError(400, "You can't remove your own admin access");
  }
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) throw new HttpError(404, "User not found");
  return json({ user });
});
