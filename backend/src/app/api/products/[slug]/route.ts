import { handler, HttpError, json, readJson } from "@/lib/http";
import { getAuthUser, requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { Product } from "@/models/Product";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export const GET = handler<Params>(async (req, { params }) => {
  const { slug } = await params;
  const product = await Product.findOne({ slug });
  if (!product) throw new HttpError(404, "Product not found");
  if (!product.isActive) {
    const user = await getAuthUser(req);
    if (user?.role !== "admin") throw new HttpError(404, "Product not found");
  }
  return json({ product });
});

export const PUT = handler<Params>(async (req, { params }) => {
  await requireAdmin(req);
  const { slug } = await params;
  const data = productSchema.parse(await readJson(req));
  const product = await Product.findOneAndUpdate({ slug }, data, { new: true, runValidators: true });
  if (!product) throw new HttpError(404, "Product not found");
  return json({ product });
});

export const DELETE = handler<Params>(async (req, { params }) => {
  await requireAdmin(req);
  const { slug } = await params;
  const product = await Product.findOneAndDelete({ slug });
  if (!product) throw new HttpError(404, "Product not found");
  return json({ ok: true });
});
