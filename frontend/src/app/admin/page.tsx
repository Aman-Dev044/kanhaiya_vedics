"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, IndianRupee, Inbox, ShoppingCart, Users } from "lucide-react";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { useAdminData } from "@/components/admin/admin-utils";
import { StatusBadge } from "@/app/(store)/account/AccountView";
import { formatDate, inr } from "@/lib/format";
import type { Order } from "@/lib/types";

type Stats = {
  revenue: number;
  orders: number;
  ordersByStatus: Record<string, number>;
  daily: { _id: string; revenue: number; orders: number }[];
  customers: number;
  newEnquiries: number;
  productCount: number;
  lowStock: { product: string; slug: string; variant: string; stock: number }[];
  recentOrders: Order[];
};

export default function AdminDashboard() {
  const { data, error, loading } = useAdminData<Stats>("/api/admin/stats");

  if (error) return <p className="rounded-2xl bg-red-500/10 p-4 text-red-600">{error}</p>;
  if (loading || !data) return <DashboardSkeleton />;

  const pending = (data.ordersByStatus.placed || 0) + (data.ordersByStatus.confirmed || 0);
  const cards = [
    { label: "Revenue (excl. cancelled)", value: inr(data.revenue), Icon: IndianRupee },
    { label: "Total orders", value: data.orders.toLocaleString("en-IN"), Icon: ShoppingCart, note: `${pending} to fulfil` },
    { label: "Customers", value: data.customers.toLocaleString("en-IN"), Icon: Users },
    { label: "New enquiries", value: data.newEnquiries.toLocaleString("en-IN"), Icon: Inbox, href: "/admin/enquiries" },
  ];

  return (
    <>
      <AdminPageTitle title="Dashboard" subtitle="A quick look at how the farm store is doing." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, Icon, note, href }) => {
          const body = (
            <div className="card h-full p-5 transition-colors hover:border-leaf/40">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">{label}</p>
                <span className="grid size-9 place-items-center rounded-xl bg-leaf-soft text-leaf">
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-heading">{value}</p>
              {note && <p className="mt-1 text-xs text-muted">{note}</p>}
            </div>
          );
          return href ? (
            <Link key={label} href={href}>
              {body}
            </Link>
          ) : (
            <div key={label}>{body}</div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <RevenueChart daily={data.daily} />

        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-sans text-base font-semibold">
            <AlertTriangle className="size-4 text-gold" /> Low stock
          </h2>
          {data.lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-muted">All variants are well stocked.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {data.lowStock.map((s) => (
                <li key={`${s.slug}-${s.variant}`} className="flex items-center justify-between py-2.5 text-sm">
                  <Link href={`/admin/products/${s.slug}`} className="text-heading hover:text-leaf">
                    {s.product} <span className="text-muted">· {s.variant}</span>
                  </Link>
                  <span className={s.stock === 0 ? "font-semibold text-red-500" : "font-semibold text-gold"}>
                    {s.stock === 0 ? "Out" : `${s.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <h2 className="font-sans text-base font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-leaf hover:underline">
            View all
          </Link>
        </div>
        {data.recentOrders.length === 0 ? (
          <p className="px-5 pb-6 text-sm text-muted">No orders yet. They&apos;ll show up here as soon as customers check out.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2/60 text-left text-xs text-muted uppercase">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-surface-2/40">
                    <td className="px-5 py-3 font-semibold text-heading">
                      <Link href={`/admin/orders?open=${o._id}`}>#{o.orderNumber}</Link>
                    </td>
                    <td className="px-5 py-3">{o.customer.name}</td>
                    <td className="px-5 py-3 text-muted">{formatDate(o.createdAt, true)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums">{inr(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/** Single-series bar chart: one hue, no legend, per-bar hover tooltip, recessive axis. */
function RevenueChart({ daily }: { daily: Stats["daily"] }) {
  const [hover, setHover] = useState<number | null>(null);
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 13 + i);
    const key = d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const row = daily.find((x) => x._id === key);
    return { key, label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), revenue: row?.revenue ?? 0, orders: row?.orders ?? 0 };
  });
  const max = Math.max(1, ...days.map((d) => d.revenue));
  const total = days.reduce((n, d) => n + d.revenue, 0);

  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-sans text-base font-semibold">Revenue · last 14 days</h2>
        <p className="text-sm text-muted">
          Total <span className="font-semibold text-heading tabular-nums">{inr(total)}</span>
        </p>
      </div>
      <div className="relative mt-6 h-56">
        <div className="absolute inset-x-0 bottom-6 border-t border-border" aria-hidden />
        <div className="absolute inset-0 bottom-6 flex items-end gap-[2px]" role="list" aria-label="Daily revenue">
          {days.map((d, i) => (
            <div
              key={d.key}
              role="listitem"
              aria-label={`${d.label}: ${inr(d.revenue)} from ${d.orders} orders`}
              className="relative flex h-full flex-1 items-end"
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
            >
              <div
                className="w-full rounded-t-[4px] bg-leaf transition-opacity"
                style={{ height: `${Math.max(d.revenue ? 2 : 0, (d.revenue / max) * 100)}%`, opacity: hover === null || hover === i ? 1 : 0.45 }}
              />
              {hover === i && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                  <p className="font-semibold text-heading">{d.label}</p>
                  <p className="text-muted">
                    {inr(d.revenue)} · {d.orders} orders
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex gap-[2px] text-[0.65rem] text-muted">
          {days.map((d, i) => (
            <span key={d.key} className="flex-1 text-center">
              {i % 2 === 0 ? d.label : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 animate-pulse rounded-xl bg-surface-2" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-3xl bg-surface-2" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-3xl bg-surface-2" />
    </div>
  );
}
