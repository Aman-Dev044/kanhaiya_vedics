import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Leaf, Droplet, Home, Truck } from "lucide-react";
import { getProduct, getProducts, getSettings } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";
import { inr } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found", robots: { index: false } };

  const title = product.seo?.title || `${product.name} — ${product.tagline || ""}`.trim();
  const description = product.seo?.description || product.shortDescription;
  const url = `/products/${product.slug}`;
  return {
    title,
    description,
    keywords: product.seo?.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: product.images.map((src) => ({ url: src, width: 800, height: 1000, alt: product.name })),
    },
    twitter: { card: "summary_large_image", title, description, images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, products, settings] = await Promise.all([getProduct(slug), getProducts(), getSettings()]);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug);
  const prices = product.variants.map((v) => v.price);

  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => absoluteUrl(i)),
    sku: product.variants[0]?.sku,
    category: product.category === "milk" ? "Dairy > Milk" : "Dairy > Ghee",
    brand: { "@type": "Brand", name: settings.brand.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: product.variants.length,
      availability: product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/products/${product.slug}`),
      seller: { "@id": absoluteUrl("/#organization") },
    },
  };
  // Only emit ratings backed by real reviews.
  if (product.reviewCount > 0 && product.rating > 0) {
    productLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return (
    <>
      <JsonLd data={productLd} />
      <div className="container-x pt-8 pb-16">
        <Breadcrumbs
          items={[
            { href: "/products", label: "Shop" },
            { href: `/products/${product.slug}`, label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="right" className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} alt={`${product.name} by ${settings.brand.name}`} />
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            {product.tagline && (
              <p className="text-sm font-semibold tracking-[0.2em] text-leaf uppercase">{product.tagline}</p>
            )}
            <h1 className="mt-3 text-4xl leading-tight font-semibold sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{product.shortDescription}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {[
                { Icon: Leaf, t: "Fresh" },
                { Icon: Droplet, t: "Natural" },
                { Icon: Home, t: "Farm sourced" },
              ].map(({ Icon, t }) => (
                <li key={t} className="flex items-center gap-1.5 rounded-full bg-leaf-soft px-3.5 py-1.5 text-sm font-medium text-heading">
                  <Icon className="size-3.5 text-leaf" /> {t}
                </li>
              ))}
            </ul>

            <div className="my-8 h-px bg-border" />
            <AddToCart product={product} />

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-sm">
              <Truck className="mt-0.5 size-5 shrink-0 text-leaf" />
              <p className="text-muted">
                <strong className="text-heading">Free delivery</strong> on orders above {inr(settings.delivery.freeAbove)}.
                Morning ({settings.delivery.morningSlot}) and evening ({settings.delivery.eveningSlot}) slots available.
              </p>
            </div>

            {product.highlights.length > 0 && (
              <ul className="mt-8 space-y-3">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-leaf text-milk">
                      <Check className="size-3" />
                    </span>
                    <span className="text-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>

        <div className="mt-20">
          <ProductTabs product={product} />
        </div>

        {related.length > 0 && (
          <section className="mt-20" aria-labelledby="related-title">
            <h2 id="related-title" className="text-3xl font-semibold sm:text-4xl">
              You may also love
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Reveal key={p.slug}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
