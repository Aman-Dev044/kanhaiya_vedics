import { handler, HttpError, json, readJson } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { restoreStock } from "@/lib/orders";
import { updateOrderSchema } from "@/lib/validators";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

export const PATCH = handler<{ id: string }>(async (req, { params }) => {
  await requireAdmin(req);
  const { id } = await params;
  const data = updateOrderSchema.parse(await readJson(req));

  const order = await Order.findById(id);
  if (!order) throw new HttpError(404, "Order not found");

  if (data.status && data.status !== order.status) {
    if (order.status === "cancelled") throw new HttpError(400, "A cancelled order cannot be reopened");
    if (data.status === "cancelled") await restoreStock(order.items);
    order.status = data.status;
    order.statusHistory.push({ status: data.status, note: data.note, at: new Date() });
    if (data.status === "delivered" && order.paymentStatus === "pending") order.paymentStatus = "paid";
  }
  if (data.paymentStatus) order.paymentStatus = data.paymentStatus;

  await order.save();
  return json({ order });
});
