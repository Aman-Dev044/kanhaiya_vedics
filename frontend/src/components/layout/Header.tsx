"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, ShoppingBag, User, X, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/format";

export function Header() {
  const pathname = usePathname();
  const settings = useSettings();
  const { count, setDrawerOpen, ready } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !open);
  });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50"
      >
        <div
          className={cn(
            "transition-all duration-500",
            scrolled
              ? "border-b border-border/70 bg-background/80 shadow-[0_8px_30px_-20px_rgb(var(--shadow)/0.35)] backdrop-blur-xl"
              : "border-b border-transparent bg-transparent",
          )}
        >
          <nav className="container-x flex h-[4.5rem] items-center justify-between gap-4" aria-label="Main">
            <Logo name={settings.brand.name} size="sm" />

            <ul className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-[0.92rem] font-medium transition-colors",
                      isActive(l.href) ? "text-heading" : "text-muted hover:text-heading",
                    )}
                  >
                    {isActive(l.href) && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-leaf-soft"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1">
              <ThemeToggle />
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  aria-label="Admin panel"
                  className="hidden size-10 place-items-center rounded-full text-heading hover:bg-surface-2 sm:grid"
                >
                  <LayoutDashboard className="size-[1.15rem]" />
                </Link>
              )}
              <Link
                href={user ? "/account" : "/login"}
                aria-label={user ? "My account" : "Log in"}
                className="hidden size-10 place-items-center rounded-full text-heading hover:bg-surface-2 sm:grid"
              >
                <User className="size-[1.15rem]" />
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label={`Open cart (${count} items)`}
                className="relative grid size-10 place-items-center rounded-full text-heading hover:bg-surface-2"
              >
                <ShoppingBag className="size-[1.15rem]" />
                <AnimatePresence>
                  {ready && count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[0.68rem] font-bold text-[#1f2a1b]"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button
                type="button"
                className="grid size-10 place-items-center rounded-full text-heading hover:bg-surface-2 lg:hidden"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.25rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.25rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.25rem)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-[4.5rem] z-40 overflow-y-auto bg-background lg:hidden"
            data-lenis-prevent
          >
            <ul className="container-x flex flex-col gap-1 py-8">
              {[...NAV_LINKS, { href: user ? "/account" : "/login", label: user ? "My Account" : "Login / Sign up" }, { href: "/track-order", label: "Track Order" }, ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin Panel" }] : [])].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5 }}
                >
                  <Link
                    href={l.href}
                    className={cn(
                      "block border-b border-border py-4 font-display text-3xl",
                      isActive(l.href) ? "text-leaf" : "text-heading",
                    )}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <p className="container-x pb-10 text-sm text-muted">
              {settings.contact.phone} · {settings.contact.email}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
