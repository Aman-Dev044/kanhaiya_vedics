import type { Metadata } from "next";
import { CalendarCheck, PauseCircle, Truck, Wallet } from "lucide-react";
import { getProducts, getSettings } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/Reveal";
import { inr } from "@/lib/format";

export const metadata: Metadata = {
  title: "Daily Milk Subscription — Fresh Desi Cow Milk Every Morning",
  description:
    "Subscribe to daily doorstep delivery of fresh raw farm milk from desi indigenous cows. Choose quantity, frequency and slot. Pause anytime.",
  alternates: { canonical: "/subscribe" },
};

export default async function SubscribePage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const options = products.flatMap((p) => p.variants.map((v) => `${p.name} — ${v.label} (${inr(v.price)})`));

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/subscribe", label: "Daily subscription" }]}
        eyebrow="Milk subscription"
        title="Fresh milk at your door, every morning"
        subtitle="Tell us what you need and how often. Our team will call to confirm your schedule — no advance payment required."
      />
      <div className="container-x py-16">
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: CalendarCheck, t: "Flexible schedule", d: "Daily, alternate days or weekly — your choice." },
            { Icon: Truck, t: "Doorstep delivery", d: `Morning (${settings.delivery.morningSlot}) or evening slot.` },
            { Icon: PauseCircle, t: "Pause anytime", d: "Travelling? Just message us to pause or change." },
            { Icon: Wallet, t: "Pay as you go", d: "Settle monthly by cash or UPI. No lock-ins." },
          ].map(({ Icon, t, d }) => (
            <StaggerItem key={t} className="card p-6">
              <Icon className="size-7 text-leaf" />
              <h2 className="mt-4 text-xl font-semibold">{t}</h2>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-6 text-3xl font-semibold">Request your subscription</h2>
          <EnquiryForm
            type="subscription"
            subject="Daily milk subscription"
            submitLabel="Request subscription"
            fields={[
              { name: "name", label: "Your name", required: true },
              { name: "phone", label: "Mobile number", type: "tel", required: true },
              { name: "email", label: "Email", type: "email" },
              { name: "product", label: "Product & size", type: "select", options, required: true },
              { name: "quantity", label: "Quantity per delivery", type: "select", options: ["1", "2", "3", "4", "5+"], required: true },
              { name: "frequency", label: "Frequency", type: "select", options: ["Daily", "Alternate days", "Weekly"], required: true },
              { name: "slot", label: "Preferred slot", type: "select", options: ["Morning", "Evening"] },
              { name: "start", label: "Start date", type: "date" },
              { name: "address", label: "Delivery address with pincode", type: "textarea", required: true },
              { name: "message", label: "Anything else?", type: "textarea" },
            ]}
          />
        </Reveal>
      </div>
    </>
  );
}
