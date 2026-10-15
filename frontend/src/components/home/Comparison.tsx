"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { LeafMark } from "@/components/brand/Logo";
import { SectionHeading } from "@/components/ui/Reveal";

const ROWS = [
  { topic: "Source", them: "Pooled from many dairies & breeds", us: "Only desi indigenous cows" },
  { topic: "Processing", them: "Standardised & homogenised", us: "Raw & unprocessed" },
  { topic: "Freshness", them: "Travels through long supply chains", us: "Farm to your door the same day" },
  { topic: "Packaging", them: "Single-use plastic pouches", us: "Reusable glass bottles" },
  { topic: "Taste", them: "Thin, uniform, no malai", us: "Rich, creamy, thick malai" },
  { topic: "Traceability", them: "You rarely know the farm", us: "One farm, one family" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Comparison() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28" aria-labelledby="compare-title">
      <div aria-hidden className="absolute top-1/3 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-leaf-soft/70 blur-3xl" />
      <div className="container-x">
        <SectionHeading
          eyebrow="The Difference"
          title={<span id="compare-title">Not all milk is the same</span>}
          subtitle="Here's what changes when you switch from regular packet milk to Kanhaiya Vedics."
        />

        <div className="relative mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2 md:gap-8">
          {/* VS badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            className="absolute top-1/2 left-1/2 z-10 hidden size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-background bg-gold font-display text-lg font-bold text-[#1f2a1b] shadow-xl md:grid"
          >
            VS
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="rounded-[2rem] border border-border bg-surface/70 p-7 sm:p-9"
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">Regular packet milk</p>
            <ul className="mt-6 space-y-5">
              {ROWS.map((r, i) => (
                <motion.li
                  key={r.topic}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex gap-3"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-500">
                    <X className="size-3.5" strokeWidth={3} />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold tracking-wider text-muted uppercase">{r.topic}</span>
                    <span className="text-muted">{r.them}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="relative overflow-hidden rounded-[2rem] bg-[#1f3d1c] p-7 text-[#fbf8f1] shadow-[0_40px_80px_-40px_rgba(31,61,28,0.8)] sm:p-9 dark:bg-[#15270f] dark:ring-1 dark:ring-[#a9cf72]/30"
          >
            <LeafMark className="absolute -top-2 -right-4 h-24 w-auto rotate-12 opacity-20" />
            <p className="text-xs font-semibold tracking-[0.25em] text-[#e2bf6c] uppercase">Kanhaiya Vedics</p>
            <ul className="mt-6 space-y-5">
              {ROWS.map((r, i) => (
                <motion.li
                  key={r.topic}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex gap-3"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.45 + i * 0.08 }}
                    className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#a9cf72] text-[#1f3d1c]"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </motion.span>
                  <span>
                    <span className="block text-xs font-semibold tracking-wider text-[#fbf8f1]/60 uppercase">{r.topic}</span>
                    <span className="font-medium">{r.us}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
