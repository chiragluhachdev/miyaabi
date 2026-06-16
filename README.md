# mi-या-bi — full-stack storefront

A professional clothing-brand store: customer storefront, a cookie-authed admin
CMS, and a passcode-gated B2B partner portal — all in **one Next.js app**
(App Router) backed by MongoDB Atlas + Cloudinary, deployable to Vercel.

```
Miyaabi/
  frontend/   The Next.js app — storefront, /admin, /partner, and /api routes
```

- **Storefront:** hero banners, homepage sections, products, collections,
  announcement bar, footer, WhatsApp button — rendered from the DB (server
  components read MongoDB directly; falls back to built-in content if the DB is
  unreachable).
- **Admin (`/admin`):** cookie-protected dashboard for products, collections,
  hero banners, the Homepage Builder, orders, partner portal, and site settings.
- **API (`/api/*`):** Next.js route handlers with Mongoose models, signed
  direct-to-Cloudinary uploads, and Upstash rate limiting.

> Previously a split Next.js + Express (Render) setup; the Express backend was
> migrated into the Next.js app. See `MIGRATION.md` for the full record.

---

## Run locally

```bash
cd frontend
npm install
cp .env.example .env.local   # then fill in values (see below)
npm run dev                  # http://localhost:3000
```

- Storefront: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>  (default `admin@miyaabi.com` / `miyaabi@admin123`)

### Environment (`frontend/.env.local`, also set in Vercel)

| Key | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | yes | MongoDB Atlas connection string |
| `JWT_SECRET` | yes | long random string (admin auth, signed with jose) |
| `JWT_EXPIRES_IN` | no | default `7d` |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | for uploads | signed browser uploads; you can also paste image URLs in admin |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | no | rate limiting; omit to disable (fail-open) |

---

## Deploy (Vercel)

1. Set the project **Root Directory** to `frontend`.
2. Add the env vars above in Project → Settings → Environment Variables.
3. Push to the production branch — Vercel builds and serves the storefront, admin,
   partner portal, and `/api` from a single deployment.

---

## Admin capabilities

- **Homepage Builder** (`/admin/homepage`) — add / reorder / toggle / delete the
  sections customers see: product rows (Trending, Best selling, Newest, by
  collection, or hand-picked), category tile grids/carousels, and promo banners.
- **Products** — full CRUD: title, description, price, compare-at, sizes, colors,
  stock, badge, collections, images (Cloudinary upload **or** paste a URL).
- **Collections**, **Hero Banners**, **Orders**, **Partner portal**, and
  **Site Settings** (brand, logo, announcement bar, WhatsApp, footer).

## Notes

- No real payment gateway — orders are captured to the DB (COD); checkout/payments
  can be added later.
- If the DB is unreachable, the storefront falls back to built-in default content
  so it never hard-crashes.
