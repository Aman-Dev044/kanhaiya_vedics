"use client";

import { useState } from "react";
import { Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { useAdminData } from "@/components/admin/admin-utils";
import { api, ApiError } from "@/lib/api";
import { cn, formatDate } from "@/lib/format";
import type { Enquiry } from "@/lib/types";

const TYPES = [
  { v: "", label: "All" },
  { v: "subscription", label: "Subscriptions" },
  { v: "contact", label: "Contact" },
  { v: "newsletter", label: "Newsletter" },
];
const STATUS_TONE: Record<string, string> = {
  new: "bg-gold-soft text-gold",
  in_progress: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  closed: "bg-leaf-soft text-leaf",
};

export default function EnquiriesPage() {
  const [type, setType] = useState("");
  const { data, loading, error, setData } = useAdminData<{ enquiries: Enquiry[] }>(`/api/admin/enquiries${type ? `?type=${type}` : ""}`);

  const update = async (id: string, status: Enquiry["status"]) => {
    try {
      await api(`/api/admin/enquiries/${id}`, { method: "PATCH", auth: true, body: { status } });
      setData((d) => d && { enquiries: d.enquiries.map((e) => (e._id === id ? { ...e, status } : e)) });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Update failed");
    }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await api(`/api/admin/enquiries/${id}`, { method: "DELETE", auth: true });
      setData((d) => d && { enquiries: d.enquiries.filter((e) => e._id !== id) });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Delete failed");
    }
  };

  const newsletterEmails = data?.enquiries.filter((e) => e.type === "newsletter" && e.email).map((e) => e.email) ?? [];

  return (
    <>
      <AdminPageTitle
        title="Enquiries"
        subtitle="Subscription requests, contact messages and newsletter sign-ups."
        actions={
          type === "newsletter" && newsletterEmails.length > 0 ? (
            <button
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-surface-2"
              onClick={() => {
                navigator.clipboard.writeText(newsletterEmails.join(", "));
                toast.success(`${newsletterEmails.length} emails copied`);
              }}
            >
              Copy all emails
            </button>
          ) : undefined
        }
      />
      <div className="mb-5 flex flex-wrap gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t.v}
            onClick={() => setType(t.v)}
            className={cn("rounded-full border px-3.5 py-1.5 text-xs font-semibold", type === t.v ? "border-leaf bg-leaf text-milk" : "border-border text-muted hover:text-heading")}
          >
            {t.label}
          </button>
        ))}
      </div>
      {error && <p className="rounded-2xl bg-red-500/10 p-4 text-red-600">{error}</p>}
      <div className="space-y-3">
        {loading && !data && Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-3xl bg-surface-2" />)}
        {data?.enquiries.length === 0 && <p className="card p-10 text-center text-muted">Nothing here yet.</p>}
        {data?.enquiries.map((e) => (
          <article key={e._id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[0.7rem] font-semibold text-heading capitalize">{e.type}</span>
                  <span className="text-xs text-muted">{formatDate(e.createdAt, true)}</span>
                </div>
                <h2 className="mt-2 font-sans text-base font-semibold text-heading">{e.name || e.email}</h2>
                {e.subject && <p className="text-sm text-muted">{e.subject}</p>}
              </div>
              <div className="flex items-center gap-2">
                {e.type !== "newsletter" && (
                  <select
                    value={e.status}
                    onChange={(ev) => update(e._id, ev.target.value as Enquiry["status"])}
                    className={cn("rounded-full border-0 px-3 py-1.5 text-xs font-semibold", STATUS_TONE[e.status])}
                    aria-label="Status"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In progress</option>
                    <option value="closed">Closed</option>
                  </select>
                )}
                <button onClick={() => remove(e._id)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-red-500/10 hover:text-red-500" aria-label="Delete">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            {e.message && <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-foreground">{e.message}</p>}
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              {e.phone && (
                <a href={`tel:${e.phone}`} className="flex items-center gap-1.5 text-leaf hover:underline">
                  <Phone className="size-3.5" /> {e.phone}
                </a>
              )}
              {e.email && (
                <a href={`mailto:${e.email}`} className="flex items-center gap-1.5 text-leaf hover:underline">
                  <Mail className="size-3.5" /> {e.email}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
