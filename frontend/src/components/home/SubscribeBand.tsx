"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarCheck, PauseCircle, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { LeafMark } from "@/components/brand/Logo";

export function SubscribeBand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <section ref={ref} className="container-x py-12" aria-labelledby="subscribe-title">
      <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-[#1f3d1c] px-6 py-16 text-[#fbf8f1] sm:px-12 lg:px-16 lg:py-20 dark:bg-[#15270f]">
        <div aria-hidden className="absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-[#4f7a28]/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 left-1/3 -z-10 size-96 rounded-full bg-[#b98e35]/25 blur-3xl" />
        <div aria-hidden className="grain absolute inset-0 -z-10 opacity-[0.08] mix-blend-overlay" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow text-[#e2bf6c]">Daily Subscription</p>
            <h2 id="subscribe-title" className="mt-4 text-4xl leading-[1.08] font-semibold text-[#fbf8f1] sm:text-5xl">
              Wake up to fresh milk at your door, every single day.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#fbf8f1]/75">
              Set it once and forget it. Choose your quantity and slot — we&apos;ll take care of the rest.
            </p>
            <ul className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
              {[
                { Icon: CalendarCheck, t: "Daily or alternate days" },
                { Icon: PauseCircle, t: "Pause anytime" },
                { Icon: Truck, t: "Morning doorstep drop" },
              ].map(({ Icon, t }) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10">
                    <Icon className="size-4 text-[#e2bf6c]" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <ButtonLink href="/subscribe" variant="gold" size="lg" className="mt-10">
              Start my subscription
            </ButtonLink>
          </div>

          <motion.div style={{ y, rotate }} className="relative mx-auto aspect-[4/5] w-full max-w-xs">
            <div className="absolute inset-0 rounded-[2rem] bg-white/10 backdrop-blur" />
            <Image
              src="/images/kanhaiya-raw-farm-milk.jpg"
              alt="A bottle of Kanhaiya Vedics raw farm milk"
              fill
              sizes="20rem"
              className="rounded-[2rem] object-cover p-2"
            />
            <LeafMark className="absolute -top-5 -left-5 h-10 w-auto animate-float" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
