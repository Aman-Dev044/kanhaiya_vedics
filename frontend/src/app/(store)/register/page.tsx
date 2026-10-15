import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Create account", robots: { index: false, follow: true } };

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" subtitle="Save your address, track orders and reorder in a tap.">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
