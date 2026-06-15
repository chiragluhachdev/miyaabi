# mi-या-bi (miyaabi) — Project Summary

A full-stack, production-deployed **clothing-brand e-commerce platform** with three surfaces:
a customer **storefront**, an admin **CMS/dashboard**, and a passcode-gated **partner portal**.
Everything customers see is editable from the admin — nothing is hard-coded.

---

## 1. Live URLs

| Surface | URL |
|---|---|
| Storefront (customer) | https://miyaabi.vercel.app |
| Admin panel | https://miyaabi.vercel.app/admin |
| Partner portal | https://miyaabi.vercel.app/partner |
| Backend API | https://miyaabi.onrender.com |

## 2. Access / credentials

| Thing | Value |
|---|---|
| Admin login | `admin@miyaabi.com` / `miyaabi@admin123` |
| Partner passcode | `miyaabi2026` |

> Change the admin password in the DB (or via a future screen) and the partner passcode in
> **Admin → Partner Portal**. Image uploads need Cloudinary keys; everything else runs without them.

---

## 3. Architecture

Monorepo with two independently deployed apps:

```
Miyaabi/
  frontend/   Next.js (App Router, TS, Tailwind v4) — storefront + /admin + /partner   → Vercel
  backend/    Node + Express + Mongoose — REST API                                       → Render
  render.yaml (optional Render blueprint — unused; can be deleted)
  README.md / Summary.md
```

- **Frontend → Backend** via `NEXT_PUBLIC_API_URL` (set to `https://miyaabi.onrender.com`).
  The backend serves routes at the **root** (and also under `/api`).
- **Auth:** admin uses **JWT Bearer tokens** (no cookies). CORS allows all origins (safe with token auth).
- **Data source of truth:** MongoDB Atlas. The frontend falls back to built-in default content if the
  API is unreachable, so it never hard-crashes.

### Tech stack
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, `next/image`.
  Fonts: Public Sans (body), Archivo (display headings), Mukta (the `mi-या-bi` dual-script wordmark).
- **Backend:** Express, Mongoose (MongoDB Atlas), JWT (`jsonwebtoken`), `bcryptjs`, Cloudinary
  (image uploads), Multer, Helmet, CORS, morgan, express-rate-limit.

---

## 4. Storefront (customer)

- **Homepage** — fully admin-composed sections rendered in order: rotating **hero banners**
  (2s interval), **feature/trust strip**, and any number of: product rows (Trending / Best-selling /
  Newest / by collection / hand-picked), category-tile grids & carousels, and promo banners.
  Scroll-reveal animations cascade products/tiles into view.
- **Collections** — `/collections` index + `/collections/[handle]` with live filters (availability,
  price, size, color) and all sort options.
- **Product detail** — `/products/[handle]`: image gallery, size/color selectors, qty, add-to-cart,
  description accordion, related products.
- **Cart** — slide-in drawer (client-side; no real payment gateway).
- **Chrome** — announcement bar, header (logo + nav built from live collections + live product
  search), footer (links/social/payments), floating **WhatsApp** button (number/message admin-set).
- **Info pages** — `/pages/{bulk-enquiry,contact,track-order,faq}` and
  `/policies/{shipping,refund,terms,privacy}`, plus `/account` and `/wishlist` placeholders
  (added to fix nav/footer 404s).
- **Branding** — wordmark logo `mi-या-bi`; red (#e11b22) + ink/black palette. (Gujarat Titans
  references were removed in favor of the generic miyaabi brand.)

## 5. Admin panel (`/admin`, JWT-protected)

Manage everything customers see:
- **Dashboard** — counts + quick actions.
- **Homepage Builder** — add/reorder/toggle/delete every home section; pick product source or
  hand-pick products; edit tiles, promos, etc.
- **Products** — full CRUD: title, description, price/compare-at, sizes, colors, stock, badge,
  collections, images (Cloudinary upload **or paste any image URL**).
- **Collections**, **Hero Banners**, **Orders**, **Site Settings** (brand, logo, announcement bar,
  WhatsApp, footer tagline), and **Partner Portal**.

## 6. Partner portal (`/partner`, passcode-gated)

A B2B factory showcase shared with business partners:
- **Soft gate** — partners enter a shared passcode; verified server-side (code never exposed via
  the public `/settings` endpoint), unlock persists across refreshes.
- **Content (admin-editable):** hero, intro, **Manufacturing Process** (ordered steps with images),
  **Factory Gallery** (image grid), and a **Video walkthrough** (YouTube/Vimeo embed).
