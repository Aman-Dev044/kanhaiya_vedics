"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Sunrise, Snowflake, Truck, Sprout } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { cn } from "@/lib/format";

export function Journey({ morningSlot }: { morningSlot: string }) {
  const STEPS = [
    {
      Icon: Sprout,
      title: "Grass-fed desi cows",
      text: "Our desi indigenous cows graze on open pastures and eat natural fodder. Happy, healthy cows give honest milk.",
      meta: { big: "Open pastures", small: "Natural fodder · No hormones" },
    },
    {
      Icon: Sunrise,
      title: "Milked at dawn",
      text: "Every morning the cows are milked gently with care, keeping every step hygienic and stress-free.",
      meta: { big: "Every dawn", small: "Gentle · Hygienic · Unhurried" },
    },
    {
      Icon: Snowflake,
      title: "Chilled & glass-bottled",
      text: "Milk is chilled within minutes and filled into clean, reusable glass bottles — no plastic, no preservatives.",
      meta: { big: "Below 5°C", small: "Sealed in clean glass bottles" },
    },
    {
      Icon: Truck,
      title: "At your door, fresh",
      text: "Our delivery partners bring it straight to your home in the morning or evening slot you choose.",
      meta: { big: morningSlot, small: "Morning doorstep delivery" },
    },
  ];

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const dotTop = useTransform(scaleY, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);

  return (
    <section className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="journey-title">
      <div aria-hidden className="absolute top-1/4 -left-40 -z-10 size-[30rem] rounded-full bg-gold-soft/70 blur-3xl" />
      <div aria-hidden className="absolute -right-40 bottom-0 -z-10 size-[30rem] rounded-full bg-leaf-soft/70 blur-3xl" />
      <div className="container-x">
        <SectionHeading
          eyebrow="From Farm to Homes"
          title={<span id="journey-title">The journey of every bottle</span>}
          subtitle="No middlemen, no long warehouses. Just a short, careful path from our cows to your kitchen."
        />

        <div ref={ref} className="relative mx-auto mt-20 max-w-5xl">
          <div className="absolute top-0 bottom-0 left-6 w-px bg-border md:left-1/2" aria-hidden />
          <motion.div
            aria-hidden
            style={{ scaleY }}
            className="absolute top-0 bottom-0 left-6 w-[3px] origin-top -translate-x-px rounded-full bg-gradient-to-b from-leaf via-leaf to-gold md:left-1/2"
          />
          {/* Glowing traveller at the tip of the line */}
          <motion.div aria-hidden style={{ top: dotTop }} className="absolute left-6 z-20 -translate-x-1/2 -translate-y-1/2 md:left-1/2">
            <span className="block size-4 rounded-full bg-gold shadow-[0_0_0_6px_color-mix(in_srgb,var(--gold)_25%,transparent),0_0_24px_var(--gold)]" />
          </motion.div>

          <ol className="space-y-16 md:space-y-24">
            {STEPS.map(({ Icon, title, text, meta }, i) => {
              const right = i % 2 === 1;
              return (
                <li key={title} className="relative grid items-center gap-6 pl-20 md:grid-cols-2 md:pl-0">
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-120px" }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="absolute top-0 left-0 z-10 grid size-12 place-items-center rounded-full border-4 border-background bg-leaf text-milk shadow-lg md:top-1/2 md:left-1/2 md:size-16 md:-translate-x-1/2 md:-translate-y-1/2"
                  >
                    <span className="absolute inset-0 animate-ping rounded-full bg-leaf/30 [animation-duration:2.5s]" />
                    <Icon className="relative size-5 md:size-6" />
                  </motion.span>

                  <Reveal
                    direction={right ? "left" : "right"}
                    className={cn("md:row-start-1 md:max-w-sm", right ? "md:col-start-2 md:pl-16" : "md:col-start-1 md:ml-auto md:pr-16 md:text-right")}
                  >
                    <p className="font-display text-sm text-gold italic">Step {String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 text-2xl font-semibold sm:text-3xl">{title}</h3>
                    <p className="mt-3 leading-relaxed text-muted">{text}</p>
                  </Reveal>

                  {/* Detail card on the opposite side */}
                  <Reveal
                    direction={right ? "right" : "left"}
                    delay={0.15}
                    className={cn("hidden md:row-start-1 md:block", right ? "md:col-start-1 md:mr-16 md:justify-self-end" : "md:col-start-2 md:ml-16")}
                  >
                    <div className="card relative overflow-hidden px-6 py-5 shadow-[0_20px_50px_-30px_rgb(var(--shadow)/0.5)]">
                      <span className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-leaf to-gold" />
                      <p className="font-display text-2xl font-semibold text-heading italic">{meta.big}</p>
                      <p className="mt-1 text-sm text-muted">{meta.small}</p>
                      <span className="pointer-events-none absolute -right-3 -bottom-4 font-display text-7xl font-semibold text-heading/[0.06]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
