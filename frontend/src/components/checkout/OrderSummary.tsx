"use client";

import Image from "next/image";
import { useSettings } from "@/components/providers/SettingsProvider";
import { inr } from "@/lib/format";
import type { CartItem } from "@/components/providers/CartProvider";

export function useTotals(subtotal: number) {
  const { delivery } = useSettings();
  const deliveryFee = subtotal === 0 || subtotal >= delivery.freeAbove ? 0 : delivery.fee;
  return { deliveryFee, total: subtotal + deliveryFee, freeAbove: delivery.freeAbove };
}

export function OrderSummary({
  items,
  subtotal,
  children,
}: {
  items: CartItem[];
  subtotal: number;
  children?: React.ReactNode;
}) {
  const { deliveryFee, total, freeAbove } = useTotals(subtotal);
  return (
    <div className="card space-y-5 p-6 sm:p-8">
      <h2 className="text-2xl font-semibold">Order summary</h2>
      <ul className="space-y-4">
        {items.map((i) => (
          <li key={i.sku} className="flex items-center gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
              {i.image && <Image src={i.image} alt="" fill sizes="64px" className="object-cover" />}
              <span className="absolute -top-0 -right-0 grid min-w-5 place-items-center rounded-bl-lg bg-primary px-1 text-[0.65rem] font-bold text-primary-foreground">
                {i.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-heading">{i.name}</p>
              <p className="text-xs text-muted">{i.variantLabel}</p>
            </div>
            <span className="font-semibold text-heading">{inr(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="space-y-2 border-t border-border pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="text-heading">{inr(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Delivery</dt>
          <dd className={deliveryFee === 0 ? "font-semibold text-leaf" : "text-heading"}>
            {deliveryFee === 0 ? "FREE" : inr(deliveryFee)}
          </dd>
        </div>
        {deliveryFee > 0 && (
          <p className="text-xs text-muted">Add {inr(freeAbove - subtotal)} more for free delivery.</p>
        )}
        <div className="flex justify-between border-t border-border pt-3 text-base">
          <dt className="font-semibold text-heading">Total</dt>
          <dd className="font-display text-2xl font-semibold text-heading">{inr(total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  );
}
