import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSuccess } from "./OrderSuccess";

export const metadata: Metadata = { title: "Order placed", robots: { index: false, follow: false } };

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccess />
    </Suspense>
  );
}
