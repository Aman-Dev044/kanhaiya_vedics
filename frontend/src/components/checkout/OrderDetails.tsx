import Image from "next/image";
import { Check, X } from "lucide-react";
import { cn, formatDate, inr, ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL } from "@/lib/format";
import type { Order } from "@/lib/types";

const FLOW = ["placed", "confirmed", "out_for_delivery", "delivered"] as const;

export function OrderStatusTimeline({ order }: { order: Order }) {
  if (order.status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 p-4 text-red-600 dark:text-red-400">
        <X className="size-5" /> This order was cancelled.
      </div>
    );
  }
  const current = FLOW.indexOf(order.status as (typeof FLOW)[number]);
  return (
    <ol className="grid grid-cols-4 gap-2">
      {FLOW.map((s, i) => {
        const done = i <= current;
        const at = order.statusHistory?.find((h) => h.status === s)?.at;
        return (
          <li key={s} className="relative flex flex-col items-center text-center">
            {i > 0 && (
              <span
                className={cn("absolute top-4 right-1/2 h-0.5 w-full -translate-y-1/2", i <= current ? "bg-leaf" : "bg-border")}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 grid size-8 place-items-center rounded-full border-2 text-xs font-bold",
                done ? "border-leaf bg-leaf text-milk" : "border-border bg-background text-muted",
              )}
            >
              {done ? <Check className="size-4" /> : i + 1}
            </span>
            <span className={cn("mt-2 text-xs font-semibold", done ? "text-heading" : "text-muted")}>
              {ORDER_STATUS_LABEL[s]}
            </span>
            {at && <span className="text-[0.65rem] text-muted">{formatDate(at)}</span>}
          </li>
        );
      })}
    </ol>
  );
}

export function OrderDetails({ order }: { order: Order }) {
  const a = order.shippingAddress;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Order number</p>
          <p className="font-display text-2xl font-semibold text-heading">#{order.orderNumber}</p>
        </div>
        <p className="text-sm text-muted">Placed on {formatDate(order.createdAt, true)}</p>
      </div>

      <OrderStatusTimeline order={order} />

      <ul className="divide-y divide-border rounded-2xl border border-border">
        {order.items.map((i) => (
          <li key={i.sku} className="flex items-center gap-4 p-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface-2">
              {i.image && <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-heading">{i.name}</p>
              <p className="text-xs text-muted">
                {i.variantLabel} × {i.quantity}
              </p>
            </div>
            <span className="font-semibold text-heading">{inr(i.lineTotal)}</span>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-surface-2/70 p-5 text-sm">
          <p className="mb-2 font-semibold text-heading">Delivering to</p>
          <p className="text-muted">
            {order.customer.name} · {order.customer.phone}
            <br />
            {a.line1}
            {a.line2 && `, ${a.line2}`}
            {a.landmark && `, near ${a.landmark}`}
            <br />
            {a.city}, {a.state} – {a.pincode}
          </p>
          <p className="mt-2 text-muted capitalize">Slot: {order.deliverySlot}</p>
        </div>
        <dl className="space-y-2 rounded-2xl bg-surface-2/70 p-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{inr(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd>{order.deliveryFee ? inr(order.deliveryFee) : "FREE"}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold text-heading">
            <dt>Total</dt>
            <dd>{inr(order.total)}</dd>
          </div>
          <div className="flex justify-between pt-1 text-xs text-muted">
            <dt>{PAYMENT_METHOD_LABEL[order.paymentMethod]}</dt>
            <dd className="capitalize">{order.paymentStatus}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
