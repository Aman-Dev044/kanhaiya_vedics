import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";
import { POLICY_SLUGS } from "@/lib/policies";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" | "yearly") => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "daily"),
    page("/products", 0.9, "daily"),
    ...products.map((p) => ({
      url: absoluteUrl(`/products/${p.slug}`),
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: p.images.map((i) => absoluteUrl(i)),
    })),
    page("/subscribe", 0.8, "monthly"),
    page("/about", 0.7, "monthly"),
    page("/contact", 0.6, "monthly"),
    page("/track-order", 0.4, "yearly"),
    ...POLICY_SLUGS.map((s) => page(`/${s}`, 0.3, "yearly")),
  ];
}
