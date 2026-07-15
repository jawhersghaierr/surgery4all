# Surgery4all — Design Spec

**Date**: 2026-07-15
**Source**: `design_handoff_surgery4all` (hifi HTML prototype + README)
**Target**: existing Next.js 14 App Router scaffold at repo root

## Goal

Recreate the Surgery4all design (site of Dr Sghaier Jihed — oral surgery & implantology) in the existing codebase, pixel-faithful to the handoff, with a wired backend.

## Locked decisions

- **Backend**: full stack wired (Supabase + jose admin auth + Resend contact email + Cloudinary media).
- **i18n**: French (default) + English only. Drop `de`/`it`/`ar` from `routing.locales`.
- **Design tokens**: adopt handoff palette + fonts exactly (hifi).
- **Scope boundary**: subscriber payment / real premium unlock is OUT (no Stripe dep). Premium content stays locked → click routes to `/pricing`, matching prototype. Real auth = admin only.
- **CRUD approach**: Server Actions + `revalidatePath` (not REST API routes).

## Routes (locale-prefixed, `localePrefix: as-needed`, default `fr`)

| Route | Purpose | Rendering |
|---|---|---|
| `/` | Home: hero, specialties bar, recent cases, docs teaser, testimonials, final CTA | Server (fetch cases + docs) |
| `/cases` | Filter chips + case grid | Server fetch + client filter |
| `/publications` | DocRow list | Server fetch |
| `/blog` | Article grid | Server fetch |
| `/pricing` | Monthly/annual toggle + 3 plans | Client (billing state) |
| `/about` | Practitioner bio + contact form | Server + client form |
| `/admin` | Login → dashboard (tabs: cases/docs/posts/subscribers) | Server (auth guard) + client forms |

Route segments stay English; visible labels come from next-intl messages.

## Design tokens (exact handoff values)

Colors:
- Background `#F5F7F5`, surface `#FFFFFF`, ink `#0C1512`, text-secondary `#566962`, text-body `#3A4642`
- Teal primary `#0FA893`, teal-dark `#0A5049`, teal-light `#4FD8C6`, dark section `#0C1512`
- Alert text `#B4531F`, orange `#FF8A4C`, alert bg `rgba(255,138,76,.12)`; danger `#FF6B4A`
- Borders: `rgba(12,21,18,.08)` / `.14–.16`; on dark: `rgba(255,255,255,.1–.18)`, surfaces `rgba(255,255,255,.05–.06)`

Fonts (via `next/font/google`):
- Display: **Space Grotesk** 400–700, `letter-spacing:-.02em…-.03em`
- Body/UI: **IBM Plex Sans** 400–600

Radii: buttons/inputs 10–14px; cards 16–22px; big blocks 24–28px; pills 100px.
Shadows: card `0 18px 44px -14px rgba(12,21,18,.3)`; hero `0 30px 70px -24px rgba(12,21,18,.4)`; premium plan `0 30px 70px -24px rgba(12,21,18,.5)`.
Container max 1220px (narrow 1000–1100px), side padding 32px (20px mobile). Breakpoints 920px, 560px.

Wire tokens into `globals.css` CSS vars + `tailwind.config.ts` where they map cleanly; keep raw hex for exact-match spots. Delete unused scaffold clinic gradient helpers only if replaced.

## Components (`src/components/site/`)

- **Header** (client): sticky, blur bg, logo wordmark (Surgery**4**all + subtitle), center nav with active state, gear (admin) + "S'abonner" button; `<920px` hamburger → vertical panel. Active link uses next-intl pathname.
- **Footer** (client for nav links): 4-col brand + link columns + copyright. Hidden on `/admin`.
- **CaseCard** (client): 4/3 media, type + access badges, video play glyph, premium lock overlay (→ pricing), sensitive blur overlay (reveal on click). Props from `Case`.
- **DocRow**: PDF icon, title, journal·year, Télécharger (free) / PDF premium (locked → pricing).
- **PlanCard**: highlight variant (dark, scale 1.03, teal accents) vs plain; features list with check icons.
- **ImageSlot**: renders `<Image>` when `src` present, else styled placeholder (drag/drop not required; upload happens in admin).

