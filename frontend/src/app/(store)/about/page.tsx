import type { Metadata } from "next";
import Image from "next/image";
import { getSettings } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal, SectionHeading, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Promise as PromiseSection } from "@/components/home/Promise";

export const metadata: Metadata = {
  title: "Our Story — Vedic Dairy from Desi Indigenous Cows",
  description:
    "Kanhaiya Vedics brings back the purity of traditional Indian dairy — raw farm milk and bilona ghee from desi indigenous cows, from our farm to your home.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const { brand } = await getSettings();
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/about", label: "Our story" }]}
        eyebrow="Our story"
        title={<>Bringing back the purity of <span className="text-leaf italic">Vedic dairy</span></>}
        subtitle={brand.description}
      />

      <section className="container-x grid items-center gap-14 py-20 lg:grid-cols-2">
        <Reveal direction="right" className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem]">
          <Image src="/images/kanhaiya-raw-farm-milk.jpg" alt="Kanhaiya Vedics raw farm milk bottle" fill sizes="(min-width:1024px) 40rem, 100vw" className="object-cover" />
        </Reveal>
        <div className="space-y-6 text-lg leading-relaxed text-muted">
          <SectionHeading align="left" eyebrow="Why we started" title="Milk, the way our grandparents knew it" />
          <Reveal delay={0.1}>
            <p>
              Somewhere between plastic pouches and long supply chains, real milk lost its way. Most of what reaches
              our homes today is processed, mixed and transported for days. We wanted something different for our own
              families — and that is how {brand.name} began.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p>
              Our milk comes only from <strong className="text-heading">desi indigenous cows</strong> that graze
              freely and are cared for like family. It is milked at dawn, chilled immediately, filled into glass
              bottles, and delivered to your doorstep — {brand.tagline.toLowerCase()}.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p>
              Our ghee follows the age-old <strong className="text-heading">bilona</strong> method: curd churned by
              hand, makkhan slow-cooked on a gentle flame. It takes time and patience, and you can taste the difference.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-12">
        <Stagger className="grid gap-5 md:grid-cols-3">
          {[
            { t: "Shuddh", d: "Pure — nothing added, nothing taken away." },
            { t: "Desi", d: "Native Indian cow breeds, raised the traditional way." },
            { t: "Vedic", d: "Time-honoured methods from Ayurveda, followed with care." },
          ].map((v) => (
            <StaggerItem key={v.t} className="card p-8 text-center">
              <p className="font-display text-4xl font-semibold text-gradient-gold italic">{v.t}</p>
              <p className="mt-3 text-muted">{v.d}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <PromiseSection />

      <section className="container-x py-20 text-center">
        <SectionHeading title="Taste the difference yourself" subtitle="Order a bottle today, or set up a daily subscription." />
        <Reveal delay={0.2} className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/products" size="lg">
            Shop now
          </ButtonLink>
          <ButtonLink href="/subscribe" size="lg" variant="outline">
            Daily subscription
          </ButtonLink>
        </Reveal>
      </section>
    </>
  );
}
