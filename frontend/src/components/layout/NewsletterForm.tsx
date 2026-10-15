"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api<{ message: string }>("/api/newsletter", { method: "POST", body: { email } });
      toast.success(res.message);
      setEmail("");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex max-w-md gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="field rounded-full"
      />
      <Button type="submit" loading={loading} aria-label="Subscribe" className="shrink-0">
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
