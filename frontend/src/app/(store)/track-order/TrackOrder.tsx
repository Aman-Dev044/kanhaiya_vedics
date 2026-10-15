"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OrderDetails } from "@/components/checkout/OrderDetails";
import { api, ApiError } from "@/lib/api";
import type { Order } from "@/lib/types";

export function TrackOrder() {
  const params = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get("order") || "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const q = new URLSearchParams({ orderNumber: orderNumber.trim(), phone: phone.trim() });
      const res = await api<{ order: Order }>(`/api/orders/track?${q}`);
      setOrder(res.order);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x max-w-3xl py-14">
      <form onSubmit={onSubmit} className="card grid gap-4 p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-8">
        <div>
          <label htmlFor="t-order" className="label">
            Order number
          </label>
          <input id="t-order" required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="KV2610…" className="field uppercase" />
        </div>
        <div>
          <label htmlFor="t-phone" className="label">
            Mobile number
          </label>
          <input id="t-phone" required type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" className="field" />
        </div>
        <Button type="submit" loading={loading} className="h-[3.1rem]">
          <Search className="size-4" /> Track
        </Button>
      </form>

      {error && <p className="mt-6 rounded-2xl bg-red-500/10 p-4 text-center text-red-600 dark:text-red-400">{error}</p>}

      <AnimatePresence>
        {order && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card mt-8 p-6 sm:p-8">
            <OrderDetails order={order} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
