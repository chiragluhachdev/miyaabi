# Miyaabi Migration — Corrected Plan (Express/Render → Next.js/Vercel)

> This refines the original plan against the **actual code** in `backend/` and `frontend/`.
> Verdict: the original plan is directionally right, but it contains several factual
> errors and omits three serverless/edge gotchas that would break the migration if
> followed literally. Corrections and a revised **incremental** plan are below.

---

## 0. What does NOT need to change (de-risking)

- **No data migration.** Data already lives in MongoDB Atlas. The new Next.js app
  points at the *same* `MONGODB_URI`. Code moves; data stays. The original plan's
  "Week-by-week data" framing implies a data move — there is none.
- **Image config is already done.** `frontend/next.config.ts` already allows all
  remote image hosts (Cloudinary included). No change needed there.
- **Static fallback already exists.** `frontend/src/lib/api.ts` falls back to
  `src/data/*` when the API is unreachable. This is our safety net during the
  incremental cutover — keep it until the very end.
- **Models, business logic, validation, sort maps, COD math** all port over almost
  verbatim. The risk is in the *plumbing* (Express middleware, multer, JWT location,
  caching), not the domain logic.

---

## 1. Corrections to the original plan (plan said → reality)

| # | Plan claimed | Reality in this codebase | Action |
|---|---|---|---|
| 1 | "Cloudinary integration remains unchanged" (upload) | Upload uses **multer** (`upload.array("images",6)`) which is Express-only middleware. It does **not** work in Next route handlers. | Rewrite upload to `await req.formData()` → `File.arrayBuffer()` → Buffer → existing `uploadBufferToCloudinary`. Drop multer entirely. |
| 2 | Env list: `CLOUDINARY_NAME` | Backend uses **`CLOUDINARY_CLOUD_NAME`** (+ `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`). Also `JWT_EXPIRES_IN` exists. | Use the real names in Vercel. |
| 3 | "Convert models to TypeScript" (no caveat) | `mongoose.model("X", schema)` throws **`OverwriteModelError`** on hot-reload / repeated serverless import. | Every model must use `mongoose.models.X ?? mongoose.model("X", schema)`. |
| 4 | `lib/db.ts` = "connection pooling / singleton" | In serverless, a plain `connectDB()` opens a new connection per invocation and exhausts Atlas. | Use the **global cached-promise** pattern (`global._mongoose = { conn, promise }`). |
| 5 | "middleware.ts → JWT verification" | `jsonwebtoken` relies on Node `crypto` and **cannot run in the Edge middleware runtime**. | Verify JWT in middleware with **`jose`** (Web Crypto), or set middleware to the Node runtime. Keep `jsonwebtoken` only inside route handlers. |
| 6 | "Caching: replace `no-store` with `revalidateTag('products')`" | `revalidateTag` only invalidates **`fetch()`-tagged** caches. If RSCs read Mongo **directly** (recommended — no self-HTTP hop), there is no tagged fetch to invalidate. | Wrap data-access in **`unstable_cache(fn, keys, { tags })`**, then `revalidateTag` works. Or use `revalidatePath`. |
| 7 | "Security improvements" (cookies, no CORS) | True, but the migration **silently drops** `express-rate-limit`, `helmet`, `morgan`, and `express-async-handler`. | Re-add: security headers via `next.config`/middleware; a small `try/catch` error helper to replace `express-async-handler` + `errorHandler`; rate-limit `login` / `partner/access` / `orders` (Upstash or in-memory) — these are public endpoints. |
| 8 | Storefront fetch paths unchanged | `lib/api.ts` calls bare paths (`/products`). Next route handlers live **only** under `/api/...`. | Either prefix storefront calls with `/api`, or (better) refactor RSC fetchers to call **direct data-access functions** (no HTTP). |

---

## 2. Three gotchas that will bite (expanded)

### G1 — Mongoose model re-registration
Wrap **every** model export:
```ts
export default (mongoose.models.Product as Model<IProduct>) ??
  mongoose.model<IProduct>("Product", productSchema);
```

### G2 — Connection caching for serverless
`lib/db.ts` must reuse one connection across invocations:
```ts
const cached = (global as any)._mongoose ??= { conn: null, promise: null };
export async function dbConnect() {
  if (cached.conn) return cached.conn;
  cached.promise ??= mongoose.connect(process.env.MONGODB_URI!, {
    serverSelectionTimeoutMS: 10000, bufferCommands: false,
  });
  cached.conn = await cached.promise;
  return cached.conn;
}
```

