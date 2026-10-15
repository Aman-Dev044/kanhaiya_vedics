import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from "@/components/brand/SocialIcons";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import type { Product, SiteSettings } from "@/lib/types";

export function Footer({ settings, products }: { settings: SiteSettings; products: Product[] }) {
  const socials = [
    { href: settings.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.social.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: settings.social.x, label: "X", Icon: XIcon },
  ].filter((s) => s.href);

  const columns = [
    {
      title: "Shop",
      links: [
        ...products.map((p) => ({ href: `/products/${p.slug}`, label: p.name })),
        { href: "/products", label: "All products" },
        { href: "/subscribe", label: "Daily milk subscription" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "Our story" },
        { href: "/contact", label: "Contact us" },
        { href: "/track-order", label: "Track your order" },
      ],
    },
    {
      title: "Policies",
      links: [
        { href: "/shipping-policy", label: "Delivery & shipping" },
        { href: "/refund-policy", label: "Returns & refunds" },
        { href: "/privacy-policy", label: "Privacy policy" },
        { href: "/terms", label: "Terms of service" },
      ],
    },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-surface-2/60">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="space-y-6">
          <Logo name={settings.brand.name} size="md" />
          <p className="max-w-sm text-sm leading-relaxed text-muted">{settings.brand.description}</p>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-leaf" />
              <a href={`tel:${settings.contact.phone.replace(/\s/g, "")}`} className="hover:text-heading">
                {settings.contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-leaf" />
              <a href={`mailto:${settings.contact.email}`} className="hover:text-heading">
                {settings.contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-leaf" />
              <span>{settings.contact.address}</span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-leaf" />
              <span>{settings.contact.hours}</span>
            </li>
          </ul>
          {socials.length > 0 && (
            <div className="flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-border text-heading transition hover:-translate-y-0.5 hover:border-leaf hover:bg-leaf hover:text-milk"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-4 font-sans text-xs font-semibold tracking-[0.2em] text-heading uppercase">
                {col.title}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-muted transition-colors hover:text-leaf">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="sm:col-span-3">
            <h3 className="mb-2 font-display text-xl">Fresh news from the farm</h3>
            <p className="mb-4 text-sm text-muted">Seasonal offers, farm stories and new launches. No spam.</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none container-x h-[0.72em] overflow-hidden font-display text-[18vw] leading-[0.95] font-semibold tracking-tight text-heading/[0.05] select-none lg:text-[13rem]"
      >
        {settings.brand.name.split(" ")[0]}
      </div>

      <div className="border-t border-border">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.brand.name}. All rights reserved.
          </p>
          <p className="brush text-[0.72rem]">{settings.brand.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
