import { handler, json, readJson } from "@/lib/http";
import { getAuthUser, requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { Product } from "@/models/Product";

export const dynamic = "force-dynamic";

export const GET = handler(async (req) => {
  const params = req.nextUrl.searchParams;
  const filter: Record<string, unknown> = {};

  // Admins may request inactive products too (?all=1); everyone else sees active only.
  const user = params.get("all") === "1" ? await getAuthUser(req) : null;
  if (user?.role !== "admin") filter.isActive = true;

  const category = params.get("category");
  if (category === "milk" || category === "ghee") filter.category = category;
  if (params.get("featured") === "1") filter.featured = true;

  const products = await Product.find(filter).sort({ sortOrder: 1, createdAt: 1 });
  return json({ products });
});

export const POST = handler(async (req) => {
  await requireAdmin(req);
  const data = productSchema.parse(await readJson(req));
  const product = await Product.create(data);
  return json({ product }, 201);
});
