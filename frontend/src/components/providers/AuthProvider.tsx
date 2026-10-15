"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, ApiError, AUTH_STORAGE_KEY } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<User>;
  logout: () => void;
  setUser: (u: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persist = (t: string | null, u: User | null) => {
    setToken(t);
    setUserState(u);
    try {
      if (t && u) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: t, user: u }));
      else localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  };

  // Restore the session, then confirm the token is still valid.
  useEffect(() => {
    let stored: { token: string; user: User } | null = null;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      stored = raw ? JSON.parse(raw) : null;
    } catch {}
    if (!stored?.token) {
      setLoading(false);
      return;
    }
    setToken(stored.token);
    setUserState(stored.user);
    api<{ user: User }>("/api/auth/me", { token: stored.token })
      .then(({ user }) => persist(stored!.token, user))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) persist(null, null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    persist(res.token, res.user);
    return res.user;
  }, []);

  const register = useCallback<AuthContextValue["register"]>(async (data) => {
    const res = await api<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: data,
    });
    persist(res.token, res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => persist(null, null), []);

  const setUser = useCallback(
    (u: User) => {
      if (token) persist(token, u);
    },
    [token],
  );

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
