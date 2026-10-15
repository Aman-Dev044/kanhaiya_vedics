"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { OrderDetails } from "@/components/checkout/OrderDetails";
import { ButtonLink } from "@/components/ui/Button";
import { LAST_ORDER_KEY } from "../checkout/CheckoutForm";
import type { Order } from "@/lib/types";

export function OrderSuccess() {
  const orderNumber = useSearchParams().get("order");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LAST_ORDER_KEY);
      const o = raw ? (JSON.parse(raw) as Order) : null;
      if (o && o.orderNumber === orderNumber) setOrder(o);
    } catch {}
  }, [orderNumber]);

  return (
    <div className="container-x max-w-3xl py-16 sm:py-24">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -120 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mx-auto grid size-24 place-items-center rounded-full bg-leaf text-milk shadow-[0_20px_50px_-15px_var(--leaf)]"
        >
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.35, type: "spring" }}>
            <Check className="size-12" strokeWidth={3} />
          </motion.span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-4xl font-semibold sm:text-5xl"
        >
          Thank you! Your order is placed.
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 text-lg text-muted">
          {orderNumber ? (
            <>
              Your order <strong className="text-heading">#{orderNumber}</strong> is confirmed. We&apos;ll call you if we need anything.
            </>
          ) : (
            "We've received your order."
          )}
        </motion.p>
      </div>

      {order && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card mt-12 p-6 sm:p-8">
          <OrderDetails order={order} />
        </motion.div>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/products">Continue shopping</ButtonLink>
        <ButtonLink href={`/track-order${orderNumber ? `?order=${orderNumber}` : ""}`} variant="outline">
          Track order
        </ButtonLink>
      </div>
    </div>
  );
}
