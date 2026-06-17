# Miyaabi (mi-या-bi) — Project Summary

A full-stack clothing-brand store: **customer storefront + admin CMS + passcode-gated
B2B partner portal**, all in **one Next.js 16 app** (App Router, TypeScript, Tailwind v4)
backed by **MongoDB Atlas + Cloudinary**, deployed to **Vercel**.

The app lives at the **repo root** (`src/`, `public/`, `package.json`). Brand is
**mi-या-bi**, layout modelled on t10sports.com.

---

## 1. History (how we got here)

- Started as a Next.js storefront replica with static data.
- Grew a real backend: a separate **Express API on Render** + MongoDB Atlas + Cloudinary
  (products, collections, banners, orders, admin auth, partner portal, COD checkout).
- **Migrated** the Express backend into the Next.js app (route handlers + direct DB
  access) → single deployment on Vercel. Express/`backend/` removed.
- **Flattened** the app from `frontend/` to the repo root.
- Added order tracking; fixed the order-confirmation crash.

---

## 2. Architecture

```
Browser
  → Next.js (Vercel)
      • Storefront (RSC) reads MongoDB directly via the cached data layer
      • /api/* route handlers (admin writes, orders, auth, partner, upload-sign)
      • src/proxy.ts (edge guard for /admin)
  → MongoDB Atlas   (data)
  → Cloudinary      (images; signed direct-from-browser uploads)
  → Upstash Redis   (rate limiting)
```

No Express, no CORS, no cross-origin API. Storefront falls back to static
`src/data/*` content if the DB is unreachable.

---

## 3. Directory map (key paths under `src/`)

```
app/
  (storefront)/        home, collections, products, checkout, wishlist,
                       order-confirmation/[id], track, pages/[slug], policies/[slug]
  admin/               cookie-protected dashboard (products, collections, banners,
                       homepage builder, orders, partner, settings, login)
  partner/             passcode-gated B2B showcase
  api/                 products, collections, banners, settings, partner, orders,
                       auth (login/me/logout), upload/sign
components/            storefront + admin/* + partner/* UI; OrderTracker, TrackingId
context/               StoreContext (cart/wishlist), AdminAuthContext (cookie auth)
lib/                   db, auth, cloudinary, api-helpers, queries, cache, api,
                       clientApi, normalize, rateLimit, orders, format, nav, …
models/                Admin, Product, Collection, Banner, Order, SiteSettings (TS)
proxy.ts               /admin guard (Next 16 proxy convention)
data/                  static fallback catalog (products.ts, collections.ts, …)
scripts/               gen-images.mjs, set-admin-password.mjs
```

---

## 4. Data layers (the important design)

| Module | Runtime | Role |
|---|---|---|
| `lib/db.ts` | server | Serverless-cached Mongoose connection (global promise, `bufferCommands:false`) |
| `lib/queries.ts` | server-only | Raw Mongo reads (mirror old Express controllers) |
| `lib/cache.ts` | server-only | `unstable_cache` wrappers + tags (`products`/`collections`/`banners`/`settings`) + `revalidate()` |
| `lib/api.ts` | **server-only** | Storefront RSC data layer — calls cached readers, normalizes, static fallback |
| `lib/normalize.ts` | client-safe | Pure normalizers + `DEFAULT_*` + order types |
| `lib/clientApi.ts` | client | Browser fetches to `/api` (search, wishlist, placeOrder, partner access, order lookup) |

Models use the `mongoose.models.X ?? mongoose.model(...)` overwrite guard (serverless-safe).

---

## 5. API routes (`/api`)

