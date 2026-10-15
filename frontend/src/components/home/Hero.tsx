"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Droplet, Home, Leaf, Sunrise } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SplitText } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Motion";
import { LeafMark } from "@/components/brand/Logo";
import { introDelay } from "@/components/layout/Intro";
import { inr } from "@/lib/format";
import type { Product, SiteSettings } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

// Fixed positions (no Math.random) so server and client markup match.
const DROPS = [
  { l: 6, s: 10, d: 0, t: 11 },
  { l: 14, s: 6, d: 3, t: 9 },
  { l: 22, s: 14, d: 6, t: 13 },
  { l: 31, s: 8, d: 1.5, t: 10 },
  { l: 39, s: 5, d: 7, t: 8 },
  { l: 47, s: 12, d: 4, t: 12 },
  { l: 55, s: 7, d: 0.5, t: 9.5 },
  { l: 63, s: 10, d: 5.5, t: 11.5 },
  { l: 71, s: 6, d: 2.5, t: 8.5 },
  { l: 79, s: 13, d: 8, t: 14 },
  { l: 87, s: 8, d: 3.5, t: 10.5 },
  { l: 94, s: 5, d: 6.5, t: 9 },
];

export function Hero({
  hero,
  products,
  delivery,
}: {
  hero: SiteSettings["hero"];
  products: Product[];
  delivery: SiteSettings["delivery"];
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [d0] = useState(introDelay); // wait for the intro curtain on first visit
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const imgY = useTransform(p, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(p, [0, 1], [1, 1.12]);
  const textY = useTransform(p, [0, 1], ["0%", "30%"]);
  const fade = useTransform(p, [0, 0.8], [1, 0]);
  const leafY = useTransform(p, [0, 1], ["0%", "-60%"]);
  const cardY = useTransform(p, [0, 1], ["0%", "-40%"]);

  // Soft spotlight that follows the cursor.
  const mx = useMotionValue(70);
  const my = useMotionValue(30);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mx}% ${my}%, color-mix(in srgb, var(--leaf) 14%, transparent), transparent 70%)`;

  const milk = products.find((x) => x.category === "milk") ?? products[0];
  const ghee = products.find((x) => x.category === "ghee");
  const fromPrice = milk ? Math.min(...milk.variants.map((v) => v.price)) : null;
  const words = hero.title.split(" ");
  const highlightFrom = Math.max(1, words.length - 2);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden"
      aria-labelledby="hero-title"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      {/* Ambient background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 size-[42rem] rounded-full bg-leaf-soft opacity-80 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 size-[36rem] rounded-full bg-gold-soft opacity-80 blur-3xl" />
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
        <div className="grain absolute inset-0 opacity-[0.06] mix-blend-multiply dark:mix-blend-screen" />
        {!reduce &&
          DROPS.map((d, i) => (
            <span
              key={i}
              className="absolute bottom-0 animate-rise rounded-full bg-gradient-to-b from-white to-[#efe7d4] shadow-[0_0_12px_rgba(255,255,255,0.8)] dark:from-[#f4efe2]/70 dark:to-[#f4efe2]/20 dark:shadow-none"
              style={{ left: `${d.l}%`, width: d.s, height: d.s, animationDelay: `${d.d}s`, animationDuration: `${d.t}s` }}
            />
          ))}
      </div>

      <div className="container-x grid min-h-[calc(100svh-6.5rem)] items-center gap-12 pt-6 pb-32 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pt-0">
        <motion.div style={reduce ? undefined : { y: textY, opacity: fade }} className="relative z-10">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: d0, ease: EASE }}
          >
            {hero.eyebrow}
          </motion.p>

          <h1 id="hero-title" className="mt-6 text-[2.75rem] leading-[1.02] font-semibold sm:text-6xl lg:text-[5.2rem]">
            <SplitText text={words.slice(0, highlightFrom).join(" ")} delay={d0 + 0.15} />{" "}
            <span className="relative inline-block">
              <SplitText text={words.slice(highlightFrom).join(" ")} delay={d0 + 0.15 + highlightFrom * 0.07} className="text-leaf italic" />
              {/* Hand-drawn underline */}
              <svg aria-hidden viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full sm:h-4">
                <motion.path
                  d="M4 14 C 60 4, 120 4, 170 10 S 260 16, 296 6"
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: d0 + 0.9, ease: "easeInOut" }}
                />
              </svg>
            </span>
          </h1>

          <motion.p
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: d0 + 0.6, ease: EASE }}
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: d0 + 0.75, ease: EASE }}
          >
            <Magnetic>
              <ButtonLink href={milk ? `/products/${milk.slug}` : "/products"} size="lg" className="isolate">
                <span className="absolute inset-0 -z-10 animate-shimmer bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.18)_50%,transparent_65%)] bg-[length:200%_100%]" />
                {hero.ctaText}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="/subscribe" size="lg" variant="outline">
                Daily subscription
              </ButtonLink>
            </Magnetic>
          </motion.div>

          <motion.ul
            className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-heading"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: d0 + 0.95 } } }}
          >
            {[
              { Icon: Leaf, label: "Fresh" },
              { Icon: Droplet, label: "Natural" },
              { Icon: Home, label: "Farm Sourced" },
            ].map(({ Icon, label }) => (
              <motion.li key={label} className="flex items-center gap-2" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                <span className="grid size-8 place-items-center rounded-full bg-leaf-soft text-leaf">
                  <Icon className="size-4" />
                </span>
                {label}
              </motion.li>
            ))}
          </motion.ul>
          <motion.div
            aria-hidden
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d0 + 1.6 }}
            className="mt-14 hidden items-center gap-3 text-[0.65rem] font-semibold tracking-[0.3em] text-muted uppercase lg:flex"
          >
            <span className="flex h-9 w-5 justify-center rounded-full border-2 border-muted/50 pt-1.5">
              <span className="size-1.5 animate-scroll-dot rounded-full bg-leaf" />
            </span>
            Scroll to explore
          </motion.div>
        </motion.div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
          {/* Slowly rotating dashed ring behind the arch */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: d0 + 0.3, ease: EASE }}
            className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[118%] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="size-full animate-spin-slow rounded-full border border-dashed border-leaf/30" />
          </motion.div>

          <motion.div
            initial={{ clipPath: "inset(100% 0% 0% 0% round 999px 999px 32px 32px)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 999px 999px 32px 32px)" }}
            transition={{ duration: 1.4, delay: d0 + 0.2, ease: EASE }}
            className="relative mx-auto aspect-[4/5] w-full max-w-[28rem] overflow-hidden rounded-t-full rounded-b-[2rem] shadow-[0_40px_80px_-30px_rgb(var(--shadow)/0.55)]"
          >
            <motion.div style={reduce ? undefined : { y: imgY, scale: imgScale }} className="absolute inset-0">
              <Image
                src="/images/kanhaiya-milk-bottles.jpg"
                alt="Kanhaiya Vedics raw farm milk in glass bottles"
                fill
                priority
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </motion.div>

          {/* Rotating badge */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: d0 + 1, ease: EASE }}
            className="absolute top-[8%] -left-2 grid size-32 place-items-center sm:left-0 lg:-left-6"
          >
            <svg viewBox="0 0 120 120" className="absolute inset-0 animate-spin-slow">
              <defs>
                <path id="badge-circle" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
              </defs>
              <circle cx="60" cy="60" r="58" className="fill-background" />
              <text className="fill-heading text-[10.5px] font-semibold tracking-[0.2em] uppercase">
                <textPath href="#badge-circle">From Farm to Homes · Pure Desi ·</textPath>
              </text>
            </svg>
            <LeafMark className="relative h-7 w-auto" />
          </motion.div>

          {/* Floating milk price card */}
          {milk && fromPrice !== null && (
            <motion.div style={reduce ? undefined : { y: cardY }} className="absolute right-0 bottom-[16%] sm:-right-2 lg:-right-8">
              <motion.div
                initial={{ opacity: 0, y: 30, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.9, delay: d0 + 1.25, ease: EASE }}
              >
                <Link href={`/products/${milk.slug}`} className="block animate-float rounded-2xl border border-border/70 bg-background/80 p-4 shadow-xl backdrop-blur-xl transition hover:border-leaf">
                  <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-leaf uppercase">Fresh today</p>
                  <p className="mt-1 font-display text-lg font-semibold text-heading">{milk.name}</p>
                  <p className="mt-1 text-sm">
                    <span className="text-muted">from </span>
                    <span className="font-semibold text-heading">{inr(fromPrice)}</span>
                  </p>
                </Link>
              </motion.div>
            </motion.div>
          )}

          {/* Floating ghee card */}
          {ghee?.images[0] && (
            <motion.div
              initial={{ opacity: 0, y: 40, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.9, delay: d0 + 1.45, ease: EASE }}
              className="absolute -bottom-6 left-0 sm:left-2 lg:-left-10"
            >
              <Link
                href={`/products/${ghee.slug}`}
                className="flex animate-float-slow items-center gap-3 rounded-2xl border border-border/70 bg-background/85 p-2.5 pr-5 shadow-xl backdrop-blur-xl transition hover:border-gold"
              >
                <span className="relative size-14 overflow-hidden rounded-xl">
                  <Image src={ghee.images[0]} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span>
                  <span className="block text-[0.65rem] font-semibold tracking-[0.18em] text-gold uppercase">Hand-churned</span>
                  <span className="block font-display font-semibold text-heading">{ghee.name}</span>
                </span>
              </Link>
            </motion.div>
          )}

          {/* Delivery-time chip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: d0 + 1.6 }}
            className="absolute top-[2%] right-[4%] hidden sm:block"
          >
            <span className="flex items-center gap-2 rounded-full bg-[#1f3d1c] px-4 py-2 text-xs font-semibold text-[#f5ebcf] shadow-lg dark:bg-[#a9cf72] dark:text-[#0d130c]">
              <Sunrise className="size-4" /> At your door by {delivery.morningSlot.split("–").pop()?.trim() || "morning"}
            </span>
          </motion.div>

          {/* Drifting leaves */}
          <motion.div aria-hidden style={reduce ? undefined : { y: leafY }} className="pointer-events-none absolute inset-0">
            <LeafMark className="absolute -top-4 right-[30%] h-8 w-auto rotate-12 animate-float opacity-80" />
            <LeafMark className="absolute bottom-[34%] -left-6 h-6 w-auto -rotate-45 animate-float-slow opacity-70" />
            <LeafMark className="absolute right-[6%] bottom-[2%] h-5 w-auto rotate-[100deg] animate-float opacity-60" />
          </motion.div>
        </div>
      </div>

      <MilkWave />
    </section>
  );
}

/** Gently undulating milk wave along the bottom edge of the hero. */
function MilkWave() {
  const reduce = useReducedMotion();
  const a = "M0 60 C 240 20 480 100 720 60 C 960 20 1200 100 1440 60 L1440 120 L0 120 Z";
  const b = "M0 60 C 240 100 480 20 720 60 C 960 100 1200 20 1440 60 L1440 120 L0 120 Z";
  return (
    <svg aria-hidden viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-16 w-full sm:h-24">
      <motion.path
        d={a}
        className="fill-surface-2/70"
        animate={reduce ? undefined : { d: [a, b, a] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d={b}
        className="fill-background"
        animate={reduce ? undefined : { d: [b, a, b] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