- Has its own minimal layout (no shop chrome) and is set to `noindex`.

---

## 7. Backend API (base: `https://miyaabi.onrender.com`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health`, `/api/health` | public | health check |
| POST | `/auth/login` · GET `/auth/me` | public · admin | admin auth |
| GET | `/products` (filters/sort/search/handles) · `/products/:handle` · `/products/:handle/related` | public | catalog |
| POST/PUT/DELETE | `/products` · `/products/:id` | admin | manage products |
| GET | `/collections` · `/collections/:handle` · `/collections/all` | public/admin | collections |
| POST/PUT/DELETE | `/collections...` | admin | manage collections |
| GET/POST/PUT/DELETE | `/banners...` | public/admin | hero banners |
| GET/PUT | `/settings` | public/admin | site settings (partner stripped from public) |
| POST/DELETE | `/upload` | admin | Cloudinary image upload/delete |
| POST/GET/PUT | `/orders` | public/admin | order capture + management |
| POST | `/partner/access` | public | verify partner passcode → gated content |
| GET/PUT | `/partner` | admin | edit partner content |

### Data models (Mongoose)
- **Admin** (email, bcrypt password hash, role)
- **Product** (handle, title, price, compareAtPrice, images[], sizes[], colors[], collections[],
  available, badge, popularity, featured)
- **Collection** (handle, title, group, bannerImage, order)
- **Banner** (image, eyebrow, title, cta, href, order, active)
- **Order** (items[], customer, totals, status)
- **SiteSettings** (singleton: brand, announcement messages, WhatsApp, feature strip, footer,
  `homeSections[]`, and gated `partner{}`)

### Seed (`npm run seed`)
Idempotent. Loads the admin user + a **professional generic catalog**: 26 products across 6 sports
and 11 categories, 21 collections, 3 hero banners, 7 homepage sections, and the partner showcase
(6 process steps + gallery). Product/banner images use hosted photo URLs (swap in admin anytime).

---

## 8. Environment variables

**Backend (`backend/.env`)** — set in Render dashboard for prod:
```
PORT=5007            (Render injects its own PORT in prod)
MONGODB_URI=...      (MongoDB Atlas)
JWT_SECRET=...       (long random string)
CLOUDINARY_CLOUD_NAME / _API_KEY / _API_SECRET   (optional — only for uploads)
ADMIN_EMAIL / ADMIN_PASSWORD                     (seeded admin)
CLIENT_URL           (optional; CORS allows all anyway)
```
A helper `backend/scripts/sync-env.mjs` copies real values from `.env.example` into `.env` without
printing secrets.

**Frontend (Vercel env / `frontend/.env.local`):**
```
NEXT_PUBLIC_API_URL=https://miyaabi.onrender.com    (no /api needed; inlined at build time)
```

---

## 9. Run locally

```bash
# backend
cd backend && npm install && npm run seed && npm run dev   # http://localhost:5007

# frontend (separate terminal)
cd frontend && npm install && npm run dev                  # http://localhost:3000
```

## 10. Deploy

- Push to `main` → **Vercel** auto-deploys the frontend, **Render** auto-deploys the backend.
- `NEXT_PUBLIC_API_URL` is inlined at **build time** — change it ⇒ trigger a rebuild.
- Render free tier sleeps when idle ⇒ first request after inactivity has a ~30–50s cold start.

---

## 11. Notable decisions & history (high level)

1. Started as a static Next.js storefront styled after a reference site; rebranded to the user's own
   **mi-या-bi** brand (logo + dual-script wordmark, red/black palette).
2. Polished UI/UX: display typography, promo band, scroll-reveal animations, WhatsApp button.
3. Converted to **full-stack**: moved the app into `frontend/`, added the `backend/` API, and made
   the storefront fetch live content. Added the **admin CMS** so everything is editable.
4. Made the **homepage fully composable** from the admin; removed hard-coded sections.
5. Seeded a **professional, generic catalog** with real apparel/photo URLs.
6. Deployed: **backend → Render**, **frontend → Vercel**; fixed monorepo build, root-path routing,
   and CORS (allow-all for the token-auth API).
7. Added info/policy/account/wishlist pages to clear nav 404s.
8. Added the passcode-gated **/partner** factory showcase (admin-editable).

## 12. Out of scope (future)
- Real payment gateway / checkout (orders are captured, not charged).
- Customer accounts & wishlist persistence.
- Admin password-change screen (currently change in DB / via seed).
- Partner enquiry form & capabilities table (intentionally deferred).
