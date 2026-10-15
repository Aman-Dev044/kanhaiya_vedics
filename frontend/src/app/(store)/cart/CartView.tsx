"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { QtyStepper } from "@/components/layout/CartDrawer";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { ButtonLink } from "@/components/ui/Button";
import { inr } from "@/lib/format";

export function CartView() {
  const { items, subtotal, setQty, remove, ready } = useCart();

  if (!ready) return <div className="container-x min-h-[60vh] py-16" />;

  if (items.length === 0) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-5 py-16 text-center">
        <div className="grid size-24 place-items-center rounded-full bg-leaf-soft">
          <ShoppingBag className="size-10 text-leaf" />
        </div>
        <h1 className="text-4xl font-semibold">Your cart is empty</h1>
        <p className="max-w-md text-muted">Fresh milk and golden bilona ghee are waiting for you.</p>
        <ButtonLink href="/products" size="lg">
          Start shopping <ArrowRight className="size-4" />
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="container-x py-12 sm:py-16">
      <h1 className="text-4xl font-semibold sm:text-5xl">Your cart</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <ul className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.sku}
                layout
                exit={{ opacity: 0, x: -60 }}
                className="card flex gap-5 p-4 sm:p-5"
              >
                <Link href={`/products/${item.slug}`} className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-2 sm:w-28">
                  {item.image && <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link href={`/products/${item.slug}`} className="font-display text-xl font-semibold text-heading hover:text-leaf">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted">
                        {item.variantLabel} · {inr(item.price)} each
                      </p>
                    </div>
                    <button
                      onClick={() => remove(item.sku)}
                      className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-red-500"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <QtyStepper value={item.quantity} max={item.maxQty} onChange={(q) => setQty(item.sku, q)} />
                    <span className="font-display text-xl font-semibold text-heading">{inr(item.price * item.quantity)}</span>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary items={items} subtotal={subtotal}>
            <ButtonLink href="/checkout" size="lg" className="w-full">
              Proceed to checkout <ArrowRight className="size-4" />
            </ButtonLink>
            <Link href="/products" className="block text-center text-sm text-muted hover:text-leaf">
              Continue shopping
            </Link>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
