import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Shop Desi Cow Milk & Bilona Ghee Online",
  description:
    "Shop fresh raw farm milk from desi indigenous cows and hand-churned Vedic bilona ghee. Delivered from farm to your home.",
  alternates: { canonical: "/products" },
  openGraph: { url: "/products" },
};

export default async function ProductsPage() {
  const products = await getProducts();
  const groups = [
    { key: "milk", title: "Farm Fresh Milk", items: products.filter((p) => p.category === "milk") },
    { key: "ghee", title: "Vedic Bilona Ghee", items: products.filter((p) => p.category === "ghee") },
  ].filter((g) => g.items.length);

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/products", label: "Shop" }]}
        eyebrow="Shop"
        title="Pure, desi & honestly made"
        subtitle="Everything we make comes from our own desi indigenous cows. Choose your size, add to cart, and we'll bring it fresh to your doorstep."
      />
      <div className="container-x space-y-20 py-16 sm:py-24">
        {groups.map((g) => (
          <section key={g.key} aria-labelledby={`cat-${g.key}`}>
            <Reveal>
              <h2 id={`cat-${g.key}`} className="text-3xl font-semibold sm:text-4xl">
                {g.title}
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.1}>
                  <ProductCard product={p} priority={i === 0} />
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
