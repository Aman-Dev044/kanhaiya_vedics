import type { Metadata } from "next";
import { getProducts, getSettings } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";
import { Hero } from "@/components/home/Hero";
import { MarqueeBand } from "@/components/home/MarqueeBand";
import { FarmBento } from "@/components/home/FarmBento";
import { Comparison } from "@/components/home/Comparison";
import { VelocityBand } from "@/components/home/VelocityBand";
import { PincodeCheck } from "@/components/home/PincodeCheck";
import { Journey } from "@/components/home/Journey";
import { BilonaProcess } from "@/components/home/BilonaProcess";
import { Promise as PromiseSection } from "@/components/home/Promise";
import { SubscribeBand } from "@/components/home/SubscribeBand";
import { Testimonials } from "@/components/home/Testimonials";
import { ProductCard } from "@/components/product/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()]);
  const ghee = products.find((p) => p.category === "ghee");

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${settings.brand.name} products`,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/products/${p.slug}`),
      name: p.name,
    })),
  };
  const faqLd = settings.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: settings.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={itemList} />
      {faqLd && <JsonLd data={faqLd} />}

      <Hero hero={settings.hero} products={products} delivery={settings.delivery} />
      <MarqueeBand />
      <FarmBento stats={settings.stats} products={products} delivery={settings.delivery} />

      <section className="container-x py-12 sm:py-16" aria-labelledby="offerings-title">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Our Offerings"
            title={<span id="offerings-title">Simple. Pure. Desi.</span>}
            subtitle="Two products, made the honest way. That's all we do — and we do it with all our heart."
          />
          <Reveal delay={0.2}>
            <ButtonLink href="/products" variant="outline">
              View all products
            </ButtonLink>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.15}>
              <ProductCard product={p} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <VelocityBand />
      <Journey morningSlot={settings.delivery.morningSlot} />
      <Comparison />
      <BilonaProcess href={ghee ? `/products/${ghee.slug}` : "/products"} />
      <PromiseSection />
      <Testimonials items={settings.testimonials} />
      <PincodeCheck />

      {settings.faqs.length > 0 && (
        <section className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="faq-title">
          <SectionHeading
            align="left"
            eyebrow="Questions"
            title={<span id="faq-title">Everything you&apos;d like to know</span>}
            subtitle={
              <>
                Still curious? Message us on WhatsApp or call{" "}
                <a className="font-semibold text-leaf underline-offset-4 hover:underline" href={`tel:${settings.contact.phone.replace(/\s/g, "")}`}>
                  {settings.contact.phone}
                </a>
                .
              </>
            }
          />
          <Reveal delay={0.1}>
            <Accordion items={settings.faqs} />
          </Reveal>
        </section>
      )}

      <SubscribeBand />
    </>
  );
}
