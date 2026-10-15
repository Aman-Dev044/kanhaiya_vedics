"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import type { SiteSettings } from "@/lib/types";

/** Counts up the numeric part of values like "2,000+" or "100%"; non-numeric values render as-is. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const match = value.match(/^(\D*)([\d,.]+)(.*)$/);
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!inView || !match) return;
    const target = parseFloat(match[2].replace(/,/g, ""));
    const decimals = (match[2].split(".")[1] || "").length;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) =>
        setDisplay(
          `${match[1]}${v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${match[3]}`,
        ),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return <span ref={ref}>{display}</span>;
}

export function Stats({ stats }: { stats: SiteSettings["stats"] }) {
  if (!stats.length) return null;
  return (
    <section className="container-x py-20 sm:py-24" aria-label="Kanhaiya Vedics in numbers">
      <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label} className="bg-background p-6 text-center sm:p-10">
            <p className="font-display text-4xl font-semibold text-heading sm:text-5xl">
              <CountUp value={s.value} />
            </p>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
