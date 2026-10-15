import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in", robots: { index: false, follow: true } };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Log in to track orders and check out faster.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
