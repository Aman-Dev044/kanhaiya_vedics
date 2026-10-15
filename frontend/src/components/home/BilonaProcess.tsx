"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { CloudSun, Flame, Milk, MoonStar, RefreshCw, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { BILONA_ART } from "@/components/home/BilonaArt";

const STEPS = [
  { n: "01", Icon: Milk, title: "Fresh desi cow milk", text: "It all begins with pure milk from our desi indigenous cows.", tone: "from-[#fffdf7] to-[#f1eadb]" },
  { n: "02", Icon: MoonStar, title: "Set into curd", text: "The milk is boiled and set into curd overnight in earthen-style vessels.", tone: "from-[#f8f3e6] to-[#ece2c9]" },
  { n: "03", Icon: RefreshCw, title: "Hand-churned (bilona)", text: "At dawn the curd is churned both ways with a wooden bilona to release the makkhan.", tone: "from-[#f6edd2] to-[#ead8a5]" },
  { n: "04", Icon: CloudSun, title: "Makkhan collected", text: "Soft, white butter rises to the top and is gathered by hand.", tone: "from-[#f6e7bb] to-[#e8cd84]" },
  { n: "05", Icon: Flame, title: "Slow-cooked", text: "The makkhan simmers on a low flame for hours until it turns golden and aromatic.", tone: "from-[#f2d88f] to-[#dcb257]" },
  { n: "06", Icon: Sparkles, title: "Golden bilona ghee", text: "Nearly 25–30 litres of milk become one litre of granular, fragrant ghee.", tone: "from-[#e9c467] to-[#c9962f]" },
];

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/** Pinned section: vertical scroll drives a horizontal walk through the bilona process. */
export function BilonaProcess({ href = "/products" }: { href?: string }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth + 64));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [desktop]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const progress = useTransform(smooth, [0, 1], ["0%", "100%"]);

  const intro = (
    <div className="w-full shrink-0 lg:w-[26rem]">
      <p className="eyebrow">The Vedic Bilona Way</p>
      <h2 className="mt-4 text-4xl leading-[1.08] font-semibold sm:text-5xl">
        How our ghee is <span className="text-gradient-gold italic">born</span>
      </h2>
      <p className="mt-5 leading-relaxed text-muted">
        No cream separators, no shortcuts. Our ghee follows the slow, six-step method described in Ayurveda for
        centuries.
      </p>
      <ButtonLink href={href} variant="gold" className="mt-8">
        Shop Bilona Ghee
      </ButtonLink>
    </div>
  );

  const cards = STEPS.map((s, i) => {
    const Art = BILONA_ART[i];
    return (
    <article
      key={s.n}
      className={`relative flex group h-[27rem] w-[78vw] max-w-[20rem] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br p-7 text-[#1f2a1b] shadow-[0_30px_60px_-35px_rgba(80,60,20,0.6)] transition-transform duration-500 hover:-translate-y-2 lg:h-[28rem] lg:w-[21rem] lg:max-w-none ${s.tone}`}
    >
      <div className="flex items-start justify-between">
        <span className="font-display text-6xl font-semibold text-[#1f3d1c]/15">{s.n}</span>
        <span className="grid size-11 place-items-center rounded-2xl bg-white/60 text-[#4f7a28] shadow-sm backdrop-blur">
          <s.Icon className="size-5" />
        </span>
      </div>
      <div className="relative mx-auto grid size-32 place-items-center">
        <span className="absolute inset-0 rounded-full bg-white/50 blur-md transition-transform duration-700 group-hover:scale-125" />
        <div className="relative size-28 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
          <Art />
        </div>
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold text-[#1f3d1c] lg:text-2xl">{s.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#3d4636] lg:text-[0.95rem]">{s.text}</p>
      </div>
      <div className="pointer-events-none absolute -right-10 -bottom-10 size-40 rounded-full bg-white/30 blur-2xl" />
    </article>
    );
  });

  if (!desktop) {
    return (
      <section ref={section} className="relative py-24" aria-label="Bilona ghee process">
        <div className="container-x">{intro}</div>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none]" data-lenis-prevent-wheel>
          {cards}
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className="relative h-[320vh]" aria-label="Bilona ghee process">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex items-center gap-8 pr-16 pl-[max(1.5rem,calc((100vw-1240px)/2+1.5rem))]">
          {intro}
          {cards}
        </motion.div>
        <div className="container-x mt-12">
          <div className="h-[3px] overflow-hidden rounded-full bg-border">
            <motion.div style={{ width: progress }} className="h-full rounded-full bg-gradient-to-r from-leaf to-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}
