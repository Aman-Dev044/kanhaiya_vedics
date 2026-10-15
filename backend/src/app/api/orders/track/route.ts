import { handler, HttpError, json } from "@/lib/http";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

const last10 = (s: string) => s.replace(/\D/g, "").slice(-10);

// Public order tracking: requires both the order number and the phone used at checkout.
export const GET = handler(async (req) => {
  const orderNumber = req.nextUrl.searchParams.get("orderNumber")?.trim().toUpperCase();
  const phone = req.nextUrl.searchParams.get("phone");
  if (!orderNumber || !phone) throw new HttpError(400, "Order number and phone are required");

  const order = await Order.findOne({ orderNumber });
  if (!order || last10(order.customer?.phone || "") !== last10(phone)) {
    throw new HttpError(404, "No order found with these details");
  }
  return json({ order });
});
