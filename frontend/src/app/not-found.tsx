import Link from "next/link";
import { LeafMark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <LeafMark className="mx-auto h-14 w-auto animate-float" />
        <p className="mt-8 font-display text-8xl font-semibold text-heading">404</p>
        <h1 className="mt-4 text-3xl font-semibold">This page wandered off to graze</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">The page you are looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover">
            Back home
          </Link>
          <Link href="/products" className="rounded-full border border-border px-6 py-3 font-semibold text-heading hover:bg-surface-2">
            Shop products
          </Link>
        </div>
      </div>
    </main>
  );
}
