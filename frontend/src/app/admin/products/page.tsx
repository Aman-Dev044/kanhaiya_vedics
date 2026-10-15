"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { useAdminData } from "@/components/admin/admin-utils";
import { ButtonLink } from "@/components/ui/Button";
import { cn, inr } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const { data, loading, error } = useAdminData<{ products: Product[] }>("/api/products?all=1");

  return (
    <>
      <AdminPageTitle
        title="Products"
        subtitle="Prices, sizes, stock, images, copy and SEO — all editable here."
        actions={
          <ButtonLink href="/admin/products/new">
            <Plus className="size-4" /> Add product
          </ButtonLink>
        }
      />
      {error && <p className="rounded-2xl bg-red-500/10 p-4 text-red-600">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {loading && !data
          ? Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-48 animate-pulse rounded-3xl bg-surface-2" />)
          : data?.products.map((p) => (
              <Link key={p.slug} href={`/admin/products/${p.slug}`} className="card group flex gap-5 p-4 transition-all hover:-translate-y-0.5 hover:border-leaf/50">
                <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-2xl bg-surface-2">
                  {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="112px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold", p.isActive ? "bg-leaf-soft text-leaf" : "bg-surface-2 text-muted")}>
                      {p.isActive ? "Live" : "Hidden"}
                    </span>
                    {p.featured && (
                      <span className="flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-0.5 text-[0.7rem] font-semibold text-gold">
                        <Star className="size-3" /> Featured
                      </span>
                    )}
                    <span className="text-xs text-muted capitalize">{p.category}</span>
                  </div>
                  <h2 className="mt-2 truncate text-xl font-semibold group-hover:text-leaf">{p.name}</h2>
                  <ul className="mt-3 space-y-1 text-sm">
                    {p.variants.map((v) => (
                      <li key={v.sku} className="flex justify-between gap-2">
                        <span className="text-muted">{v.label}</span>
                        <span className="tabular-nums">
                          {inr(v.price)} ·{" "}
                          <span className={v.stock === 0 ? "text-red-500" : v.stock <= 10 ? "text-gold" : "text-muted"}>{v.stock} in stock</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
      </div>
    </>
  );
}
