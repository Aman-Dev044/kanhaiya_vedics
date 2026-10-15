import type { z } from "zod";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { getSettings } from "@/models/Settings";
import { HttpError } from "./http";
import type { createOrderSchema } from "./validators";

type OrderInput = z.infer<typeof createOrderSchema>;

function generateOrderNumber() {
  const d = new Date();
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `KV${date}${rand}`;
}

export async function restoreStock(items: { product: unknown; sku: string; quantity: number }[]) {
  await Promise.all(
    items.map((i) =>
      Product.updateOne(
        { _id: i.product, "variants.sku": i.sku },
        { $inc: { "variants.$.stock": i.quantity } },
      ),
    ),
  );
}

/**
 * Prices are always taken from the database, never from the client.
 * Stock is reserved atomically per line; if any line fails, earlier reservations are rolled back.
 */
export async function placeOrder(input: OrderInput, userId?: unknown) {
  const settings = await getSettings();
  const delivery = settings.delivery!;

  if (input.paymentMethod === "cod" && !delivery.codEnabled) {
    throw new HttpError(400, "Cash on delivery is currently unavailable");
  }
  if (input.paymentMethod === "upi_on_delivery" && !delivery.upiOnDeliveryEnabled) {
    throw new HttpError(400, "UPI on delivery is currently unavailable");
  }
  if (
    delivery.serviceablePincodes.length > 0 &&
    !delivery.serviceablePincodes.includes(input.shippingAddress.pincode)
  ) {
    throw new HttpError(400, "Sorry, we don't deliver to this pincode yet");
  }

  // Merge duplicate lines (same sku) so stock checks are accurate.
  const merged = new Map<string, OrderInput["items"][number]>();
  for (const item of input.items) {
    const existing = merged.get(item.sku);
    if (existing) existing.quantity += item.quantity;
    else merged.set(item.sku, { ...item });
  }
  const lines = [...merged.values()];

  const products = await Product.find({
    slug: { $in: [...new Set(lines.map((l) => l.slug))] },
    isActive: true,
  });

  const items = lines.map((line) => {
    const product = products.find((p) => p.slug === line.slug);
    if (!product) throw new HttpError(400, "A product in your cart is no longer available");
    const variant = product.variants.find((v) => v.sku === line.sku);
    if (!variant) throw new HttpError(400, `Selected size of ${product.name} is no longer available`);
    if (variant.stock < line.quantity) {
      throw new HttpError(409, `Only ${variant.stock} left for ${product.name} (${variant.label})`);
    }
    return {
      product: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      sku: variant.sku,
      variantLabel: variant.label,
      price: variant.price,
      quantity: line.quantity,
      lineTotal: variant.price * line.quantity,
    };
  });

  const reserved: typeof items = [];
  for (const item of items) {
    const res = await Product.updateOne(
      { _id: item.product, variants: { $elemMatch: { sku: item.sku, stock: { $gte: item.quantity } } } },
      { $inc: { "variants.$.stock": -item.quantity } },
    );
    if (res.modifiedCount !== 1) {
      await restoreStock(reserved);
      throw new HttpError(409, `${item.name} (${item.variantLabel}) just went out of stock`);
    }
    reserved.push(item);
  }

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const deliveryFee = subtotal >= delivery.freeAbove ? 0 : delivery.fee;

  try {
    return await Order.create({
      orderNumber: generateOrderNumber(),
      user: userId || undefined,
      customer: input.customer,
      shippingAddress: input.shippingAddress,
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      paymentMethod: input.paymentMethod,
      deliverySlot: input.deliverySlot,
      notes: input.notes || undefined,
      statusHistory: [{ status: "placed", note: "Order placed" }],
    });
  } catch (err) {
    await restoreStock(reserved);
    throw err;
  }
}
