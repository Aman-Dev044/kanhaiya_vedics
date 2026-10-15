"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Droplets, Leaf, Recycle, ShieldCheck, Sunrise } from "lucide-react";
import { CountUp } from "@/components/home/Stats";
import { SectionHeading } from "@/components/ui/Reveal";
import { cn } from "@/lib/format";
import type { Product, SiteSettings } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;
const STAT_ICONS = [Leaf, ShieldCheck, Sunrise, Droplets];

function Tile({ className, children, delay = 0 }: { className?: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={cn("group relative overflow-hidden rounded-[1.75rem] border border-border", className)}
    >
      {children}
    </motion.div>
  );
}

/** Glass bottle that fills with milk when scrolled into view. */
function FillingBottle() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  return (
    <svg ref={ref} viewBox="0 0 100 200" className="h-40 w-auto drop-shadow-xl" aria-hidden>
      <defs>
        <clipPath id="bottle-clip">
          <path d="M38 30 L62 30 L62 52 C62 60 80 66 80 86 L80 182 C80 190 74 194 66 194 L34 194 C26 194 20 190 20 182 L20 86 C20 66 38 60 38 52 Z" />
        </clipPath>
        <linearGradient id="milk-fill" x1="0" x2="1">
          <stop offset="0" stopColor="#f3eee2" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ebe4d3" />
        </linearGradient>
      </defs>
      <g clipPath="url(#bottle-clip)">
        <rect x="0" y="0" width="100" height="200" fill="rgba(255,255,255,0.18)" />
        <motion.g initial={{ y: reduce ? 0 : 150 }} animate={{ y: inView ? 0 : 150 }} transition={{ duration: 2.2, ease: EASE, delay: 0.2 }}>
          <rect x="0" y="62" width="100" height="140" fill="url(#milk-fill)" />
          <motion.path
            d="M0 64 Q 25 56 50 64 T 100 64 L100 70 L0 70 Z"
            fill="#ffffff"
            animate={reduce ? undefined : { d: ["M0 64 Q 25 56 50 64 T 100 64 L100 70 L0 70 Z", "M0 64 Q 25 72 50 64 T 100 64 L100 70 L0 70 Z", "M0 64 Q 25 56 50 64 T 100 64 L100 70 L0 70 Z"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>
      </g>
      <path d="M38 30 L62 30 L62 52 C62 60 80 66 80 86 L80 182 C80 190 74 194 66 194 L34 194 C26 194 20 190 20 182 L20 86 C20 66 38 60 38 52 Z" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
      <rect x="35" y="14" width="30" height="18" rx="4" fill="#c9a24c" />
      <rect x="35" y="14" width="30" height="5" rx="2.5" fill="#f4dfa0" />
      <path d="M27 95 L27 170" stroke="white" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** Clock whose hands sweep to the morning delivery time. */
function MorningClock() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <svg ref={ref} viewBox="0 0 100 100" className="size-28 shrink-0" aria-hidden>
      <circle cx="50" cy="50" r="46" className="fill-background stroke-border" strokeWidth="2" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="50" y1="8" x2="50" y2={i % 3 === 0 ? 16 : 12} className="stroke-muted" strokeWidth={i % 3 === 0 ? 3 : 1.5} strokeLinecap="round" transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <motion.line
        x1="50" y1="50" x2="50" y2="28"
        className="stroke-heading" strokeWidth="4" strokeLinecap="round"
        style={{ originX: 0.5, originY: 1 }}
        initial={{ rotate: -90 }}
        animate={{ rotate: inView ? 195 : -90 }}
        transition={{ duration: 2.2, ease: EASE }}
      />
      <motion.line
        x1="50" y1="50" x2="50" y2="16"
        className="stroke-leaf" strokeWidth="2.5" strokeLinecap="round"
        style={{ originX: 0.5, originY: 1 }}
        initial={{ rotate: 0 }}
        animate={{ rotate: inView ? 720 + 180 : 0 }}
        transition={{ duration: 2.2, ease: EASE }}
      />
      <circle cx="50" cy="50" r="4" className="fill-gold" />
    </svg>
  );
}

export function FarmBento({ stats, products, delivery }: { stats: SiteSettings["stats"]; products: Product[]; delivery: SiteSettings["delivery"] }) {
  const bigRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: bigRef, offset: ["start end", "end start"] });
  const bigScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const ghee = products.find((p) => p.category === "ghee");
  const milk = products.find((p) => p.category === "milk");

  const statTiles = [...stats.slice(0, 4)];
  while (statTiles.length < 4) statTiles.push({ value: ["Fresh", "Natural", "Pure", "Desi"][statTiles.length], label: "Every single bottle" });

  const Stat = ({ i, className }: { i: number; className?: string }) => {
    const Icon = STAT_ICONS[i];
    return (
      <Tile delay={0.08 * (i + 1)} className={cn("flex flex-col justify-between bg-surface p-6", className)}>
        <span className="grid size-11 place-items-center rounded-2xl bg-leaf-soft text-leaf transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-110">
          <Icon className="size-5" />
        </span>
        <div className="mt-6">
          <p className="font-display text-4xl font-semibold text-heading">
            <CountUp value={statTiles[i].value} />
          </p>
          <p className="mt-1 text-sm text-muted">{statTiles[i].label}</p>
        </div>
      </Tile>
    );
  };

  return (
    <section className="container-x py-20 sm:py-28" aria-labelledby="bento-title">
      <SectionHeading
        eyebrow="Why Families Switch"
        title={<span id="bento-title">Real milk. Real farm. Real difference.</span>}
        subtitle="Everything about Kanhaiya Vedics is built around one idea — getting pure desi milk to you as fresh as it leaves the farm."
      />

      <div className="mt-14 grid auto-rows-[minmax(12rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Big photo tile */}
        <Tile className="min-h-[24rem] sm:col-span-2 lg:row-span-2">
          <div ref={bigRef} className="absolute inset-0">
            <motion.div style={{ scale: bigScale }} className="absolute inset-0">
              <Image src="/images/kanhaiya-raw-farm-milk.jpg" alt="Kanhaiya Vedics raw farm milk bottle" fill sizes="(min-width:1024px) 40rem, 100vw" className="object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#13240f]/90 via-[#13240f]/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 text-[#fbf8f1]">
            <p className="text-xs font-semibold tracking-[0.25em] text-[#e2bf6c] uppercase">Raw · Unprocessed</p>
            <h3 className="mt-2 max-w-sm font-display text-3xl font-semibold text-[#fbf8f1]">Bottled within minutes of milking</h3>
            {milk && (
              <Link href={`/products/${milk.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#fbf8f1] underline-offset-4 hover:underline">
                Shop {milk.name} <ArrowUpRight className="size-4" />
              </Link>
            )}
          </div>
        </Tile>

        <Stat i={0} />
        <Stat i={1} />

        {/* Clock tile */}
        <Tile delay={0.2} className="flex items-center gap-6 bg-gold-soft p-6 sm:col-span-2">
          <MorningClock />
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Morning delivery</p>
            <p className="mt-2 font-display text-2xl font-semibold text-heading">{delivery.morningSlot}</p>
            <p className="mt-1 text-sm text-muted">Fresh at your door before your chai. Evening slot: {delivery.eveningSlot}.</p>
          </div>
        </Tile>

        {/* Ghee tile */}
        <Tile delay={0.1} className="min-h-[22rem] bg-[#1f3d1c] sm:col-span-2 lg:row-span-2 dark:bg-[#15270f]">
          {ghee?.images[0] && (
            <div className="absolute inset-y-0 right-0 w-1/2">
              <Image src={ghee.images[0]} alt={`${ghee.name} jar`} fill sizes="20rem" className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1f3d1c] to-transparent dark:from-[#15270f]" />
            </div>
          )}
          <div className="relative flex h-full max-w-[60%] flex-col justify-between p-7 text-[#fbf8f1]">
            <p className="text-xs font-semibold tracking-[0.25em] text-[#e2bf6c] uppercase">Vedic Bilona Ghee</p>
            <div>
              <p className="font-display text-6xl font-semibold text-gradient-gold">
                <CountUp value="~30" />L
              </p>
              <p className="mt-2 text-[#fbf8f1]/80">of milk go into a single litre of our hand-churned ghee.</p>
              {ghee && (
                <Link href={`/products/${ghee.slug}`} className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#e2bf6c] px-4 py-2 text-sm font-semibold text-[#1f2a1b] transition hover:-translate-y-0.5">
                  Shop ghee <ArrowUpRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </Tile>

        {/* Bottle tile */}
        <Tile delay={0.15} className="flex flex-col items-center justify-between bg-gradient-to-b from-[#9fbf78] to-[#4f7a28] p-6 text-center lg:row-span-2 dark:from-[#2b4220] dark:to-[#15270f]">
          <p className="text-xs font-semibold tracking-[0.25em] text-white/90 uppercase">Glass, not plastic</p>
          <FillingBottle />
          <div className="text-white">
            <p className="flex items-center justify-center gap-1.5 font-display text-xl font-semibold">
              <Recycle className="size-5" /> Return & reuse
            </p>
            <p className="mt-1 text-sm text-white/80">Hand back rinsed bottles on your next delivery.</p>
          </div>
        </Tile>

        <Stat i={2} />
        <Stat i={3} />
      </div>
    </section>
  );
}
