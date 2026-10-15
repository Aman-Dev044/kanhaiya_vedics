import { LeafMark } from "@/components/brand/Logo";

const WORDS = ["Fresh", "Natural", "Farm Sourced", "Desi Indigenous Cows", "Bilona Ghee", "Glass Bottles", "Vedic Tradition"];

export function MarqueeBand() {
  const row = [...WORDS, ...WORDS];
  return (
    <section aria-label="What we stand for" className="relative -rotate-1 border-y border-border bg-primary py-5 text-primary-foreground">
      <div className="flex overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-10 pr-10">
          {[...row, ...row].map((w, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-2xl italic sm:text-3xl">
              {w}
              <LeafMark className="h-5 w-auto opacity-80 [&_path]:fill-current! text-gold" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
