import "server-only";
import { cache } from "react";
import { API_URL } from "./api";
import { defaultSettings, fallbackProducts } from "./fallback";
import type { Product, SiteSettings } from "./types";

// Pages are statically generated and refreshed every 5 minutes, or instantly when the
// admin saves a change (see /api/revalidate).
const REVALIDATE_SECONDS = 300;

async function fetchJson<T>(path: string, tags: string[]): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function mergeSettings(remote: Partial<SiteSettings> | undefined): SiteSettings {
  if (!remote) return defaultSettings;
  const merged = { ...defaultSettings } as Record<string, unknown>;
  for (const [key, value] of Object.entries(remote)) {
    const base = (defaultSettings as Record<string, unknown>)[key];
    merged[key] =
      base && value && typeof base === "object" && !Array.isArray(base)
        ? { ...(base as object), ...(value as object) }
        : (value ?? base);
  }
  return merged as SiteSettings;
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const data = await fetchJson<{ settings: Partial<SiteSettings> }>("/api/settings", ["settings"]);
  return mergeSettings(data?.settings);
});

export const getProducts = cache(async (): Promise<Product[]> => {
  const data = await fetchJson<{ products: Product[] }>("/api/products", ["products"]);
  return data?.products ?? fallbackProducts;
});

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const data = await fetchJson<{ product: Product }>(`/api/products/${encodeURIComponent(slug)}`, [
    "products",
    `product:${slug}`,
  ]);
  if (data?.product) return data.product;
  // Only fall back to static data when the API itself is unreachable.
  const products = await getProducts();
  return products === fallbackProducts ? (fallbackProducts.find((p) => p.slug === slug) ?? null) : null;
});
