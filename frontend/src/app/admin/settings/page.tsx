"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Moon, Plus, Sun, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { ListEditor, Section, Toggle } from "@/components/admin/ProductForm";
import { revalidateStorefront, useAdminData } from "@/components/admin/admin-utils";
import { Button } from "@/components/ui/Button";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/format";
import type { SiteSettings, ThemeMode } from "@/lib/types";

const TABS = [
  { id: "general", label: "Brand & theme" },
  { id: "home", label: "Homepage" },
  { id: "contact", label: "Contact & social" },
  { id: "delivery", label: "Delivery & payments" },
  { id: "seo", label: "SEO" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const router = useRouter();
  const { data, error } = useAdminData<{ settings: SiteSettings }>("/api/settings");
  const [s, setS] = useState<SiteSettings | null>(null);
  const [tab, setTab] = useState<Tab>("general");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (data) setS(data.settings);
  }, [data]);

  /** Update a nested section: patch("contact", { phone }) */
  const patch = <K extends keyof SiteSettings>(k: K, v: Partial<SiteSettings[K]> | SiteSettings[K]) => {
    setDirty(true);
    setS((x) => x && { ...x, [k]: Array.isArray(v) ? v : { ...(x[k] as object), ...(v as object) } });
  };

  const save = async () => {
    if (!s) return;
    setSaving(true);
    try {
      const { brand, contact, social, delivery, announcement, hero, stats, testimonials, faqs, seo, theme } = s;
      const res = await api<{ settings: SiteSettings }>("/api/settings", {
        method: "PUT",
        auth: true,
        body: {
          brand,
          contact,
          social,
          delivery: { ...delivery, serviceablePincodes: delivery.serviceablePincodes.map((p) => p.trim()).filter(Boolean) },
          announcement,
          hero,
          stats: stats.filter((x) => x.value && x.label),
          testimonials: testimonials.filter((t) => t.name && t.quote),
          faqs: faqs.filter((f) => f.question && f.answer),
          seo: { ...seo, keywords: seo.keywords.map((k) => k.trim()).filter(Boolean) },
          theme,
        },
      });
      setS(res.settings);
      setDirty(false);
      await revalidateStorefront(["settings"]);
      router.refresh();
      toast.success("Settings saved — the website is updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  if (error) return <p className="rounded-2xl bg-red-500/10 p-4 text-red-600">{error}</p>;
  if (!s) return <div className="h-96 animate-pulse rounded-3xl bg-surface-2" />;

  const input = (label: string, value: string | number, onChange: (v: string) => void, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className={extra.className}>
      <label className="label">{label}</label>
      <input className="field" value={value} onChange={(e) => onChange(e.target.value)} {...extra} />
    </div>
  );
  const area = (label: string, value: string, onChange: (v: string) => void, rows = 3) => (
    <div className="sm:col-span-2">
      <label className="label">{label}</label>
      <textarea className="field resize-none" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );

  return (
    <>
      <AdminPageTitle
        title="Site settings"
        subtitle="Everything here updates the live website instantly — no code changes needed."
        actions={
          <Button onClick={save} loading={saving} disabled={!dirty}>
            {dirty ? "Save changes" : "Saved"}
          </Button>
        }
      />

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn("relative px-4 py-3 text-sm font-semibold whitespace-nowrap", tab === t.id ? "text-heading" : "text-muted hover:text-heading")}>
            {t.label}
            {tab === t.id && <motion.span layoutId="settings-tab" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-leaf" />}
          </button>
        ))}
      </div>

      <div className="max-w-4xl space-y-6">
        {tab === "general" && (
          <>
            <Section title="Brand">
              <div className="grid gap-5 sm:grid-cols-2">
                {input("Brand name", s.brand.name, (v) => patch("brand", { name: v }))}
                {input("Tagline", s.brand.tagline, (v) => patch("brand", { tagline: v }))}
                {area("Short brand description (footer, About page, structured data)", s.brand.description, (v) => patch("brand", { description: v }))}
              </div>
            </Section>
            <Section title="Default theme for new visitors">
              <p className="mb-4 text-sm text-muted">Visitors can always switch with the sun/moon button; this sets what they see first.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { v: "light" as ThemeMode, Icon: Sun, label: "Light" },
                  { v: "dark" as ThemeMode, Icon: Moon, label: "Dark" },
                  { v: "system" as ThemeMode, Icon: Monitor, label: "Match device" },
                ].map(({ v, Icon, label }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => patch("theme", { defaultMode: v })}
                    className={cn("flex items-center gap-3 rounded-2xl border p-4 text-left font-semibold", s.theme.defaultMode === v ? "border-leaf bg-leaf-soft text-heading ring-1 ring-leaf" : "border-border text-muted")}
                  >
                    <Icon className="size-5" /> {label}
                  </button>
                ))}
              </div>
            </Section>
            <Section title="Announcement bar">
              <Toggle label="Show announcement bar" checked={s.announcement.enabled} onChange={(v) => patch("announcement", { enabled: v })} />
              <div className="mt-3">{input("Text (separate messages with ·)", s.announcement.text, (v) => patch("announcement", { text: v }))}</div>
            </Section>
          </>
        )}

        {tab === "home" && (
          <>
            <Section title="Hero">
              <div className="grid gap-5 sm:grid-cols-2">
                {input("Small heading (eyebrow)", s.hero.eyebrow, (v) => patch("hero", { eyebrow: v }))}
                {input("Button text", s.hero.ctaText, (v) => patch("hero", { ctaText: v }))}
                {input("Main headline (last 2 words are highlighted)", s.hero.title, (v) => patch("hero", { title: v }), { className: "sm:col-span-2" })}
                {area("Sub-heading", s.hero.subtitle, (v) => patch("hero", { subtitle: v }))}
              </div>
            </Section>

            <Section title="Numbers strip">
              <div className="space-y-2">
                {s.stats.map((st, i) => (
                  <div key={i} className="flex gap-2">
                    <input className="field w-32" placeholder="100%" value={st.value} onChange={(e) => patch("stats", s.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
                    <input className="field" placeholder="Label" value={st.label} onChange={(e) => patch("stats", s.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                    <IconBtn onClick={() => patch("stats", s.stats.filter((_, j) => j !== i))} />
                  </div>
                ))}
                {s.stats.length < 6 && (
                  <Button size="sm" variant="secondary" onClick={() => patch("stats", [...s.stats, { value: "", label: "" }])}>
                    <Plus className="size-4" /> Add number
                  </Button>
                )}
              </div>
            </Section>

            <Section title="Customer testimonials">
              <p className="mb-4 text-sm text-muted">The testimonials section appears on the homepage once you add at least one. Please use genuine customer feedback.</p>
              <div className="space-y-3">
                {s.testimonials.map((t, i) => {
                  const upd = (p: Partial<typeof t>) => patch("testimonials", s.testimonials.map((x, j) => (j === i ? { ...x, ...p } : x)));
                  return (
                    <div key={i} className="grid gap-2 rounded-2xl border border-border p-3 sm:grid-cols-[1fr_1fr_6rem_auto]">
                      <input className="field" placeholder="Name" value={t.name} onChange={(e) => upd({ name: e.target.value })} />
                      <input className="field" placeholder="City / area" value={t.location || ""} onChange={(e) => upd({ location: e.target.value })} />
                      <select className="field" value={t.rating} onChange={(e) => upd({ rating: +e.target.value })} aria-label="Rating">
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} ★
                          </option>
                        ))}
                      </select>
                      <IconBtn onClick={() => patch("testimonials", s.testimonials.filter((_, j) => j !== i))} />
                      <textarea className="field resize-none sm:col-span-4" rows={2} placeholder="What they said" value={t.quote} onChange={(e) => upd({ quote: e.target.value })} />
                    </div>
                  );
                })}
                <Button size="sm" variant="secondary" onClick={() => patch("testimonials", [...s.testimonials, { name: "", location: "", quote: "", rating: 5 }])}>
                  <Plus className="size-4" /> Add testimonial
                </Button>
              </div>
            </Section>

            <Section title="Homepage FAQs">
              <div className="space-y-3">
                {s.faqs.map((f, i) => (
                  <div key={i} className="grid gap-2 rounded-2xl border border-border p-3">
                    <div className="flex gap-2">
                      <input className="field" placeholder="Question" value={f.question} onChange={(e) => patch("faqs", s.faqs.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))} />
                      <IconBtn onClick={() => patch("faqs", s.faqs.filter((_, j) => j !== i))} />
                    </div>
                    <textarea className="field resize-none" rows={2} placeholder="Answer" value={f.answer} onChange={(e) => patch("faqs", s.faqs.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)))} />
                  </div>
                ))}
                <Button size="sm" variant="secondary" onClick={() => patch("faqs", [...s.faqs, { question: "", answer: "" }])}>
                  <Plus className="size-4" /> Add FAQ
                </Button>
              </div>
            </Section>
          </>
        )}

        {tab === "contact" && (
          <>
            <Section title="Contact details">
              <div className="grid gap-5 sm:grid-cols-2">
                {input("Phone", s.contact.phone, (v) => patch("contact", { phone: v }))}
                {input("WhatsApp number (with country code, digits only)", s.contact.whatsapp, (v) => patch("contact", { whatsapp: v.replace(/\D/g, "") }))}
                {input("Email", s.contact.email, (v) => patch("contact", { email: v }), { type: "email" })}
                {input("Working hours", s.contact.hours, (v) => patch("contact", { hours: v }))}
                {area("Address", s.contact.address, (v) => patch("contact", { address: v }), 2)}
              </div>
            </Section>
            <Section title="Social links (leave empty to hide)">
              <div className="grid gap-5 sm:grid-cols-2">
                {(["instagram", "facebook", "youtube", "x"] as const).map((k) => input(k === "x" ? "X (Twitter)" : k[0].toUpperCase() + k.slice(1), s.social[k], (v) => patch("social", { [k]: v }), { placeholder: "https://…", type: "url" }))}
              </div>
            </Section>
          </>
        )}

        {tab === "delivery" && (
          <>
            <Section title="Delivery charges">
              <div className="grid gap-5 sm:grid-cols-2">
                {input("Delivery fee (₹)", s.delivery.fee, (v) => patch("delivery", { fee: +v || 0 }), { type: "number", min: 0 })}
                {input("Free delivery above (₹)", s.delivery.freeAbove, (v) => patch("delivery", { freeAbove: +v || 0 }), { type: "number", min: 0 })}
                {input("Morning slot", s.delivery.morningSlot, (v) => patch("delivery", { morningSlot: v }))}
                {input("Evening slot", s.delivery.eveningSlot, (v) => patch("delivery", { eveningSlot: v }))}
              </div>
            </Section>
            <Section title="Serviceable pincodes">
              <p className="mb-3 text-sm text-muted">Leave empty to accept orders from every pincode.</p>
              <textarea
                className="field"
                rows={3}
                placeholder="281121, 281001, …"
                value={s.delivery.serviceablePincodes.join(", ")}
                onChange={(e) => patch("delivery", { serviceablePincodes: e.target.value.split(/[\s,]+/) })}
              />
            </Section>
            <Section title="Payment methods">
              <Toggle label="Cash on delivery" checked={s.delivery.codEnabled} onChange={(v) => patch("delivery", { codEnabled: v })} />
              <Toggle label="UPI on delivery" checked={s.delivery.upiOnDeliveryEnabled} onChange={(v) => patch("delivery", { upiOnDeliveryEnabled: v })} />
            </Section>
          </>
        )}

        {tab === "seo" && (
          <Section title="Default SEO (homepage & fallback)">
            <div className="grid gap-5">
              <div>
                <label className="label">
                  Meta title <span className="font-normal text-muted">({s.seo.title.length}/60)</span>
                </label>
                <input className="field" value={s.seo.title} onChange={(e) => patch("seo", { title: e.target.value })} />
              </div>
              <div>
                <label className="label">
                  Meta description <span className="font-normal text-muted">({s.seo.description.length}/160)</span>
                </label>
                <textarea className="field resize-none" rows={3} value={s.seo.description} onChange={(e) => patch("seo", { description: e.target.value })} />
              </div>
              <ListEditor label="Keywords" items={s.seo.keywords} onChange={(v) => patch("seo", { keywords: v })} placeholder="desi cow milk" />
              <div className="rounded-2xl border border-border bg-surface-2/50 p-4">
                <p className="text-xs font-semibold text-muted uppercase">Google preview</p>
                <p className="mt-2 truncate text-lg text-[#1a0dab] dark:text-[#8ab4f8]">{s.seo.title}</p>
                <p className="text-sm text-[#006621] dark:text-[#81c995]">{typeof window !== "undefined" ? window.location.origin : ""}</p>
                <p className="line-clamp-2 text-sm text-muted">{s.seo.description}</p>
              </div>
            </div>
          </Section>
        )}
      </div>
    </>
  );
}

function IconBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-red-500/10 hover:text-red-500" aria-label="Remove">
      <Trash2 className="size-4" />
    </button>
  );
}
