import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/Reveal";
import type { SiteSettings } from "@/lib/types";

/** Renders only when the admin has added real testimonials in Settings. */
export function Testimonials({ items }: { items: SiteSettings["testimonials"] }) {
  if (!items.length) return null;
  const row = items.length < 4 ? [...items, ...items, ...items] : [...items, ...items];

  return (
    <section className="overflow-hidden py-24 sm:py-32" aria-labelledby="testimonials-title">
      <div className="container-x">
        <SectionHeading
          eyebrow="Kind Words"
          title={<span id="testimonials-title">Loved by families like yours</span>}
        />
      </div>
      <div className="relative mt-14 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-5 pr-5 [animation-duration:60s] hover:[animation-play-state:paused]">
          {row.map((t, i) => (
            <figure key={i} className="card w-[22rem] shrink-0 p-7">
              <Quote className="size-7 text-gold" />
              <blockquote className="mt-4 leading-relaxed text-foreground">“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold text-heading">{t.name}</p>
                  {t.location && <p className="text-xs text-muted">{t.location}</p>}
                </div>
                <span className="flex text-gold" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="size-3.5 fill-current" />
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
