"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";

export type CartItem = {
  slug: string;
  sku: string;
  name: string;
  variantLabel: string;
  price: number;
  mrp: number;
  image?: string;
  quantity: number;
  maxQty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
  /** Re-sync names/prices/stock with the latest product data. */
  reconcile: (products: Product[]) => void;
};

const CART_KEY = "kv-cart";
const MAX_PER_LINE = 50;

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback<CartContextValue["add"]>((item, qty = 1) => {
    setItems((prev) => {
      const cap = Math.min(MAX_PER_LINE, item.maxQty);
      const existing = prev.find((i) => i.sku === item.sku);
      if (existing) {
        return prev.map((i) =>
          i.sku === item.sku ? { ...i, ...item, quantity: Math.min(cap, i.quantity + qty) } : i,
        );
      }
      return [...prev, { ...item, quantity: Math.min(cap, qty) }];
    });
  }, []);

  const setQty = useCallback((sku: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.sku !== sku)
        : prev.map((i) =>
            i.sku === sku ? { ...i, quantity: Math.min(qty, i.maxQty, MAX_PER_LINE) } : i,
          ),
    );
  }, []);

  const remove = useCallback((sku: string) => setItems((prev) => prev.filter((i) => i.sku !== sku)), []);
  const clear = useCallback(() => setItems([]), []);

  const reconcile = useCallback((products: Product[]) => {
    setItems((prev) =>
      prev.flatMap((item) => {
        const product = products.find((p) => p.slug === item.slug && p.isActive !== false);
        const variant = product?.variants.find((v) => v.sku === item.sku);
        if (!product || !variant || variant.stock <= 0) return [];
        return [
          {
            ...item,
            name: product.name,
            variantLabel: variant.label,
            price: variant.price,
            mrp: variant.mrp,
            image: product.images[0],
            maxQty: variant.stock,
            quantity: Math.min(item.quantity, variant.stock),
          },
        ];
      }),
    );
  }, []);

  const value = useMemo(
    () => ({
      items,
      ready,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.quantity, 0),
      drawerOpen,
      setDrawerOpen,
      add,
      setQty,
      remove,
      clear,
      reconcile,
    }),
    [items, ready, drawerOpen, add, setQty, remove, clear, reconcile],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