- **Products:** `GET/POST /products`, `GET /products/[handle]`, `GET /products/[handle]/related`, `PUT/DELETE /products/id/[id]`
- **Collections:** `GET/POST /collections`, `GET /collections/all` (admin), `GET /collections/[handle]`, `PUT/DELETE /collections/id/[id]`
- **Banners:** `GET/POST /banners` (`?all=true` admin), `PUT/DELETE /banners/id/[id]`
- **Settings:** `GET` (public, strips `partner`) / `PUT` (admin)
- **Partner:** `POST /partner/access` (public passcode), `GET/PUT /partner` (admin)
- **Orders:** `POST /orders` (public COD), `GET /orders` (admin), `GET /orders/[id]` (public track), `PUT /orders/[id]` (admin)
- **Auth:** `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- **Upload:** `GET /upload/sign` (admin) → Cloudinary signature

Writes are **id-based under `…/id/[id]`** so reads (`[handle]`) and writes don't collide.
Every admin route calls `requireAdmin()`.

---

## 6. Cross-cutting features

- **Auth:** httpOnly `miyaabi_admin` cookie, signed/verified with **`jose`** (Edge+Node safe).
  `src/proxy.ts` redirects unauthenticated `/admin/*` → `/admin/login`.
- **Caching:** public reads cached; admin mutations call `revalidateTag`. Note: Next 16's
  `revalidateTag(tag,"max")` is **stale-while-revalidate** — first read after a change is
  stale, next is fresh.
- **Uploads:** client-side **signed direct-to-Cloudinary** (no multer, no 4.5 MB function cap).
- **Rate limiting:** **Upstash** on `login` (10/min), `partner-access` (10/min),
  `order-create` (20/min); fail-open if `UPSTASH_*` unset.
- **Security headers:** helmet-equivalent set in `next.config.ts`.
- **Order tracking (no customer login):** orders placed on a device are saved to
  `localStorage` (`lib/orders.ts`); **`/track`** page lists them + looks up any order by ID
  via `GET /api/orders/:id`. Confirmation page shows a copyable Tracking ID. Header has a
  **Track Order** link (the old `/account` page was removed).
- **Partner portal:** `/partner`, passcode **`miyaabi2026`** (editable in `/admin` → Partner;
  never exposed by `/api/settings`).

---

## 7. Environment variables

`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN` (`7d`), `CLOUDINARY_CLOUD_NAME`,
`CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `UPSTASH_REDIS_REST_URL`,
`UPSTASH_REDIS_REST_TOKEN`. Local in `.env` / `.env.local` (gitignored); set the same in
Vercel. `.env.example` documents them. (`NODE_ENV` is set by Vercel.)

---

## 8. Scripts & seeding

- `scripts/set-admin-password.mjs '<pw>'` — bcrypt-hash + upsert the admin login (the app
  has no admin-password UI).
- `scripts/gen-images.mjs` — regenerate placeholder SVGs.
- **No seed script exists.** The old `backend/src/seed.js` + `seedData.js` were deleted with
  `backend/` and purged from git history during the secret scrub. The catalog still lives in
  the live Atlas DB and in static fallback `src/data/products.ts` + `collections.ts`. A new
  `scripts/seed.mjs` can be written from `src/data/*` if a fresh DB ever needs seeding.

---

## 9. Status & remaining go-live steps

**Done:** migration, flatten, history scrub, order tracking, confirmation fix — all on
`main`, pushed to GitHub, builds green.

**Outstanding (operational, user/dashboard):**
1. **Rotate the leaked secrets** — Atlas DB password, `JWT_SECRET`, Cloudinary API secret,
   admin password. They were committed in the old public `backend/.env`; history scrub
   reduces future exposure but rotation is the real fix.
2. **Set the (rotated) env vars in Vercel** (Production) and **redeploy** — currently the
   deployed app shows *"MONGODB_URI is not set"* on admin login because Vercel has no env vars.
3. Confirm Vercel **Root Directory = `./`** (no longer `frontend`).
4. Smoke-test: storefront, admin login (new password via the script), place + track an order.

---

## 10. Conventions

- **Verify with `npm run build` + `curl` against `next start`** — never headless screenshots.
- **Dev (Turbopack) is lenient on TypeScript; `next build` is the real gate** (Mongoose lean
  docs need `as unknown as` / JSON round-trip when typed).
- Repo: `github.com/chiragluhachdev/miyaabi` (public), deploys from `main` to
  `miyaabi.vercel.app`.
