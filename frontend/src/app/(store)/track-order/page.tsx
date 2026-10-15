import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TrackOrder } from "./TrackOrder";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track the status of your Kanhaiya Vedics milk or ghee order using your order number and phone.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/track-order", label: "Track order" }]}
        eyebrow="Order status"
        title="Track your order"
        subtitle="Enter the order number from your confirmation and the mobile number used at checkout."
      />
      <Suspense>
        <TrackOrder />
      </Suspense>
    </>
  );
}
