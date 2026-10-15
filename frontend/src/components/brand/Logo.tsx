import Link from "next/link";
import { cn } from "@/lib/format";

export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 84 52" aria-hidden className={className}>
      <path d="M40 46 C14 44 2 30 0 10 C22 10 38 24 40 46 Z" className="fill-[#3f5f1f] dark:fill-[#7fae45]" />
      <path d="M44 46 C46 20 60 4 84 0 C82 26 66 44 44 46 Z" className="fill-[#5d8a2a] dark:fill-[#a9cf72]" />
      <path d="M42 44 V52" strokeWidth="4" strokeLinecap="round" className="stroke-[#3f5f1f] dark:stroke-[#7fae45]" />
    </svg>
  );
}

/** Recreation of the Kanhaiya Vedics label logo: twin leaves, serif wordmark, spaced "VEDICS". */
export function Logo({
  name = "Kanhaiya Vedics",
  className,
  size = "md",
  href = "/",
}: {
  name?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string | null;
}) {
  const [first, ...rest] = name.split(" ");
  const second = rest.join(" ");
  const s = {
    sm: { leaf: "h-3.5", word: "text-xl", sub: "text-[0.5rem] tracking-[0.42em]" },
    md: { leaf: "h-4", word: "text-[1.6rem]", sub: "text-[0.55rem] tracking-[0.45em]" },
    lg: { leaf: "h-7", word: "text-5xl", sub: "text-xs tracking-[0.5em]" },
  }[size];

  const mark = (
    <span className={cn("inline-flex flex-col items-center leading-none select-none", className)}>
      <LeafMark className={cn(s.leaf, "w-auto -mb-0.5 translate-x-[18%]")} />
      <span className={cn("font-display font-semibold text-heading", s.word)}>{first}</span>
      {second && (
        <span className="mt-1 flex w-full items-center gap-1.5">
          <span className="h-px flex-1 bg-heading/60" />
          <span className={cn("font-sans font-medium uppercase text-heading/90 pl-[0.45em]", s.sub)}>
            {second}
          </span>
          <span className="h-px flex-1 bg-heading/60" />
        </span>
      )}
    </span>
  );

  if (href === null) return mark;
  return (
    <Link href={href} aria-label={`${name} — home`} className="inline-flex">
      {mark}
    </Link>
  );
}
