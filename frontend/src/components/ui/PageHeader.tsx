import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";

type Crumb = { href: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ href: "/", label: "Home" }, ...items];
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            item: absoluteUrl(c.href),
          })),
        }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-heading">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="hover:text-leaf">
                  {c.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumbs,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  crumbs: Crumb[];
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <div aria-hidden className="absolute -top-32 right-0 -z-10 size-[30rem] rounded-full bg-leaf-soft blur-3xl" />
      <div aria-hidden className="absolute -bottom-40 -left-20 -z-10 size-[26rem] rounded-full bg-gold-soft blur-3xl opacity-70" />
      <div className="container-x py-14 sm:py-20">
        <Breadcrumbs items={crumbs} />
        <Reveal className="mt-8 max-w-3xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-4xl leading-[1.05] font-semibold sm:text-6xl">{title}</h1>
          {subtitle && <p className="mt-5 text-lg leading-relaxed text-muted">{subtitle}</p>}
        </Reveal>
      </div>
    </section>
  );
}
