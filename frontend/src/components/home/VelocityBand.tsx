"use client";

import { VelocityText } from "@/components/ui/Motion";
import { LeafMark } from "@/components/brand/Logo";

/** Two rows of oversized type that drift in opposite directions and react to scroll speed. */
export function VelocityBand() {
  return (
    <section aria-hidden className="space-y-2 overflow-hidden py-14 select-none sm:py-20">
      <VelocityText baseVelocity={-1.5} className="font-display text-6xl font-semibold tracking-tight text-heading sm:text-8xl lg:text-[9rem]">
        <span className="inline-flex items-center gap-10">
          Shuddh <LeafMark className="h-10 w-auto sm:h-16" /> Desi <LeafMark className="h-10 w-auto sm:h-16" /> Vedic
          <LeafMark className="h-10 w-auto sm:h-16" />
        </span>
      </VelocityText>
      <VelocityText
        baseVelocity={1.5}
        className="font-display text-6xl font-semibold tracking-tight text-transparent italic [-webkit-text-stroke:1.5px_var(--leaf)] sm:text-8xl lg:text-[9rem]"
      >
        <span className="inline-flex items-center gap-10">
          From Farm to Homes <span className="text-gold [-webkit-text-stroke:0]">✦</span>
        </span>
      </VelocityText>
    </section>
  );
}
