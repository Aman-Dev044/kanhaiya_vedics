import { handler, json, escapeRegex } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { Order, ORDER_STATUSES } from "@/models/Order";

export const dynamic = "force-dynamic";

export const GET = handler(async (req) => {
  await requireAdmin(req);
  const params = req.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 20));

  const filter: Record<string, unknown> = {};
  const status = params.get("status");
  if (status && (ORDER_STATUSES as readonly string[]).includes(status)) filter.status = status;

  const q = params.get("q")?.trim();
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ orderNumber: rx }, { "customer.name": rx }, { "customer.phone": rx }, { "customer.email": rx }];
  }

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Order.countDocuments(filter),
  ]);
  return json({ orders, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
});
