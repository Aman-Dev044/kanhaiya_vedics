"use client";

import Link from "next/link";
import { use } from "react";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAdminData } from "@/components/admin/admin-utils";
import type { Product } from "@/lib/types";

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, error } = useAdminData<{ product: Product }>(`/api/products/${slug}`);

  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-heading">
        <ChevronLeft className="size-4" /> Products
      </Link>
      <AdminPageTitle
        title={data?.product.name || "Edit product"}
        actions={
          <Link href={`/products/${slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf hover:underline">
            View on store <ExternalLink className="size-3.5" />
          </Link>
        }
      />
      {error && <p className="rounded-2xl bg-red-500/10 p-4 text-red-600">{error}</p>}
      {data ? <ProductForm key={data.product.slug} initial={data.product} /> : !error && <div className="h-96 animate-pulse rounded-3xl bg-surface-2" />}
    </>
  );
}
