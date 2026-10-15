import { handler, HttpError, json } from "@/lib/http";
import { requireUser } from "@/lib/auth";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

export const GET = handler<{ id: string }>(async (req, { params }) => {
  const user = await requireUser(req);
  const { id } = await params;
  const order = await Order.findById(id);
  const isOwner =
    order && (String(order.user) === String(user._id) || order.customer?.email === user.email);
  if (!order || (!isOwner && user.role !== "admin")) throw new HttpError(404, "Order not found");
  return json({ order });
});
