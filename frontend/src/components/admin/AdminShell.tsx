"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { cn } from "@/lib/format";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/enquiries", label: "Enquiries", Icon: Inbox },
  { href: "/admin/customers", label: "Customers", Icon: Users },
  { href: "/admin/settings", label: "Site settings", Icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { brand } = useSettings();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, user, router, pathname]);

  useEffect(() => setOpen(false), [pathname]);

  if (loading || !user) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Loader2 className="size-8 animate-spin text-leaf" />
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="grid min-h-dvh place-items-center px-4 text-center">
        <div>
          <h1 className="text-3xl font-semibold">Admins only</h1>
          <p className="mt-2 text-muted">Your account doesn&apos;t have access to the admin panel.</p>
          <Link href="/" className="mt-6 inline-block font-semibold text-leaf hover:underline">
            Back to the store
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 p-4" aria-label="Admin">
      <div className="mb-6 px-3 pt-2">
        <Logo name={brand.name} size="sm" href="/admin" />
        <p className="mt-2 text-[0.65rem] font-semibold tracking-[0.25em] text-muted uppercase">Admin panel</p>
      </div>
      {NAV.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(href) ? "text-heading" : "text-muted hover:bg-surface-2 hover:text-heading",
          )}
        >
          {isActive(href) && (
            <motion.span layoutId="admin-nav" className="absolute inset-0 -z-10 rounded-xl bg-leaf-soft" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
          )}
          <Icon className={cn("size-[1.1rem]", isActive(href) && "text-leaf")} />
          {label}
        </Link>
      ))}
      <div className="mt-auto space-y-1 border-t border-border pt-4">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-surface-2 hover:text-heading">
          <ExternalLink className="size-[1.1rem]" /> View store
        </Link>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut className="size-[1.1rem]" /> Log out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh border-r border-border bg-surface isolate lg:block">{sidebar}</aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 isolate w-64 border-r border-border bg-surface lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <button className="grid size-10 place-items-center rounded-full hover:bg-surface-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <p className="hidden text-sm text-muted sm:block">
            Signed in as <span className="font-semibold text-heading">{user.name}</span>
          </p>
          <ThemeToggle />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