## Data model (Supabase)

Migration SQL in `supabase/schema.sql`:

- `cases`: id uuid, title, specialty, type (`photo`|`video`), duration, description, media_url, premium bool, sensitive bool, created_at
- `documents`: id, title, journal, year, pdf_url, premium bool, created_at
- `posts`: id, title, category, excerpt, cover_url, published_at
- `subscribers`: id, name, initial, plan, since, status (`active`|`free`|`paused`), created_at

`src/lib/data.ts`:
- `getCases()`, `getDocuments()`, `getPosts()`, `getSubscribers()` — query Supabase (server client, service role).
- If `NEXT_PUBLIC_SUPABASE_URL` missing/empty OR query errors → return seed arrays from `src/lib/seed.ts` (ported from prototype state). Guarantees UI renders without credentials.

`src/lib/seed.ts`: exact prototype seed data (8 cases, 5 docs, 4 posts, 5 subscribers) with FR content; English variants live in messages where they are static, but dynamic DB content stays single-language (author-entered).

## Server Actions (`src/app/[locale]/admin/actions.ts`)

- `login(formData)`: check `ADMIN_USER` + `ADMIN_PASSWORD` (env); on match sign JWT (`lib/auth.ts`), set httpOnly cookie `admin-token`; else return error. `logout()` clears cookie.
- `addCase`/`deleteCase`, `addDocument`/`deleteDocument`, `addPost`/`deletePost`: Supabase insert/delete, `revalidatePath` for `/`, `/cases`, `/publications`, `/blog`, `/admin`. All guarded: verify cookie JWT first; reject if unauthenticated.
- If Supabase unconfigured, actions return a clear "backend not configured" error toast (no silent no-op).

## API routes

- `src/app/api/contact/route.ts`: POST, Zod-validate `{name,email,message}`, send via Resend to `CONTACT_EMAIL`. Return JSON status. Client form uses `sonner` toast.
- `src/app/api/upload/route.ts`: admin-guarded. Receives multipart file, uploads server-side to Cloudinary via SDK, returns `{ url }`. Admin form posts file → gets `media_url` to store. If Cloudinary unconfigured → 400 with clear message.

## Auth / middleware

`src/middleware.ts`: keep next-intl middleware; add guard — requests to `/admin` (any locale) without valid `admin-token` still render the page, but the page itself is a Server Component that checks the cookie and shows login vs dashboard (matches prototype: `/admin` is public, content gated). Mutations are guarded in the actions regardless. (Simpler + matches prototype UX than a hard middleware redirect.)

## i18n

- `routing.locales = ['fr','en']`, default `fr`.
- Fill `src/messages/fr.json` + `en.json` with ALL static UI strings (nav, hero, section headings, buttons, labels, plan names/features, about bio, contact, admin labels). Remove `de/it/ar` message files.
- Dynamic DB content (case titles, doc titles, post bodies) is author-entered, not translated.

## Error handling

- Data fetch failure → seed fallback (never blank).
- Contact/upload failure → toast error, form stays filled.
- Admin action failure → toast error with reason.
- Unauthenticated mutation → rejected server-side.

## Testing

- Vitest unit: `price()` annual rounding, case filter logic, seed/Supabase fallback selection, JWT sign/verify round-trip, contact Zod schema.
- Manual/verify pass: `npm run build` clean; drive each route; admin login → add/delete reflects publicly; sensitive reveal + premium lock behavior; responsive at 920/560; fr/en switch.

## Out of scope

Stripe/subscriber billing, real subscriber accounts, multi-language DB content, `de/it/ar` locales, blog article detail pages (grid only, matching prototype).
