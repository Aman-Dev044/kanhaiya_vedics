"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "kv-intro-seen";
const EASE = [0.76, 0, 0.24, 1] as const;

/** Delay (s) for hero entrance animations so they play after the intro curtain lifts. */
export function introDelay() {
  if (typeof document === "undefined") return 0;
  return document.documentElement.classList.contains(KEY) ? 0 : 1.55;
}

/**
 * Brand intro shown once per session. It is server-rendered (so there's no flash of content
 * before it) and hidden pre-paint by an inline script for visitors who've already seen it.
 * Page content stays in the HTML underneath, so it doesn't affect SEO.
 */
export function Intro({ name }: { name: string }) {
  const [show, setShow] = useState(true);
  const [first, ...rest] = name.split(" ");

  useEffect(() => {
    if (document.documentElement.classList.contains(KEY)) {
      setShow(false);
      return;
    }
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem('${KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('${KEY}')}catch(e){}`,
        }}
      />
      <AnimatePresence>
        {show && (
          <motion.div
            key="intro"
            aria-hidden
            className="kv-intro fixed inset-0 z-[100] grid place-items-center bg-[#1f3d1c] text-[#fbf8f1]"
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            initial={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 84 52" className="h-14 w-auto">
                <motion.path
                  d="M40 46 C14 44 2 30 0 10 C22 10 38 24 40 46 Z"
                  fill="#7fae45"
                  stroke="#7fae45"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, fillOpacity: 0 }}
                  animate={{ pathLength: 1, fillOpacity: 1 }}
                  transition={{ pathLength: { duration: 0.7, ease: "easeInOut" }, fillOpacity: { delay: 0.5, duration: 0.3 } }}
                />
                <motion.path
                  d="M44 46 C46 20 60 4 84 0 C82 26 66 44 44 46 Z"
                  fill="#a9cf72"
                  stroke="#a9cf72"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, fillOpacity: 0 }}
                  animate={{ pathLength: 1, fillOpacity: 1 }}
                  transition={{ pathLength: { duration: 0.7, delay: 0.15, ease: "easeInOut" }, fillOpacity: { delay: 0.65, duration: 0.3 } }}
                />
              </svg>
              <div className="mt-3 overflow-hidden">
                <motion.p
                  className="font-display text-5xl font-semibold"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {first}
                </motion.p>
              </div>
              {rest.length > 0 && (
                <motion.p
                  className="mt-2 flex items-center gap-3 text-xs tracking-[0.5em] uppercase"
                  initial={{ opacity: 0, letterSpacing: "1em" }}
                  animate={{ opacity: 1, letterSpacing: "0.5em" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <span className="h-px w-8 bg-current" />
                  {rest.join(" ")}
                  <span className="h-px w-8 bg-current" />
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
