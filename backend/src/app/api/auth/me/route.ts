import { handler, json, readJson } from "@/lib/http";
import { requireUser } from "@/lib/auth";
import { profileSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export const GET = handler(async (req) => json({ user: await requireUser(req) }));

export const PATCH = handler(async (req) => {
  const user = await requireUser(req);
  const data = profileSchema.parse(await readJson(req));
  if (data.name) user.name = data.name;
  if (data.phone !== undefined) user.phone = data.phone || undefined;
  if (data.address) user.set("address", data.address);
  await user.save();
  return json({ user });
});
