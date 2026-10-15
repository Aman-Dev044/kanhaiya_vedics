import { handler, json, readJson } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { toDotPaths } from "@/lib/object";
import { settingsSchema } from "@/lib/validators";
import { Settings, getSettings } from "@/models/Settings";

export const dynamic = "force-dynamic";

export const GET = handler(async () => json({ settings: await getSettings() }));

export const PUT = handler(async (req) => {
  await requireAdmin(req);
  const data = settingsSchema.parse(await readJson(req));
  await getSettings(); // ensure the document exists
  const { stats, testimonials, faqs, ...rest } = data;
  const update: Record<string, unknown> = toDotPaths(rest);
  // Arrays are replaced wholesale.
  if (stats) update.stats = stats;
  if (testimonials) update.testimonials = testimonials;
  if (faqs) update.faqs = faqs;
  const settings = await Settings.findOneAndUpdate(
    { key: "site" },
    { $set: update },
    { new: true, runValidators: true },
  );
  return json({ settings });
});
