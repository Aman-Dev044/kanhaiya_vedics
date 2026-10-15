"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/providers/CartProvider";
import { QtyStepper } from "@/components/layout/CartDrawer";
import { Button } from "@/components/ui/Button";
import { cn, discountPercent, inr } from "@/lib/format";
import type { Product } from "@/lib/types";

export function AddToCart({ product }: { product: Product }) {
  const router = useRouter();
  const { add, setDrawerOpen } = useCart();
  const firstAvailable = product.variants.findIndex((v) => v.stock > 0);
  const [index, setIndex] = useState(Math.max(0, firstAvailable));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants[index];
  const soldOut = !variant || variant.stock <= 0;
  const off = variant ? discountPercent(variant.price, variant.mrp) : 0;

  const addToCart = () => {
    if (soldOut) return;
    add(
      {
        slug: product.slug,
        sku: variant.sku,
        name: product.name,
        variantLabel: variant.label,
        price: variant.price,
        mrp: variant.mrp,
        image: product.images[0],
        maxQty: variant.stock,
      },
      qty,
    );
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-baseline gap-3">
        <motion.span
          key={variant?.price}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-semibold text-heading"
        >
          {variant ? inr(variant.price) : "—"}
        </motion.span>
        {variant && variant.mrp > variant.price && (
          <>
            <span className="text-lg text-muted line-through">{inr(variant.mrp)}</span>
            <span className="rounded-full bg-gold-soft px-3 py-1 text-sm font-semibold text-gold">Save {off}%</span>
          </>
        )}
        <span className="w-full text-xs text-muted">Inclusive of all taxes</span>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-heading">Choose size</legend>
        <div className="flex flex-wrap gap-3">
          {product.variants.map((v, i) => (
            <button
              key={v.sku}
              type="button"
              onClick={() => {
                setIndex(i);
                setQty(1);
              }}
              disabled={v.stock <= 0}
              aria-pressed={i === index}
              className={cn(
                "relative rounded-2xl border px-5 py-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-45",
                i === index ? "border-leaf bg-leaf-soft" : "border-border hover:border-heading/40",
              )}
            >
              {i === index && (
                <motion.span
                  layoutId="variant-ring"
                  className="absolute inset-0 rounded-2xl ring-2 ring-leaf"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="block font-semibold text-heading">{v.label}</span>
              <span className="block text-xs text-muted">{v.stock > 0 ? inr(v.price) : "Sold out"}</span>
            </button>
          ))}
        </div>
        {variant && variant.stock > 0 && variant.stock <= 10 && (
          <p className="mt-3 text-sm font-medium text-gold">Only {variant.stock} left — order soon!</p>
        )}
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <QtyStepper value={qty} max={variant?.stock || 1} onChange={(q) => setQty(Math.max(1, q))} size="lg" />
        <Button
          size="lg"
          className="flex-1"
          disabled={soldOut}
          onClick={() => {
            addToCart();
            setAdded(true);
            setTimeout(() => setAdded(false), 1800);
            toast.success(`${product.name} (${variant.label}) added to cart`, {
              action: { label: "View cart", onClick: () => setDrawerOpen(true) },
            });
          }}
        >
          {added ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
          {soldOut ? "Sold out" : added ? "Added!" : "Add to cart"}
        </Button>
      </div>
      <Button
        size="lg"
        variant="gold"
        className="w-full"
        disabled={soldOut}
        onClick={() => {
          addToCart();
          router.push("/checkout");
        }}
      >
        <Zap className="size-5" /> Buy now
      </Button>
    </div>
  );
}
