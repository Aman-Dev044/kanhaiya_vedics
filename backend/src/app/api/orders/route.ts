import { handler, json, readJson } from "@/lib/http";
import { getAuthUser, requireUser } from "@/lib/auth";
import { placeOrder } from "@/lib/orders";
import { createOrderSchema } from "@/lib/validators";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

// Guests can check out; signed-in customers get the order linked to their account.
export const POST = handler(async (req) => {
  const user = await getAuthUser(req);
  const data = createOrderSchema.parse(await readJson(req));
  const order = await placeOrder(data, user?._id);
  return json({ order }, 201);
});

export const GET = handler(async (req) => {
  const user = await requireUser(req);
  const orders = await Order.find({ $or: [{ user: user._id }, { "customer.email": user.email }] })
    .sort({ createdAt: -1 })
    .limit(100);
  return json({ orders });
});
