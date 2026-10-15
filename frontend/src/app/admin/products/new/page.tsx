"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-heading">
        <ChevronLeft className="size-4" /> Products
      </Link>
      <AdminPageTitle title="Add product" />
      <ProductForm />
    </>
  );
}
