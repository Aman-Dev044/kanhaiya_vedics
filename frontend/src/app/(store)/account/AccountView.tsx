"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, Package } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { OrderDetails } from "@/components/checkout/OrderDetails";
import { api, ApiError } from "@/lib/api";
import { INDIAN_STATES } from "@/lib/india";
import { cn, formatDate, inr, ORDER_STATUS_LABEL } from "@/lib/format";
import type { Order, User } from "@/lib/types";

export function AccountView() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState<"orders" | "profile">("orders");

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/account");
  }, [loading, user, router]);

  if (!user) return <div className="container-x min-h-[60vh]" />;

  return (
    <div className="container-x py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Namaste, {user.name.split(" ")[0]} 🙏</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut className="size-4" /> Log out
        </Button>
      </div>

      <div className="mt-10 inline-flex rounded-full border border-border p-1">
        {(["orders", "profile"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("relative isolate rounded-full px-6 py-2 text-sm font-semibold capitalize", tab === t ? "text-primary-foreground" : "text-muted")}
          >
            {tab === t && <motion.span layoutId="acct-tab" className="absolute inset-0 -z-10 rounded-full bg-primary" />}
            {t === "orders" ? "My orders" : "Profile & address"}
          </button>
        ))}
      </div>

      <div className="mt-8">{tab === "orders" ? <Orders /> : <Profile user={user} />}</div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    api<{ orders: Order[] }>("/api/orders", { auth: true })
      .then((r) => setOrders(r.orders))
      .catch(() => setOrders([]));
  }, []);

  if (!orders) return <div className="h-40 animate-pulse rounded-3xl bg-surface-2" />;
  if (!orders.length) {
    return (
      <div className="card flex flex-col items-center gap-4 p-12 text-center">
        <Package className="size-10 text-leaf" />
        <p className="font-display text-xl text-heading">No orders yet</p>
        <ButtonLink href="/products">Start shopping</ButtonLink>
      </div>
    );
  }
  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o._id} className="card overflow-hidden">
          <button onClick={() => setOpen(open === o._id ? null : o._id)} className="flex w-full flex-wrap items-center justify-between gap-4 p-5 text-left sm:p-6">
            <div>
              <p className="font-display text-lg font-semibold text-heading">#{o.orderNumber}</p>
              <p className="text-sm text-muted">
                {formatDate(o.createdAt)} · {o.items.reduce((n, i) => n + i.quantity, 0)} items
              </p>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge status={o.status} />
              <span className="font-semibold text-heading">{inr(o.total)}</span>
              <ChevronDown className={cn("size-5 text-muted transition-transform", open === o._id && "rotate-180")} />
            </div>
          </button>
          <AnimatePresence initial={false}>
            {open === o._id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="border-t border-border p-5 sm:p-6">
                  <OrderDetails order={o} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, string> = {
    placed: "bg-gold-soft text-gold",
    confirmed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    out_for_delivery: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    delivered: "bg-leaf-soft text-leaf",
    cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
  };
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", tone[status] || "bg-surface-2 text-muted")}>
      {ORDER_STATUS_LABEL[status] || status}
    </span>
  );
}

function Profile({ user }: { user: User }) {
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    line1: user.address?.line1 || "",
    line2: user.address?.line2 || "",
    landmark: user.address?.landmark || "",
    city: user.address?.city || "",
    state: user.address?.state || "",
    pincode: user.address?.pincode || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { name, phone, ...address } = form;
      const hasAddress = address.line1 || address.city || address.pincode;
      const res = await api<{ user: User }>("/api/auth/me", {
        method: "PATCH",
        auth: true,
        body: { name, phone, ...(hasAddress ? { address } : {}) },
      });
      setUser(res.user);
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const input = (k: keyof typeof form, label: string, cls = "") => (
    <div className={cls}>
      <label htmlFor={`p-${k}`} className="label">
        {label}
      </label>
      <input id={`p-${k}`} value={form[k]} onChange={set(k)} className="field" />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="card grid max-w-3xl gap-5 p-6 sm:grid-cols-2 sm:p-8">
      {input("name", "Full name")}
      {input("phone", "Mobile")}
      <p className="text-sm text-muted sm:col-span-2">Email: {user.email}</p>
      <h2 className="mt-4 text-2xl font-semibold sm:col-span-2">Default delivery address</h2>
      {input("line1", "House / flat, street", "sm:col-span-2")}
      {input("line2", "Area / locality")}
      {input("landmark", "Landmark")}
      {input("city", "City")}
      <div>
        <label htmlFor="p-state" className="label">
          State
        </label>
        <select id="p-state" value={form.state} onChange={set("state")} className="field">
          <option value="">Select state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      {input("pincode", "Pincode")}
      <div className="sm:col-span-2">
        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
