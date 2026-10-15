"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { useAdminData } from "@/components/admin/admin-utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { api, ApiError } from "@/lib/api";
import { formatDate, inr } from "@/lib/format";
import type { User } from "@/lib/types";

type Row = User & { orders: number; spent: number };

export default function CustomersPage() {
  const { user: me } = useAuth();
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const { data, loading, error, setData } = useAdminData<{ users: Row[] }>(`/api/admin/users${query ? `?q=${encodeURIComponent(query)}` : ""}`);

  const setRole = async (u: Row, role: User["role"]) => {
    if (!confirm(role === "admin" ? `Give ${u.name} full admin access?` : `Remove admin access for ${u.name}?`)) return;
    try {
      await api(`/api/admin/users/${u._id}`, { method: "PATCH", auth: true, body: { role } });
      setData((d) => d && { users: d.users.map((x) => (x._id === u._id ? { ...x, role } : x)) });
      toast.success("Role updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Update failed");
    }
  };

  return (
    <>
      <AdminPageTitle title="Customers" subtitle={data ? `${data.users.length} accounts` : undefined} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(q.trim());
        }}
        className="relative mb-5 max-w-sm"
      >
        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone" className="field pl-10" />
      </form>
      {error && <p className="rounded-2xl bg-red-500/10 p-4 text-red-600">{error}</p>}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-2/60 text-left text-xs text-muted uppercase">
            <tr>
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Contact</th>
              <th className="px-5 py-3 font-semibold">City</th>
              <th className="px-5 py-3 font-semibold">Joined</th>
              <th className="px-5 py-3 text-right font-semibold">Orders</th>
              <th className="px-5 py-3 text-right font-semibold">Spent</th>
              <th className="px-5 py-3 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && !data && (
              <tr>
                <td colSpan={7} className="px-5 py-6">
                  <div className="h-5 animate-pulse rounded bg-surface-2" />
                </td>
              </tr>
            )}
            {data?.users.map((u) => (
              <tr key={u._id} className="hover:bg-surface-2/40">
                <td className="px-5 py-3 font-medium text-heading">{u.name}</td>
                <td className="px-5 py-3 text-muted">
                  {u.email}
                  {u.phone && <span className="block text-xs">{u.phone}</span>}
                </td>
                <td className="px-5 py-3 text-muted">{u.address?.city || "—"}</td>
                <td className="px-5 py-3 text-muted">{u.createdAt ? formatDate(u.createdAt) : "—"}</td>
                <td className="px-5 py-3 text-right tabular-nums">{u.orders}</td>
                <td className="px-5 py-3 text-right font-semibold tabular-nums">{inr(u.spent)}</td>
                <td className="px-5 py-3">
                  <select
                    value={u.role}
                    disabled={u._id === me?._id}
                    onChange={(e) => setRole(u, e.target.value as User["role"])}
                    className="rounded-full border border-border bg-transparent px-3 py-1 text-xs font-semibold disabled:opacity-60"
                    aria-label={`Role for ${u.name}`}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
            {data?.users.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
