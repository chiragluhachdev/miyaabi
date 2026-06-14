# mi-या-bi — full-stack storefront

A professional clothing-brand store with a customer storefront and a fully
admin-controlled CMS.

```
Miyaabi/
  frontend/   Next.js storefront + /admin dashboard
  backend/    Express + MongoDB Atlas + Cloudinary API
```

- **Storefront:** Next.js (App Router), Tailwind. Everything customers see — hero
  banners, homepage sections, products, collections, announcement bar, footer,
  WhatsApp button — is fetched live from the API.
- **Admin (`/admin`):** JWT-protected dashboard to manage products (images,
  pricing, sizes, colors, stock, collections), collections, hero banners, the
  **Homepage Builder**, orders, and global site settings.
- **Backend:** REST API with Mongoose models, Cloudinary image uploads, seed script.

---

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # then fill in values (see below)
node scripts/sync-env.mjs   # optional: pulls real values from .env.example into .env
npm run seed                # loads the professional catalog + admin user
npm run dev                 # http://localhost:5007
```

### `backend/.env`

| Key | Required | Notes |
| --- | --- | --- |
| `PORT` | yes | `5007` (must match the frontend `NEXT_PUBLIC_API_URL`) |
| `MONGODB_URI` | yes | MongoDB Atlas connection string |
| `JWT_SECRET` | yes | any long random string (a generated one is already in `.env`) |
| `CLIENT_URL` | yes | `http://localhost:3000` (CORS) |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | optional | only needed for **image uploads**; you can also paste image URLs in admin |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | yes | seeded admin login (default `admin@miyaabi.com` / `miyaabi@admin123`) |

> Secrets go in `.env` (gitignored), **not** `.env.example`. `npm run seed` is
> idempotent — re-run it any time to reset the catalog.

## 2. Frontend

```bash
cd frontend
npm install
# .env.local already has: NEXT_PUBLIC_API_URL=http://localhost:5007/api
npm run dev                 # http://localhost:3000
```

- Storefront: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>  (log in with the seeded admin)

---

## Admin capabilities

- **Homepage Builder** (`/admin/homepage`) — add / reorder / toggle / delete the
  exact sections customers see: product rows (Trending, Best selling, Newest,
  by collection, or hand-picked products), category tile grids/carousels, and
  promo banners.
- **Products** — full CRUD: title, description, price, compare-at, sizes, colors,
  stock, badge, collections, and images (upload to Cloudinary **or paste a URL**).
- **Collections**, **Hero Banners**, **Orders**, and **Site Settings**
  (brand, logo, announcement bar, WhatsApp number/message, footer tagline).

## Notes

- Seed images use hosted photo URLs so the store looks complete immediately;
  replace any image from the admin (upload or paste URL).
- No real payment gateway — orders are captured to the DB (checkout/payments can
  be added later).
- If the API is unreachable, the storefront falls back to built-in default
  content so it never hard-crashes.
