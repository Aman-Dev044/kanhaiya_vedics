"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/providers/CartProvider";
import { discountPercent, inr } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { add, setDrawerOpen } = useCart();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 200, damping: 20 });
  const glare = useTransform(
    [mx, my],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.35), transparent 55%)`,
  );

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const inStock = product.variants.filter((v) => v.stock > 0);
  const variant = inStock.find((v) => /1\s*l|500/i.test(v.label)) ?? inStock[0] ?? product.variants[0];
  const off = variant ? discountPercent(variant.price, variant.mrp) : 0;

  const quickAdd = () => {
    if (!variant || variant.stock <= 0) return;
    add({
      slug: product.slug,
      sku: variant.sku,
      name: product.name,
      variantLabel: variant.label,
      price: variant.price,
      mrp: variant.mrp,
      image: product.images[0],
      maxQty: variant.stock,
    });
    toast.success(`${product.name} (${variant.label}) added to cart`, {
      action: { label: "View cart", onClick: () => setDrawerOpen(true) },
    });
  };

  return (
    <motion.article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-border bg-surface transition-shadow duration-500 hover:shadow-[0_40px_80px_-40px_rgb(var(--shadow)/0.6)]"
    >
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-surface-2">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={`${product.name} — ${product.tagline || product.category}`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 34rem, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
          />
        )}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: glare }} />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="rounded-full bg-background/85 px-3 py-1 text-xs font-semibold tracking-wide text-heading capitalize backdrop-blur">
            {product.category}
          </span>
          {off > 0 && (
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-[#1f2a1b]">{off}% off</span>
          )}
        </div>
        <span className="absolute top-4 right-4 grid size-11 translate-y-2 place-items-center rounded-full bg-background/85 text-heading opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-5" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-6">
        {product.tagline && (
          <p className="text-xs font-semibold tracking-[0.18em] text-leaf uppercase">{product.tagline}</p>
        )}
        <h3 className="text-2xl font-semibold">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 after:content-[''] focus:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{product.shortDescription}</p>
        <div className="mt-auto flex items-end justify-between pt-3">
          {variant && (
            <div>
              <p className="text-xs text-muted">{variant.label}</p>
              <p className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold text-heading">{inr(variant.price)}</span>
                {variant.mrp > variant.price && (
                  <span className="text-sm text-muted line-through">{inr(variant.mrp)}</span>
                )}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={quickAdd}
            disabled={!variant || variant.stock <= 0}
            className="relative z-10 inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary-hover active:scale-95 disabled:opacity-50"
          >
            {variant && variant.stock > 0 ? (
              <>
                <Plus className="size-4" /> Add
              </>
            ) : (
              "Sold out"
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
