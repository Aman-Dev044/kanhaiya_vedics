"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError, getStoredToken } from "@/lib/api";

/** Fetches an admin endpoint with the stored token; exposes reload for after mutations. */
export function useAdminData<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    try {
      setData(await api<T>(path, { auth: true }));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, loading, reload: load, setData };
}

/** Refreshes the statically generated storefront after admin edits. */
export async function revalidateStorefront(tags?: string[]) {
  const token = getStoredToken();
  if (!token) return;
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tags }),
  }).catch(() => {});
}
