import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "gold" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-55 active:scale-[0.97] overflow-hidden";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-[0_10px_30px_-12px_rgb(var(--shadow)/0.55)] hover:shadow-[0_16px_40px_-14px_rgb(var(--shadow)/0.7)] hover:-translate-y-0.5",
  secondary: "bg-leaf-soft text-heading hover:bg-leaf hover:text-milk",
  outline: "border border-heading/25 text-heading hover:border-heading hover:bg-heading hover:text-background",
  ghost: "text-heading hover:bg-surface-2",
  gold: "bg-gradient-to-r from-[#b98e35] via-[#e2c47a] to-[#b98e35] bg-[length:200%_100%] bg-left hover:bg-right text-[#1f2a1b] shadow-[0_10px_30px_-12px_rgba(185,142,53,0.7)] hover:-translate-y-0.5",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  loading,
  children,
  ...props
}: CommonProps & { loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}
