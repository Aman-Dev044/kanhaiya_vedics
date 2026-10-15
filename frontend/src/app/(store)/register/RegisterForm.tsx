"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { safeNext } from "../login/LoginForm";

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await register(form);
      toast.success(`Welcome to the family, ${user.name.split(" ")[0]}!`);
      router.push(safeNext(params.get("next"), "/account"));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create account");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="r-name" className="label">
          Full name
        </label>
        <input id="r-name" autoComplete="name" required value={form.name} onChange={set("name")} className="field" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="r-email" className="label">
            Email
          </label>
          <input id="r-email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} className="field" />
        </div>
        <div>
          <label htmlFor="r-phone" className="label">
            Mobile <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="r-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="r-pass" className="label">
          Password
        </label>
        <input id="r-pass" type="password" autoComplete="new-password" minLength={8} required value={form.password} onChange={set("password")} className="field" />
        <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
      </div>
      {error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Create account
      </Button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-leaf hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
