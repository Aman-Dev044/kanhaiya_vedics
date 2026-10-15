"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Phone, Search, X } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { useAdminData } from "@/components/admin/admin-utils";
import { OrderDetails } from "@/components/checkout/OrderDetails";
import { StatusBadge } from "@/app/(store)/account/AccountView";
import { Button } from "@/components/ui/Button";
import { api, ApiError } from "@/lib/api";
import { cn, formatDate, inr, ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL } from "@/lib/format";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["placed", "confirmed", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  return (
    <Suspense>
      <Orders />
    </Suspense>
  );
}

function Orders() {
  const params = useSearchParams();
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);

  const qs = new URLSearchParams({ page: String(page), limit: "20", ...(status && { status }), ...(query && { q: query }) });
  const { data, loading, error, reload } = useAdminData<{ orders: Order[]; total: number; pages: number }>(`/api/admin/orders?${qs}`);

  // Deep-link from the dashboard: /admin/orders?open=<id>
  const openId = params.get("open");
  useEffect(() => {
    if (openId && data && !selected) {
      const o = data.orders.find((x) => x._id === openId);
      if (o) setSelected(o);
    }
  }, [openId, data, selected]);

  return (
    <>
      <AdminPageTitle title="Orders" subtitle={data ? `${data.total} orders` : undefined} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setQuery(q.trim());
          }}
          className="relative w-full max-w-sm"
        >
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order #, name, phone, email" className="field pl-10" />
        </form>
        <div className="flex flex-wrap gap-1.5">
          {["", ...STATUSES].map((s) => (
            <button
              key={s || "all"}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                status === s ? "border-leaf bg-leaf text-milk" : "border-border text-muted hover:text-heading",
              )}
            >
              {s ? ORDER_STATUS_LABEL[s] : "All"}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="rounded-2xl bg-red-500/10 p-4 text-red-600">{error}</p>}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2/60 text-left text-xs text-muted uppercase">
              <tr>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Items</th>
                <th className="px-5 py-3 font-semibold">Slot</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Payment</th>
                <th className="px-5 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && !data
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={7} className="px-5 py-4">
                        <div className="h-5 animate-pulse rounded bg-surface-2" />
                      </td>
                    </tr>
                  ))
                : data?.orders.map((o) => (
                    <tr key={o._id} onClick={() => setSelected(o)} className="cursor-pointer hover:bg-surface-2/40">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-heading">#{o.orderNumber}</p>
                        <p className="text-xs text-muted">{formatDate(o.createdAt, true)}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-heading">{o.customer.name}</p>
                        <p className="text-xs text-muted">
                          {o.customer.phone} · {o.shippingAddress.pincode}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {o.items.map((i) => `${i.name} ${i.variantLabel} ×${i.quantity}`).join(", ")}
                      </td>
                      <td className="px-5 py-3 capitalize">{o.deliverySlot}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-5 py-3 text-xs">
                        <p>{PAYMENT_METHOD_LABEL[o.paymentMethod]}</p>
                        <p className={o.paymentStatus === "paid" ? "font-semibold text-leaf" : "text-muted"}>{o.paymentStatus}</p>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums">{inr(o.total)}</td>
                    </tr>
                  ))}
              {data && data.orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {data && data.pages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm">
            <span className="text-muted">
              Page {page} of {data.pages}
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button size="sm" variant="outline" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <OrderDrawer
        order={selected}
        onClose={() => setSelected(null)}
        onUpdated={(o) => {
          setSelected(o);
          reload();
        }}
      />
    </>
  );
}

function OrderDrawer({ order, onClose, onUpdated }: { order: Order | null; onClose: () => void; onUpdated: (o: Order) => void }) {
  const [status, setStatus] = useState<OrderStatus>("placed");
  const [payment, setPayment] = useState<PaymentStatus>("pending");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setPayment(order.paymentStatus);
      setNote("");
    }
  }, [order]);

  const save = async () => {
    if (!order) return;
    if (status === "cancelled" && order.status !== "cancelled" && !confirm("Cancel this order? Stock will be returned to inventory.")) return;
    setSaving(true);
    try {
      const res = await api<{ order: Order }>(`/api/admin/orders/${order._id}`, {
        method: "PATCH",
        auth: true,
        body: { status, paymentStatus: payment, note: note || undefined },
      });
      toast.success("Order updated");
      onUpdated(res.order);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {order && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto bg-background shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 34 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 px-6 py-4 backdrop-blur">
              <h2 className="text-xl font-semibold">Order details</h2>
              <button onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-surface-2" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-6 p-6">
              <div className="card grid gap-4 p-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="o-status">
                    Order status
                  </label>
                  <select id="o-status" className="field" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} disabled={order.status === "cancelled"}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="o-pay">
                    Payment status
                  </label>
                  <select id="o-pay" className="field" value={payment} onChange={(e) => setPayment(e.target.value as PaymentStatus)}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="o-note">
                    Note (optional, saved in history)
                  </label>
                  <input id="o-note" className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Delivered to security guard" />
                </div>
                <div className="flex flex-wrap gap-2 sm:col-span-2">
                  <Button onClick={save} loading={saving}>
                    Save changes
                  </Button>
                  <a href={`tel:${order.customer.phone}`} className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-heading hover:bg-surface-2">
                    <Phone className="size-4" /> Call customer
                  </a>
                </div>
              </div>

              <OrderDetails order={order} />

              {order.notes && (
                <div className="rounded-2xl border border-gold/40 bg-gold-soft p-4 text-sm">
                  <p className="font-semibold text-heading">Customer note</p>
                  <p className="mt-1 text-muted">{order.notes}</p>
                </div>
              )}

              <div>
                <h3 className="mb-3 font-sans text-sm font-semibold text-heading">History</h3>
                <ol className="space-y-2 text-sm">
                  {[...order.statusHistory].reverse().map((h, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-leaf" />
                      <span>
                        <span className="font-medium text-heading">{ORDER_STATUS_LABEL[h.status] || h.status}</span>
                        {h.note && <span className="text-muted"> — {h.note}</span>}
                        <span className="block text-xs text-muted">{formatDate(h.at, true)}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