### G3 — Upload body limit + multer removal
- Multer is gone (see correction #1). Read files from `req.formData()`.
- **Vercel serverless request bodies cap at ~4.5 MB**; the backend allowed 8 MB.
  Either accept the smaller cap, or do **client-side signed direct-to-Cloudinary
  uploads** (recommended for large product photos — bytes never touch the function).
  Decide this before touching `ImageUploader.tsx` / `adminApi.uploadImages`.

---

## 3. Exact endpoint inventory (from the real route files)

Auth required = currently behind `protect`. All become `app/api/...`.

| Method | Current path | Auth | New file |
|---|---|---|---|
| GET | `/products` | public | `api/products/route.ts` |
| POST | `/products` | admin | `api/products/route.ts` |
| GET | `/products/:handle` | public | `api/products/[handle]/route.ts` |
| GET | `/products/:handle/related` | public | `api/products/[handle]/related/route.ts` |
| PUT/DELETE | `/products/:id` | admin | `api/products/[id]/route.ts`* |
| GET | `/collections` (`?withCounts`) | public | `api/collections/route.ts` |
| GET | `/collections/all` | admin | `api/collections/all/route.ts` |
| POST | `/collections` | admin | `api/collections/route.ts` |
| GET | `/collections/:handle` | public | `api/collections/[handle]/route.ts` |
| PUT/DELETE | `/collections/:id` | admin | `api/collections/[id]/route.ts`* |
| GET | `/banners` (`?all`) | public | `api/banners/route.ts` |
| POST | `/banners` | admin | `api/banners/route.ts` |
| PUT/DELETE | `/banners/:id` | admin | `api/banners/[id]/route.ts` |
| POST | `/orders` | public | `api/orders/route.ts` |
| GET | `/orders` | admin | `api/orders/route.ts` |
| GET | `/orders/:id` | public | `api/orders/[id]/route.ts` |
| PUT | `/orders/:id` | admin | `api/orders/[id]/route.ts` |
| GET | `/settings` | public (strips `partner`) | `api/settings/route.ts` |
| PUT | `/settings` | admin | `api/settings/route.ts` |
| POST | `/partner/access` | public | `api/partner/access/route.ts` |
| GET/PUT | `/partner` | admin | `api/partner/route.ts` |
| POST/DELETE | `/upload` | admin | `api/upload/route.ts` |
| POST | `/auth/login` | public | `api/auth/login/route.ts` |
| GET | `/auth/me` | admin | `api/auth/me/route.ts` |

\* **Param collision risk:** products/collections mix `:handle` (GET) and `:id`
(PUT/DELETE) at the same level. Next can't have both `[handle]` and `[id]` as
siblings. Resolve by routing PUT/DELETE through `[handle]` and looking up by id
*inside* the handler, or by nesting writes under a distinct segment. **Decide
before scaffolding products** — this is the one structural snag.

---

## 4. Auth migration surface (localStorage JWT → httpOnly cookie)

Files that change: `lib/adminApi.ts` (drop `getToken/setToken/clearToken` + the
`Authorization` header; rely on same-origin cookie), `context/AdminAuthContext.tsx`
(login no longer stores a token; `/auth/me` reads cookie), `api/auth/login`
(sets `httpOnly`, `Secure`, `SameSite=Lax` cookie), `api/auth/logout` (**new** —
clears cookie; the original plan lists `/auth/logout` but the backend has no such
endpoint today), and `middleware.ts` (guards `/admin`, `/api/products` writes,
`/api/upload`, etc. using `jose`). The 13 client admin pages keep using
`adminFetch` — its signature stays, only its internals change.

---

## 5. Revised incremental plan (each step ends GREEN + verified)

> Verification per the project rule: **no headless screenshots**. Verify with
> `next build` + `curl` against `next dev`. Keep Express + static fallback alive
> until Step 7.

1. **Scaffold server core.** `lib/db.ts` (G2), `lib/cloudinary.ts`, `lib/auth.ts`,
   `lib/api-helpers.ts` (error wrapper replacing `express-async-handler`). Port 6
   models to TS with the G1 guard. *Verify:* `next build`.
2. **Public reads first** (lowest risk — static fallback covers them): products,
   collections, banners, settings GET handlers under `/api`. Point `lib/api.ts`
   base at `/api`. *Verify:* `curl` each vs the live Render responses; `next build`.
3. **Refactor storefront RSC to direct data-access** (remove the self-HTTP hop) and
   add `unstable_cache(..., { tags })` (correction #6). *Verify:* storefront renders
   from DB with Express stopped.
4. **Admin writes + auth.** Login/me/logout with cookies, then products/collections/
   banners/settings/orders/partner write handlers + `middleware.ts` (G1/G5). Refactor
   `adminApi`/`AdminAuthContext`. *Verify:* full admin CRUD round-trip locally.
5. **Upload.** Rewrite without multer (G3); decide direct-to-Cloudinary vs function
   proxy. *Verify:* upload an image end-to-end.
6. **Orders + partner gate.** COD create/track + passcode verify. Re-add rate limiting
   on `login`/`orders`/`partner/access` (correction #7). *Verify:* place + track order.
7. **Cutover.** `revalidateTag` calls inside admin mutations; security headers; set
   Vercel function region near Atlas; deploy single app; delete `backend/`, Render
   service, and `NEXT_PUBLIC_API_URL`. *Verify:* prod smoke (`curl` key routes).

---

## 6. Decisions

**Locked:**
1. **Upload = client-side signed direct-to-Cloudinary.** A small `api/upload/sign`
   route returns a Cloudinary signature; the browser uploads straight to Cloudinary
   (bytes never hit the function → no 4.5 MB cap). `ImageUploader.tsx` and
   `adminApi.uploadImages` are rewritten to sign-then-upload. A DELETE-by-publicId
   route still proxies through the function (tiny body, fine).
2. **Writes stay id-based via a distinct segment** (e.g. `api/products/id/[id]`,
   `api/collections/id/[id]`) so the admin client keeps PUT/DELETE by `_id`
   unchanged. Reads remain `api/products/[handle]`. No `[handle]`/`[id]` sibling
   collision; zero admin-client change for writes.

3. **Rate limiting = Upstash Redis.** `lib/rateLimit.ts` wraps `@upstash/ratelimit`
   (sliding window): login 10/min, partner-access 10/min, order-create 20/min,
   keyed by client IP. Fail-open if `UPSTASH_*` env vars are absent. Verified: 11th
   rapid login → 429.
4. **Middleware runtime = `jose` in Edge.** `src/middleware.ts` verifies the cookie
   with jose and redirects `/admin/*` → `/admin/login`. (Next 16 emits a
   "middleware → proxy" deprecation warning; the file still works on 16.2.9. Rename
   to `proxy.ts` is a future cleanup — left as-is to avoid silently breaking the guard.)

---

## 7. Migration status (implemented)

Steps 1–7 of §5 are done and verified locally (`next build` green + curl, Express
stopped, per the no-screenshot rule). **The app no longer references Express.**

- **Server core:** `lib/db.ts` (cached conn), `lib/auth.ts` (jose), `lib/cloudinary.ts`
  (signed upload), `lib/api-helpers.ts` (`route()`/`requireAdmin()`), 6 TS models.
- **Data layers:** `lib/queries.ts` (raw), `lib/cache.ts` (`unstable_cache` + tags),
  `lib/api.ts` (server-only RSC layer), `lib/normalize.ts` + `lib/clientApi.ts` (client).
- **API:** full `/api/*` for products, collections, banners, settings, partner,
  orders, auth, upload/sign. Writes are id-based under `…/id/[id]`.
- **Auth:** httpOnly cookie + edge middleware; localStorage/Bearer removed.
- **Uploads:** client-side signed direct-to-Cloudinary (multer gone).
- **Caching:** public reads cached, admin mutations `revalidateTag(...)`. Note: Next
  16's `revalidateTag(tag, "max")` is **stale-while-revalidate** — the first read
  after a change is stale, the next is fresh (verified). Fine for the storefront;
  admin "read-your-own-write" can be stale for one read.
- **Security:** helmet-equivalent headers in `next.config.ts`; Upstash rate limiting.

## 8. Cutover checklist (remaining — needs the user)

These are dashboard/ops actions I can't do from here:

1. **Vercel env vars** (Project → Settings → Environment Variables): `MONGODB_URI`,
   `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
   `NEXT_PUBLIC_API_URL` is no longer used — remove it.
2. **Set the Vercel project root** to `frontend/` (or move the app to repo root).
3. **Vercel function region** near the Atlas region to cut latency.
4. Deploy, smoke-test prod (`curl` key routes), then **delete the Render service**
   and remove `backend/` from the repo.
