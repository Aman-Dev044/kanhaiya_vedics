"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Banknote, Lock, Moon, Smartphone, Sun } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button, ButtonLink } from "@/components/ui/Button";
import { api, ApiError } from "@/lib/api";
import { INDIAN_STATES } from "@/lib/india";
import { cn } from "@/lib/format";
import type { DeliverySlot, Order, PaymentMethod, Product } from "@/lib/types";

type Form = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

const EMPTY: Form = { name: "", email: "", phone: "", line1: "", line2: "", landmark: "", city: "", state: "", pincode: "", notes: "" };

export const LAST_ORDER_KEY = "kv-last-order";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, ready, clear, reconcile } = useCart();
  const { user } = useAuth();
  const { delivery } = useSettings();
  const [form, setForm] = useState<Form>(EMPTY);
  const [slot, setSlot] = useState<DeliverySlot>("morning");
  const [payment, setPayment] = useState<PaymentMethod>(delivery.codEnabled ? "cod" : "upi_on_delivery");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  // Refresh prices/stock from the server so the summary matches what will be charged.
  useEffect(() => {
    api<{ products: Product[] }>("/api/products")
      .then(({ products }) => reconcile(products))
      .catch(() => {});
  }, [reconcile]);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name || user.name,
      email: f.email || user.email,
      phone: f.phone || user.phone || "",
      line1: f.line1 || user.address?.line1 || "",
      line2: f.line2 || user.address?.line2 || "",
      landmark: f.landmark || user.address?.landmark || "",
      city: f.city || user.address?.city || "",
      state: f.state || user.address?.state || "",
      pincode: f.pincode || user.address?.pincode || "",
    }));
  }, [user]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const { order } = await api<{ order: Order }>("/api/orders", {
        method: "POST",
        auth: true,
        body: {
          items: items.map((i) => ({ slug: i.slug, sku: i.sku, quantity: i.quantity })),
          customer: { name: form.name, email: form.email, phone: form.phone },
          shippingAddress: {
            line1: form.line1,
            line2: form.line2,
            landmark: form.landmark,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          paymentMethod: payment,
          deliverySlot: slot,
          notes: form.notes,
        },
      });
      try {
        sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      } catch {}
      setPlaced(true);
      clear();
      router.push(`/order-success?order=${order.orderNumber}`);
    } catch (err) {
      if (err instanceof ApiError) {
        const map: Record<string, string> = {};
        err.details?.forEach((d) => (map[d.path.split(".").pop() || d.path] = d.message));
        setErrors(map);
        toast.error(err.message);
      } else {
        toast.error("Could not place your order. Please try again.");
      }
      setSubmitting(false);
    }
  };

  if (!ready || placed) return <div className="container-x min-h-[60vh] py-16" />;

  if (items.length === 0) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
        <h1 className="text-4xl font-semibold">Nothing to check out yet</h1>
        <p className="text-muted">Add some fresh goodness to your cart first.</p>
        <ButtonLink href="/products">Browse products</ButtonLink>
      </div>
    );
  }

  const field = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className={props.className}>
      <label htmlFor={`co-${k}`} className="label">
        {label}
        {props.required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={`co-${k}`}
        value={form[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        {...props}
        className={cn("field", errors[k] && "border-red-500")}
      />
      {errors[k] && <p className="mt-1 text-xs text-red-500">{errors[k]}</p>}
    </div>
  );

  return (
    <div className="container-x py-12 sm:py-16">
      <h1 className="text-4xl font-semibold sm:text-5xl">Checkout</h1>
      {!user && (
        <p className="mt-3 text-sm text-muted">
          Have an account?{" "}
          <Link href="/login?next=/checkout" className="font-semibold text-leaf hover:underline">
            Log in
          </Link>{" "}
          for faster checkout — or continue as a guest.
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]" noValidate>
        <div className="space-y-10">
          <section className="card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Contact details</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {field("name", "Full name", { required: true, autoComplete: "name", className: "sm:col-span-2" })}
              {field("phone", "Mobile number", { required: true, type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "10-digit mobile" })}
              {field("email", "Email", { required: true, type: "email", autoComplete: "email" })}
            </div>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Delivery address</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {field("line1", "House / flat, street", { required: true, autoComplete: "address-line1", className: "sm:col-span-2" })}
              {field("line2", "Area / locality", { autoComplete: "address-line2" })}
              {field("landmark", "Landmark")}
              {field("city", "City", { required: true, autoComplete: "address-level2" })}
              <div>
                <label htmlFor="co-state" className="label">
                  State <span className="text-red-500">*</span>
                </label>
                <select id="co-state" value={form.state} onChange={set("state")} className={cn("field", errors.state && "border-red-500")} required>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
              </div>
              {field("pincode", "Pincode", { required: true, inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
            </div>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Delivery slot</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { v: "morning" as const, Icon: Sun, t: "Morning", d: delivery.morningSlot },
                { v: "evening" as const, Icon: Moon, t: "Evening", d: delivery.eveningSlot },
              ].map(({ v, Icon, t, d }) => (
                <OptionCard key={v} active={slot === v} onClick={() => setSlot(v)} Icon={Icon} title={t} desc={d} />
              ))}
            </div>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Payment</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {delivery.codEnabled && (
                <OptionCard active={payment === "cod"} onClick={() => setPayment("cod")} Icon={Banknote} title="Cash on delivery" desc="Pay in cash when your order arrives" />
              )}
              {delivery.upiOnDeliveryEnabled && (
                <OptionCard active={payment === "upi_on_delivery"} onClick={() => setPayment("upi_on_delivery")} Icon={Smartphone} title="UPI on delivery" desc="Scan & pay with any UPI app at your door" />
              )}
            </div>
            <div className="mt-6">
              <label htmlFor="co-notes" className="label">
                Delivery notes (optional)
              </label>
              <textarea id="co-notes" value={form.notes} onChange={set("notes")} rows={3} maxLength={500} className="field resize-none" placeholder="Gate code, preferred drop spot…" />
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary items={items} subtotal={subtotal}>
            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              Place order
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
              <Lock className="size-3" /> Your details are safe with us.
            </p>
          </OrderSummary>
        </div>
      </form>
    </div>
  );
}

function OptionCard({
  active,
  onClick,
  Icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-start gap-4 rounded-2xl border p-5 text-left transition-all",
        active ? "border-leaf bg-leaf-soft ring-1 ring-leaf" : "border-border hover:border-heading/40",
      )}
    >
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", active ? "bg-leaf text-milk" : "bg-surface-2 text-heading")}>
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block font-semibold text-heading">{title}</span>
        <span className="block text-sm text-muted">{desc}</span>
      </span>
    </button>
  );
}
