"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { ButtonLink } from "@/components/ui/Button";
import { inr } from "@/lib/format";

export function CartDrawer() {
  const { items, subtotal, drawerOpen, setDrawerOpen, setQty, remove } = useCart();
  const { delivery } = useSettings();
  const remaining = Math.max(0, delivery.freeAbove - subtotal);
  const progress = Math.min(100, (subtotal / Math.max(1, delivery.freeAbove)) * 100);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDrawerOpen]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed top-0 right-0 z-[61] flex h-dvh w-full max-w-md flex-col bg-background shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="text-2xl font-semibold">Your Cart</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="grid size-10 place-items-center rounded-full hover:bg-surface-2"
                aria-label="Close cart"
              >
                <X className="size-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="grid size-20 place-items-center rounded-full bg-leaf-soft">
                  <ShoppingBag className="size-8 text-leaf" />
                </div>
                <p className="font-display text-xl text-heading">Your cart is empty</p>
                <p className="text-sm text-muted">Fresh milk and golden ghee are just a click away.</p>
                <ButtonLink href="/products" onClick={() => setDrawerOpen(false)}>
                  Browse products
                </ButtonLink>
              </div>
            ) : (
              <>
                <div className="border-b border-border px-6 py-4">
                  <p className="text-sm text-muted">
                    {remaining > 0 ? (
                      <>
                        Add <strong className="text-heading">{inr(remaining)}</strong> more for{" "}
                        <strong className="text-leaf">free delivery</strong>
                      </>
                    ) : (
                      <strong className="text-leaf">🎉 You&apos;ve unlocked free delivery!</strong>
                    )}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-leaf to-gold"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>

                <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.sku}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0 }}
                        className="flex gap-4 rounded-2xl border border-border bg-surface p-3"
                      >
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                          {item.image && (
                            <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                href={`/products/${item.slug}`}
                                onClick={() => setDrawerOpen(false)}
                                className="font-display font-semibold text-heading hover:text-leaf"
                              >
                                {item.name}
                              </Link>
                              <p className="text-xs text-muted">{item.variantLabel}</p>
                            </div>
                            <button
                              onClick={() => remove(item.sku)}
                              className="text-muted hover:text-red-500"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <QtyStepper
                              value={item.quantity}
                              max={item.maxQty}
                              onChange={(q) => setQty(item.sku, q)}
                            />
                            <span className="font-semibold text-heading">{inr(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="space-y-3 border-t border-border bg-surface px-6 py-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-semibold text-heading">{inr(subtotal)}</span>
                  </div>
                  <p className="text-xs text-muted">Delivery charges calculated at checkout.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ButtonLink href="/cart" variant="outline" onClick={() => setDrawerOpen(false)}>
                      View cart
                    </ButtonLink>
                    <ButtonLink href="/checkout" onClick={() => setDrawerOpen(false)}>
                      Checkout
                    </ButtonLink>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function QtyStepper({
  value,
  onChange,
  max = 50,
  size = "sm",
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  size?: "sm" | "lg";
}) {
  const btn = size === "lg" ? "size-12" : "size-8";
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background">
      <button
        type="button"
        className={`${btn} grid place-items-center rounded-full text-heading hover:bg-surface-2`}
        onClick={() => onChange(value - 1)}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </button>
      <span className={`${size === "lg" ? "w-10 text-base" : "w-7 text-sm"} text-center font-semibold tabular-nums`}>
        {value}
      </span>
      <button
        type="button"
        className={`${btn} grid place-items-center rounded-full text-heading hover:bg-surface-2 disabled:opacity-40`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
