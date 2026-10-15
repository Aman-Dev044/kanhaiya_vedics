# Kanhaiya Vedics — Milk & Ghee Store

E-commerce website for **Kanhaiya Vedics** (raw farm milk & Vedic bilona ghee from desi indigenous cows).

```
backend/    Next.js 15 API only (MongoDB + Mongoose, JWT auth)      → http://localhost:5000
frontend/   Next.js 15 storefront + admin panel (Tailwind 4, Framer Motion, Lenis) → http://localhost:3000
```

## Run locally (no Docker needed)

Requires Node.js 20+ and MongoDB. `backend/.env` currently points to a **local MongoDB**
(`mongodb://127.0.0.1:27017`, database `kanhaiya_vedics`). The Atlas URI is kept commented in the same file —
swap the two lines once the Atlas cluster has free collection slots (it is at the 500-collection limit).

```bash
# 1. Backend
cd backend
npm install
npm run seed        # creates products, site settings and the admin account (safe to re-run)
npm run dev         # http://localhost:5000  (health check: /api/health)

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev         # http://localhost:3000
```

Admin panel: http://localhost:3000/admin — log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env`
(change the password before going live). `npm run seed -- --reset` restores the default product catalogue.

## Production

```bash
cd backend  && npm run build && npm start   # port 5000
cd frontend && npm run build && npm start   # port 3000
```

Set these for production:

| File | Variable | Value |
|---|---|---|
| `backend/.env` | `CORS_ORIGIN` | the live site URL, e.g. `https://kanhaiyavedics.com` |
| `backend/.env` | `JWT_SECRET` | a long random string |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | the live backend URL |
| `frontend/.env.local` | `NEXT_PUBLIC_SITE_URL` | the live site URL (used for canonical URLs, sitemap, Open Graph) |

## What the admin can change (no code needed)

- **Products** — name, slug, sizes, price/MRP, stock, images, highlights, storage/shelf-life, FAQs, SEO, visibility
- **Orders** — search/filter, update order & payment status (cancelling returns stock), call customer
- **Enquiries** — milk-subscription requests, contact messages, newsletter emails
- **Customers** — list, order count & spend, grant/revoke admin
- **Site settings** — brand name/tagline, default theme (light/dark/system), announcement bar, hero text,
  numbers strip, testimonials, homepage FAQs, contact & WhatsApp, social links, delivery fee & free-delivery
  threshold, delivery slots, serviceable pincodes, COD / UPI-on-delivery, default SEO

Saving in the admin refreshes the public pages immediately (on-demand revalidation).

## SEO

Per-page metadata & canonical URLs, Open Graph/Twitter cards, generated OG image, `sitemap.xml`, `robots.txt`,
web manifest, JSON-LD (Organization, WebSite, Product with offers, BreadcrumbList, FAQPage, ItemList),
static generation with 5-minute ISR, optimized AVIF/WebP images, self-hosted fonts.

## Images

Product photos live in `frontend/public/images`. The ghee jar image is a brand-matched placeholder —
replace it with a real photo (drop the file in `public/images` and set its path in Admin → Products).
