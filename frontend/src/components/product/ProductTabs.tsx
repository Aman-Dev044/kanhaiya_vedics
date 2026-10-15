"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Accordion } from "@/components/ui/Accordion";
import { cn } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductTabs({ product }: { product: Product }) {
  const tabs = [
    { id: "description", label: "Description" },
    ...(product.storage || product.shelfLife || product.usage ? [{ id: "care", label: "Storage & usage" }] : []),
    ...(product.faqs.length ? [{ id: "faqs", label: "FAQs" }] : []),
  ];
  const [tab, setTab] = useState(tabs[0].id);

  return (
    <div>
      <div role="tablist" className="flex gap-2 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors",
              tab === t.id ? "text-heading" : "text-muted hover:text-heading",
            )}
          >
            {t.label}
            {tab === t.id && (
              <motion.span layoutId="tab-underline" className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-leaf" />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          role="tabpanel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="py-8"
        >
          {tab === "description" && (
            <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
              {product.description.split(/\n+/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
          {tab === "care" && (
            <dl className="grid gap-5 sm:grid-cols-3">
              {[
                { t: "Storage", d: product.storage },
                { t: "Shelf life", d: product.shelfLife },
                { t: "How to use", d: product.usage },
              ]
                .filter((x) => x.d)
                .map((x) => (
                  <div key={x.t} className="card p-6">
                    <dt className="font-display text-lg font-semibold text-heading">{x.t}</dt>
                    <dd className="mt-2 leading-relaxed text-muted">{x.d}</dd>
                  </div>
                ))}
            </dl>
          )}
          {tab === "faqs" && <Accordion items={product.faqs} className="max-w-3xl" />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
