"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { revalidateStorefront } from "@/components/admin/admin-utils";
import { api, ApiError } from "@/lib/api";
import { slugify } from "@/lib/format";
import type { Product, Variant } from "@/lib/types";

const EMPTY: Product = {
  name: "",
  slug: "",
  category: "milk",
  tagline: "",
  shortDescription: "",
  description: "",
  images: [],
  variants: [{ sku: "", label: "", price: 0, mrp: 0, stock: 0 }],
  highlights: [],
  storage: "",
  shelfLife: "",
  usage: "",
  faqs: [],
  rating: 0,
  reviewCount: 0,
  featured: false,
  isActive: true,
  sortOrder: 0,
  seo: { title: "", description: "", keywords: [] },
};

export function ProductForm({ initial }: { initial?: Product }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [p, setP] = useState<Product>(() => ({ ...EMPTY, ...initial, seo: { ...EMPTY.seo, ...initial?.seo } }));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newImage, setNewImage] = useState("");

  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));
  const setVariant = (i: number, patch: Partial<Variant>) =>
    set("variants", p.variants.map((v, j) => (j === i ? { ...v, ...patch } : v)));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...p,
        highlights: p.highlights.filter(Boolean),
        faqs: p.faqs.filter((f) => f.question && f.answer),
        seo: { ...p.seo, keywords: (p.seo?.keywords || []).filter(Boolean) },
      };
      delete (body as Partial<Product>)._id;
      delete (body as Partial<Product>).updatedAt;
      const path = isEdit ? `/api/products/${initial!.slug}` : "/api/products";
      const res = await api<{ product: Product }>(path, { method: isEdit ? "PUT" : "POST", auth: true, body });
      await revalidateStorefront(["products"]);
      toast.success(isEdit ? "Product saved — storefront updated" : "Product created");
      if (!isEdit || res.product.slug !== initial!.slug) router.replace(`/admin/products/${res.product.slug}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!initial || !confirm(`Delete "${initial.name}" permanently? Consider hiding it instead.`)) return;
    setDeleting(true);
    try {
      await api(`/api/products/${initial.slug}`, { method: "DELETE", auth: true });
      await revalidateStorefront(["products"]);
      toast.success("Product deleted");
      router.replace("/admin/products");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete");
      setDeleting(false);
    }
  };

  const text = (k: "name" | "tagline" | "storage" | "shelfLife" | "usage", label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className="label" htmlFor={`pf-${k}`}>
        {label}
      </label>
      <input id={`pf-${k}`} className="field" value={(p[k] as string) || ""} onChange={(e) => set(k, e.target.value)} {...extra} />
    </div>
  );

  return (
    <form onSubmit={save} className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <Section title="Basics">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="pf-name">
                Product name *
              </label>
              <input
                id="pf-name"
                className="field"
                required
                value={p.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setP((x) => ({ ...x, name, slug: isEdit ? x.slug : slugify(name) }));
                }}
              />
            </div>
            <div>
              <label className="label" htmlFor="pf-slug">
                URL slug *
              </label>
              <input id="pf-slug" className="field" required value={p.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
              <p className="mt-1 text-xs text-muted">/products/{p.slug || "…"}</p>
            </div>
            {text("tagline", "Tagline")}
            <div>
              <label className="label" htmlFor="pf-cat">
                Category
              </label>
              <select id="pf-cat" className="field" value={p.category} onChange={(e) => set("category", e.target.value as Product["category"])}>
                <option value="milk">Milk</option>
                <option value="ghee">Ghee</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="pf-short">
                Short description * <span className="font-normal text-muted">(cards & search snippets)</span>
              </label>
              <textarea id="pf-short" className="field resize-none" rows={2} required minLength={10} value={p.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="pf-desc">
                Full description * <span className="font-normal text-muted">(blank line = new paragraph)</span>
              </label>
              <textarea id="pf-desc" className="field" rows={7} required minLength={20} value={p.description} onChange={(e) => set("description", e.target.value)} />
            </div>
          </div>
        </Section>

        <Section title="Sizes, prices & stock">
          <div className="space-y-3">
            <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.8fr_auto] gap-3 px-1 text-xs font-semibold text-muted uppercase md:grid">
              <span>Size label</span>
              <span>SKU</span>
              <span>Price ₹</span>
              <span>MRP ₹</span>
              <span>Stock</span>
              <span className="w-9" />
            </div>
            {p.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 rounded-2xl border border-border p-3 md:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.8fr_auto] md:border-0 md:p-0">
                <input className="field" placeholder="1 Litre" required value={v.label} onChange={(e) => setVariant(i, { label: e.target.value })} aria-label="Size label" />
                <input className="field" placeholder="KV-MILK-1000" required value={v.sku} onChange={(e) => setVariant(i, { sku: e.target.value.toUpperCase() })} aria-label="SKU" />
                <input className="field" type="number" min={0} required value={v.price} onChange={(e) => setVariant(i, { price: +e.target.value })} aria-label="Price" />
                <input className="field" type="number" min={0} required value={v.mrp} onChange={(e) => setVariant(i, { mrp: +e.target.value })} aria-label="MRP" />
                <input className="field" type="number" min={0} required value={v.stock} onChange={(e) => setVariant(i, { stock: +e.target.value })} aria-label="Stock" />
                <button
                  type="button"
                  disabled={p.variants.length === 1}
                  onClick={() => set("variants", p.variants.filter((_, j) => j !== i))}
                  className="grid size-11 place-items-center rounded-xl text-muted hover:bg-red-500/10 hover:text-red-500 disabled:opacity-30"
                  aria-label="Remove size"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={() => set("variants", [...p.variants, { sku: "", label: "", price: 0, mrp: 0, stock: 0 }])}>
              <Plus className="size-4" /> Add size
            </Button>
          </div>
        </Section>

        <Section title="Images">
          <p className="mb-4 text-sm text-muted">
            Use a path inside the site (e.g. <code>/images/my-photo.jpg</code> placed in <code>frontend/public/images</code>) or any
            https image URL. The first image is the main one.
          </p>
          <div className="flex flex-wrap gap-3">
            {p.images.map((src, i) => (
              <div key={src + i} className="group relative aspect-[4/5] w-28 overflow-hidden rounded-2xl border border-border bg-surface-2">
                <Image src={src} alt="" fill sizes="112px" className="object-cover" />
                <div className="absolute inset-x-1 bottom-1 flex justify-center gap-1 opacity-0 transition group-hover:opacity-100">
                  {[
                    { Icon: ArrowUp, label: "Move first", fn: () => set("images", [src, ...p.images.filter((_, j) => j !== i)]), hide: i === 0 },
                    { Icon: ArrowDown, label: "Move later", fn: () => { const a = [...p.images]; [a[i], a[i + 1]] = [a[i + 1], a[i]]; set("images", a); }, hide: i === p.images.length - 1 },
                    { Icon: Trash2, label: "Remove", fn: () => set("images", p.images.filter((_, j) => j !== i)) },
                  ]
                    .filter((b) => !b.hide)
                    .map(({ Icon, label, fn }) => (
                      <button key={label} type="button" onClick={fn} aria-label={label} className="grid size-7 place-items-center rounded-full bg-background/90 text-heading">
                        <Icon className="size-3.5" />
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input className="field" placeholder="/images/new-photo.jpg or https://…" value={newImage} onChange={(e) => setNewImage(e.target.value)} />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const v = newImage.trim();
                if (!v.startsWith("/") && !v.startsWith("https://")) return toast.error("Use a /path or an https:// URL");
                set("images", [...p.images, v]);
                setNewImage("");
              }}
            >
              Add
            </Button>
          </div>
        </Section>

        <Section title="Highlights & care">
          <ListEditor label="Highlights (bullet points)" items={p.highlights} onChange={(v) => set("highlights", v)} placeholder="e.g. No preservatives" />
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {text("storage", "Storage")}
            {text("shelfLife", "Shelf life")}
            {text("usage", "How to use")}
          </div>
        </Section>

        <Section title="Product FAQs">
          <div className="space-y-3">
            {p.faqs.map((f, i) => (
              <div key={i} className="grid gap-2 rounded-2xl border border-border p-3">
                <input className="field" placeholder="Question" value={f.question} onChange={(e) => set("faqs", p.faqs.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))} />
                <textarea className="field resize-none" rows={2} placeholder="Answer" value={f.answer} onChange={(e) => set("faqs", p.faqs.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)))} />
                <button type="button" onClick={() => set("faqs", p.faqs.filter((_, j) => j !== i))} className="justify-self-end text-xs text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={() => set("faqs", [...p.faqs, { question: "", answer: "" }])}>
              <Plus className="size-4" /> Add FAQ
            </Button>
          </div>
        </Section>
      </div>

      <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <Section title="Visibility">
          <Toggle label="Live on store" checked={p.isActive} onChange={(v) => set("isActive", v)} />
          <Toggle label="Featured" checked={p.featured} onChange={(v) => set("featured", v)} />
          <div className="mt-4">
            <label className="label" htmlFor="pf-sort">
              Sort order <span className="font-normal text-muted">(lower shows first)</span>
            </label>
            <input id="pf-sort" type="number" className="field" value={p.sortOrder} onChange={(e) => set("sortOrder", +e.target.value)} />
          </div>
        </Section>

        <Section title="Reviews">
          <p className="mb-3 text-xs text-muted">Only enter real review numbers — they appear in Google results.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="pf-rating">
                Avg rating
              </label>
              <input id="pf-rating" type="number" step="0.1" min={0} max={5} className="field" value={p.rating} onChange={(e) => set("rating", +e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="pf-rc">
                Review count
              </label>
              <input id="pf-rc" type="number" min={0} className="field" value={p.reviewCount} onChange={(e) => set("reviewCount", +e.target.value)} />
            </div>
          </div>
        </Section>

        <Section title="SEO">
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="pf-seot">
                Meta title <span className="font-normal text-muted">({(p.seo?.title || "").length}/60)</span>
              </label>
              <input id="pf-seot" className="field" value={p.seo?.title || ""} onChange={(e) => set("seo", { ...p.seo, title: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="pf-seod">
                Meta description <span className="font-normal text-muted">({(p.seo?.description || "").length}/160)</span>
              </label>
              <textarea id="pf-seod" rows={3} className="field resize-none" value={p.seo?.description || ""} onChange={(e) => set("seo", { ...p.seo, description: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="pf-seok">
                Keywords <span className="font-normal text-muted">(comma separated)</span>
              </label>
              <input
                id="pf-seok"
                className="field"
                value={(p.seo?.keywords || []).join(", ")}
                onChange={(e) => set("seo", { ...p.seo, keywords: e.target.value.split(",").map((k) => k.trim()) })}
              />
            </div>
          </div>
        </Section>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={saving} className="flex-1">
            {isEdit ? "Save changes" : "Create product"}
          </Button>
          {isEdit && (
            <Button type="button" variant="danger" loading={deleting} onClick={remove}>
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="mb-5 font-sans text-base font-semibold text-heading">{title}</h2>
      {children}
    </section>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-2">
      <span>
        <span className="block text-sm font-medium text-heading">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-leaf" : "bg-border"}`}
      >
        <span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </label>
  );
}

export function ListEditor({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div>
      <p className="label">{label}</p>
      <div className="space-y-2">
        {items.map((h, i) => (
          <div key={i} className="flex gap-2">
            <input className="field" value={h} placeholder={placeholder} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-red-500/10 hover:text-red-500" aria-label="Remove">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={() => onChange([...items, ""])}>
          <Plus className="size-4" /> Add
        </Button>
      </div>
    </div>
  );
}
