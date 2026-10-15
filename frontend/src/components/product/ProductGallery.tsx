"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/format";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const list = images.length ? images : ["/images/kanhaiya-milk-bottles.jpg"];

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {list.length > 1 && (
        <div className="flex gap-3 lg:flex-col">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                "relative aspect-[4/5] w-20 overflow-hidden rounded-2xl border-2 transition-all",
                i === active ? "border-leaf" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div
        className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden rounded-[2rem] bg-surface-2"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onPointerLeave={() => setZoom(null)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={list[active]}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={list[active]}
              alt={alt}
              fill
              priority={active === 0}
              sizes="(min-width: 1024px) 40rem, 100vw"
              className="object-cover transition-transform duration-300 ease-out"
              style={
                zoom
                  ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                  : { transform: "scale(1)" }
              }
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
