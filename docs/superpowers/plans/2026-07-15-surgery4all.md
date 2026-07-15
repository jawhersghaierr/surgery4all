# Surgery4all Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the Surgery4all hifi handoff into the existing Next.js 14 scaffold as real locale-routed pages with a wired Supabase/auth/email/Cloudinary backend.

**Architecture:** App Router pages per route (replacing the prototype's `page` state), Server Components fetch data through `lib/data.ts` (Supabase with seed fallback), admin mutations via Server Actions guarded by a jose JWT cookie, contact + upload via API routes. Handoff tokens/fonts adopted exactly.

**Tech Stack:** Next.js 14 (App Router), next-intl (fr/en), Tailwind, shadcn/ui primitives, Supabase JS, jose, Resend, Cloudinary, react-hook-form + zod, sonner, vitest.

## Global Constraints

- Locales: `['fr','en']`, default `fr`, `localePrefix: as-needed`. Delete `de/it/ar` message files.
- Pixel-faithful to handoff. Source of visual truth = the `.dc.html` files in `../Site dentaire moderne Surgery for All/design_handoff_surgery4all/` (referred to below as HANDOFF). Copy inline styles verbatim; convert `{{ x }}` bindings to JSX props.
- Exact colors: bg `#F5F7F5`, surface `#FFFFFF`, ink `#0C1512`, text-2 `#566962`, text-body `#3A4642`, teal `#0FA893`, teal-dark `#0A5049`, teal-light `#4FD8C6`, alert `#B4531F`/`#FF8A4C`/`rgba(255,138,76,.12)`, danger `#FF6B4A`.
- Fonts: Space Grotesk (display), IBM Plex Sans (body) via `next/font/google`.
- Breakpoints 920px + 560px. Container max 1220px (narrow 1000/1100px), padding 32px / 20px mobile.
- Route segments English; visible copy from next-intl messages.
- Dynamic DB content (case/doc/post fields) is single-language, author-entered.
- All admin mutations verify the JWT cookie server-side before writing.
- Not a git repo — "Commit" steps are replaced by "Verify build/test green". Do not run `git`.

---

## Task 1: Design tokens, fonts, i18n locale trim

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `src/routing.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Delete: `src/messages/de.json`, `src/messages/it.json`, `src/messages/ar.json`
- Test: `src/lib/__tests__/tokens.test.ts` (smoke: routing locales)

**Interfaces:**
- Produces: font CSS variables `--font-display`, `--font-body`; Tailwind colors `ink`, `surface`, `bg`, `teal`, `teal-dark`, `teal-light`, `text2`, `textbody`; `routing.locales = ['fr','en']`.

- [ ] **Step 1: Trim locales.** In `src/routing.ts` set `locales: ['fr', 'en']`. Delete the three unused message files.

- [ ] **Step 2: Failing test.**
```ts
// src/lib/__tests__/tokens.test.ts
import { describe, it, expect } from 'vitest'
import { routing } from '@/routing'
describe('routing', () => {
  it('has fr + en only, fr default', () => {
    expect(routing.locales).toEqual(['fr', 'en'])
    expect(routing.defaultLocale).toBe('fr')
  })
})
```
Run: `npx vitest run src/lib/__tests__/tokens.test.ts` → expect PASS (after step 1) / FAIL if not trimmed.

- [ ] **Step 3: Fonts.** In `src/app/[locale]/layout.tsx` add:
```tsx
import { Space_Grotesk, IBM_Plex_Sans } from 'next/font/google'
const display = Space_Grotesk({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-display' })
const body = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400','500','600'], style: ['normal','italic'], variable: '--font-body' })
```
Add `className={`${display.variable} ${body.variable}`}` to `<html>`.

- [ ] **Step 4: Tokens in globals.css.** Replace the `:root` block and `.text-clinic-gradient/.glass/.btn-*` helpers with handoff tokens. Keep shadcn HSL vars mapped to handoff:
```css
@layer base {
  :root {
    --background: 140 14% 96%;      /* #F5F7F5 */
    --foreground: 160 28% 6%;       /* #0C1512 */
    --card: 0 0% 100%;
    --card-foreground: 160 28% 6%;
    --primary: 171 83% 36%;         /* #0FA893 */
    --primary-foreground: 0 0% 100%;
    --muted: 140 14% 96%;
    --muted-foreground: 162 9% 37%; /* #566962 */
    --border: 160 28% 6% / 0.08;    /* fallback; raw rgba used in markup */
    --ring: 171 83% 36%;
    --radius: 0.75rem;
    --destructive: 9 100% 64%;      /* #FF6B4A */
    --destructive-foreground: 0 0% 100%;
    --sfa-bg:#F5F7F5; --sfa-ink:#0C1512; --sfa-teal:#0FA893; --sfa-teal-dark:#0A5049; --sfa-teal-light:#4FD8C6;
    --sfa-text2:#566962; --sfa-text-body:#3A4642;
  }
  body { font-family: var(--font-body), 'IBM Plex Sans', system-ui, sans-serif; background:#F5F7F5; color:#0C1512; -webkit-font-smoothing:antialiased; }
  a { color:#0A857A; text-decoration:none; } a:hover { color:#075049; }
  ::selection { background:#0FA893; color:#fff; }
  @keyframes sfaRise { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
}
```
Keep `@tailwind base/components/utilities`. Remove dark-theme clinic overrides (site is light; admin uses its own dark markup, not `data-theme`).

- [ ] **Step 5: Tailwind colors + fonts.** In `tailwind.config.ts` under `theme.extend`:
```ts
colors: { /* keep shadcn ones */ ink:'#0C1512', surface:'#FFFFFF', bg:'#F5F7F5',
  teal:{ DEFAULT:'#0FA893', dark:'#0A5049', light:'#4FD8C6' }, text2:'#566962', textbody:'#3A4642',
  alert:'#B4531F', orange:'#FF8A4C', danger:'#FF6B4A' },
fontFamily:{ display:['var(--font-display)','Space Grotesk','sans-serif'], body:['var(--font-body)','IBM Plex Sans','sans-serif'] },
```
Remove `de/it/ar` from any content globs (none present).

- [ ] **Step 6: Verify.** `npx vitest run src/lib/__tests__/tokens.test.ts` → PASS. `npm run build` compiles (existing home page still uses old classes — acceptable, replaced in Task 8).

---

## Task 2: Domain types + seed data

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/seed.ts`
- Test: `src/lib/__tests__/seed.test.ts`

**Interfaces:**
- Produces:
```ts
export type CaseType = 'photo' | 'video'
export interface Case { id:string; title:string; specialty:string; type:CaseType; duration:string; description:string; media_url:string|null; premium:boolean; sensitive:boolean }
export interface Doc { id:string; title:string; journal:string; year:string; pdf_url:string|null; premium:boolean }
export interface Post { id:string; title:string; category:string; excerpt:string; cover_url:string|null; date:string }
export type SubStatus = 'active'|'free'|'paused'
export interface Subscriber { id:string; name:string; initial:string; plan:string; since:string; status:SubStatus }
export const SPECIALTIES = ['Implantologie','Greffe osseuse','Extraction','Sinus lift','Parodontologie'] as const
export const seedCases: Case[]; seedDocs: Doc[]; seedPosts: Post[]; seedSubscribers: Subscriber[]
```

- [ ] **Step 1: Failing test.**
```ts
import { describe, it, expect } from 'vitest'
import { seedCases, seedDocs, seedPosts, seedSubscribers } from '@/lib/seed'
describe('seed', () => {
  it('matches prototype counts', () => {
    expect(seedCases).toHaveLength(8)
    expect(seedDocs).toHaveLength(5)
    expect(seedPosts).toHaveLength(4)
    expect(seedSubscribers).toHaveLength(5)
  })
  it('cases have required flags', () => {
    for (const c of seedCases) { expect(['photo','video']).toContain(c.type); expect(typeof c.premium).toBe('boolean') }
  })
})
```
Run: `npx vitest run src/lib/__tests__/seed.test.ts` → FAIL (module missing).

- [ ] **Step 2: types.ts** — the Interfaces block above.

- [ ] **Step 3: seed.ts** — port the exact arrays from HANDOFF `Surgery for All.dc.html` state (lines 496–518): 8 cases (`c1..c8`), 5 docs (`d1..d5`), 4 posts (`p1..p4`), plus the 5 subscribers from lines 596–601. Map fields: `desc→description`, add `media_url:null`, `pdf_url:null`, `cover_url:null`; posts `date` from prototype `date`; subscriber `status` → `'active'|'free'|'paused'` (Actif→active, Gratuit→free, En pause→paused).

- [ ] **Step 4: Verify.** `npx vitest run src/lib/__tests__/seed.test.ts` → PASS.

---

## Task 3: Data layer with Supabase + fallback

**Files:**
- Create: `src/lib/data.ts`
- Create: `supabase/schema.sql`
- Test: `src/lib/__tests__/data.test.ts`

**Interfaces:**
- Consumes: types + seed from Task 2, `supabase` from `src/lib/supabase.ts`.
- Produces: `isBackendConfigured(): boolean`, `getCases(): Promise<Case[]>`, `getDocuments(): Promise<Doc[]>`, `getPosts(): Promise<Post[]>`, `getSubscribers(): Promise<Subscriber[]>`. Each returns seed data when backend unconfigured or on error.

- [ ] **Step 1: Failing test.**
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
beforeEach(() => { vi.resetModules(); delete process.env.NEXT_PUBLIC_SUPABASE_URL })
describe('data fallback', () => {
  it('returns seed when unconfigured', async () => {
    const { getCases, isBackendConfigured } = await import('@/lib/data')
    expect(isBackendConfigured()).toBe(false)
    expect(await getCases()).toHaveLength(8)
  })
})
```
Run: `npx vitest run src/lib/__tests__/data.test.ts` → FAIL.

- [ ] **Step 2: data.ts.**
```ts
import { supabase } from './supabase'
import { seedCases, seedDocs, seedPosts, seedSubscribers } from './seed'
import type { Case, Doc, Post, Subscriber } from './types'
export function isBackendConfigured() { return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY }
async function q<T>(table:string, seed:T[], order='created_at'):Promise<T[]> {
  if (!isBackendConfigured()) return seed
  try { const { data, error } = await supabase.from(table).select('*').order(order,{ascending:false}); if (error||!data) return seed; return data as T[] }
  catch { return seed }
}
export const getCases = () => q<Case>('cases', seedCases)
export const getDocuments = () => q<Doc>('documents', seedDocs)
export const getPosts = () => q<Post>('posts', seedPosts, 'published_at')
export const getSubscribers = () => q<Subscriber>('subscribers', seedSubscribers)
```

- [ ] **Step 3: schema.sql** — `create table` for cases/documents/posts/subscribers with columns from spec data model, `id uuid default gen_random_uuid() primary key`, `created_at timestamptz default now()` (posts use `published_at`). Add `-- run in Supabase SQL editor` header comment.

- [ ] **Step 4: Verify.** `npx vitest run src/lib/__tests__/data.test.ts` → PASS.

---

## Task 4: Auth helpers (session read + admin check)

**Files:**
- Modify: `src/lib/auth.ts`
- Test: `src/lib/__tests__/auth.test.ts`

**Interfaces:**
- Consumes: existing `signToken`, `verifyToken`, `COOKIE_NAME`.
- Produces: `getSession(): Promise<{admin:boolean}|null>` (reads cookie via `next/headers`), `checkCredentials(user,pass):boolean`.

- [ ] **Step 1: Failing test** (JWT round-trip + credential check):
```ts
import { describe, it, expect } from 'vitest'
import { signToken, verifyToken, checkCredentials } from '@/lib/auth'
describe('auth', () => {
  it('signs and verifies', async () => { const t = await signToken({admin:true}); const p = await verifyToken(t); expect(p.admin).toBe(true) })
  it('checks credentials from env', () => {
    process.env.ADMIN_USER='a'; process.env.ADMIN_PASSWORD='b'
    expect(checkCredentials('a','b')).toBe(true); expect(checkCredentials('a','x')).toBe(false)
  })
})
```
Run → FAIL (`checkCredentials`, `getSession` missing).

- [ ] **Step 2: Add to auth.ts.**
```ts
import { cookies } from 'next/headers'
export function checkCredentials(user:string, pass:string) {
  const U = process.env.ADMIN_USER ?? 'admin'; const P = process.env.ADMIN_PASSWORD
  if (!P) return false
  return user === U && pass === P
}
export async function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return null
  try { const p = await verifyToken(token); return { admin: !!p.admin } } catch { return null }
}
```

- [ ] **Step 3: Verify.** `npx vitest run src/lib/__tests__/auth.test.ts` → PASS.

---

## Task 5: Pricing helpers + i18n messages

**Files:**
- Create: `src/lib/pricing.ts`
- Rewrite: `src/messages/fr.json`, `src/messages/en.json`
- Test: `src/lib/__tests__/pricing.test.ts`

**Interfaces:**
- Produces: `annualPrice(monthly:number):number` (= `Math.round(monthly*0.8)`), `buildPlans(billing:'monthly'|'annual', t)` returning plan objects `{id,name,tag,price,unit,period,highlight,features[],cta,ctaStyle}` mirroring HANDOFF lines 551–561.

- [ ] **Step 1: Failing test.**
```ts
import { describe, it, expect } from 'vitest'
import { annualPrice } from '@/lib/pricing'
describe('pricing', () => {
  it('annual = round(monthly*0.8)', () => { expect(annualPrice(29)).toBe(23); expect(annualPrice(99)).toBe(79) })
})
```
Run → FAIL.

- [ ] **Step 2: pricing.ts** with `annualPrice` and `buildPlans` (prices 0/29/99, `pro` highlighted, features via `t('pricing.plans.*')`).

- [ ] **Step 3: messages.** Populate `fr.json` + `en.json` with keys: `nav.*`, `home.*` (hero, stats, specialties[], sectionRecent, docsTeaser, testimonials[], finalCta), `cases.*` (title, warning, chips[]), `docs.*`, `blog.*`, `pricing.*` (toggle, plans, footnote), `about.*` (bio paragraphs, stats, contact fields), `admin.*` (login, tabs, form labels, statuses), `footer.*`, `common.*`. FR copy verbatim from HANDOFF; EN = faithful translation.

- [ ] **Step 4: Verify.** `npx vitest run src/lib/__tests__/pricing.test.ts` → PASS. `npx tsc --noEmit` clean.

---

## Task 6: Presentational components (ImageSlot, CaseCard, DocRow, PlanCard)

**Files:**
- Create: `src/components/site/ImageSlot.tsx`
- Create: `src/components/site/CaseCard.tsx`
- Create: `src/components/site/DocRow.tsx`
- Create: `src/components/site/PlanCard.tsx`
- Test: `src/components/site/__tests__/caseCard.test.tsx`

**Interfaces:**
- Consumes: `Case`, `Doc` types; plan object shape from Task 5.
- Produces: `<ImageSlot src? placeholder className/>`, `<CaseCard c={Case}/>` (client), `<DocRow d={Doc}/>`, `<PlanCard p={Plan}/>`.

- [ ] **Step 1: ImageSlot** — `<Image>` (next/image) when `src` truthy, else a div with teal gradient + image icon + placeholder text. Ratio controlled by parent wrapper.

- [ ] **Step 2: CaseCard** (`'use client'`) — port HANDOFF `caseCard.dc.html`: 4/3 media, type + access badges, video play glyph, premium lock overlay (onClick → router push `/pricing`), sensitive blur (local `revealed` state, reveal on click; premium takes priority). Body: specialty/title/description. Use `useRouter` from `@/navigation`.

- [ ] **Step 3: DocRow** — port `docRow.dc.html`: free → Télécharger (opens `pdf_url`), premium → PDF premium button routing to `/pricing`. Labels via next-intl `useTranslations('docs')`.

- [ ] **Step 4: PlanCard** — port `planCard.dc.html`: highlight variant (dark, `scale(1.03)`, teal accents, teal CTA) vs plain (white, solid/ghost CTA). CTA routes to `/pricing` or `/about` (contact) per `ctaStyle`.

- [ ] **Step 5: Failing test then verify** — render CaseCard:
```tsx
import { render, screen } from '@testing-library/react'  // if RTL absent, assert via renderToString
```
If no React test env configured, instead add a logic-only test in `src/lib/__tests__/caseCard-logic.test.ts` asserting badge/label helpers exported from a small `caseCardLogic.ts` (typeText, premText, showLock, showSensitive) mirroring HANDOFF lines 57–70. Prefer extracting that pure logic so it is testable without a DOM. Run the test → PASS.

> Note for implementer: extract pure display logic (`caseCardLogic.ts`) so the component stays thin and the logic is unit-tested; the JSX itself is verified in the Task 13 manual/build pass.

---

## Task 7: Header + Footer

**Files:**
- Create: `src/components/site/Header.tsx`
- Create: `src/components/site/Footer.tsx`
- Create: `src/components/site/LocaleSwitch.tsx`
- Modify: `src/app/[locale]/layout.tsx` (render Header/Footer around children; Footer hidden on `/admin`)

**Interfaces:**
- Consumes: `Link`, `usePathname` from `@/navigation`.
- Produces: `<Header/>`, `<Footer/>`. Header active-link detection via `usePathname()`.

- [ ] **Step 1: Header** (`'use client'`) — port HANDOFF nav (lines 52–92): sticky blur bar, logo wordmark, center nav links (Accueil/Cas cliniques/Publications/Blog/Abonnements/Le praticien) using `<Link href>` to `/`,`/cases`,`/publications`,`/blog`,`/pricing`,`/about`; active style when `usePathname()` matches. Gear button → `/admin`. "S'abonner" → `/pricing` (hidden mobile). `<920px` hamburger toggles vertical panel (`useState menuOpen`). Include `LocaleSwitch` (fr/en) in the right cluster.

- [ ] **Step 2: Footer** — port lines 464–478: brand blurb + Contenu/Offre/Légal columns (links via `<Link>`) + copyright with year `2026`.

- [ ] **Step 3: LocaleSwitch** — two links fr/en using `usePathname()` + `@/navigation` `Link` with `locale` prop.

- [ ] **Step 4: layout.tsx** — wrap: `<Header/>{children}<Footer/>`. Footer conditional handled inside Footer by reading pathname (`if pathname.includes('/admin') return null`).

- [ ] **Step 5: Verify.** `npm run build` compiles. Manual check deferred to Task 13.

---

## Task 8: Home page

**Files:**
- Rewrite: `src/app/[locale]/page.tsx`
- Create: `src/components/site/Testimonials.tsx` (static, from messages)

**Interfaces:**
- Consumes: `getCases`, `getDocuments`; `CaseCard`; messages.

- [ ] **Step 1: page.tsx** (Server Component) — `setRequestLocale`, `const cases = await getCases(); const docs = await getDocuments()`. Port HANDOFF home sections (lines 95–195): hero (2-col, stats, ImageSlot 4/5 + floating badge), specialties marquee bar, recent cases (`cases.slice(0,3)` → CaseCard), docs teaser dark block (`docs.slice(0,3)`), Testimonials, final CTA. All copy via `getTranslations('home')`.

- [ ] **Step 2: Testimonials** — 3 cards from `home.testimonials` message array.

- [ ] **Step 3: Verify.** `npm run build`; run `npm run dev`, load `/` → renders with seed data. Task 13 does full visual pass.

---

## Task 9: Cases, Publications, Blog, Pricing, About pages

**Files:**
- Create: `src/app/[locale]/cases/page.tsx` + `src/app/[locale]/cases/CasesClient.tsx`
- Create: `src/app/[locale]/publications/page.tsx`
- Create: `src/app/[locale]/blog/page.tsx`
- Create: `src/app/[locale]/pricing/page.tsx` (client for billing toggle) + uses PlanCard
- Create: `src/app/[locale]/about/page.tsx` + `src/components/site/ContactForm.tsx`

**Interfaces:**
- Consumes: data getters, `CaseCard`, `DocRow`, `PlanCard`, `buildPlans`.

- [ ] **Step 1: cases** — server page fetches `getCases()`, passes to `CasesClient` (`'use client'`) holding `filter` state + chips (HANDOFF lines 199–217, 623–632). Warning banner + grid.

- [ ] **Step 2: publications** — server, `getDocuments()` → DocRow list (lines 221–232).

- [ ] **Step 3: blog** — server, `getPosts()` → article grid (lines 235–252).

- [ ] **Step 4: pricing** (`'use client'`) — billing toggle state, `buildPlans(billing,t)` → 3 PlanCards, footnote (lines 255–275).

- [ ] **Step 5: about** — server bio + stats (lines 278–296) + dark contact block containing `ContactForm` (`'use client'`, react-hook-form + zod, posts to `/api/contact`, sonner toast). Coordinates: `contact@surgeryforall.fr`, Paris (per HANDOFF line 304).

- [ ] **Step 6: Verify.** `npm run build`; load each route with seed data.

---

## Task 10: Contact + upload API routes

**Files:**
- Create: `src/app/api/contact/route.ts`
- Create: `src/app/api/upload/route.ts`
- Create: `src/lib/mail.ts`
- Test: `src/lib/__tests__/contact-schema.test.ts`

**Interfaces:**
- Produces: `contactSchema` (zod) in `src/lib/validation.ts`; POST `/api/contact` → `{ok:true}` | 400/500; POST `/api/upload` (admin-guarded) → `{url}`.

- [ ] **Step 1: validation.ts + failing test.**
```ts
// src/lib/validation.ts
import { z } from 'zod'
export const contactSchema = z.object({ name:z.string().min(2), email:z.string().email(), message:z.string().min(10) })
```
```ts
// test
import { contactSchema } from '@/lib/validation'
it('rejects bad email', () => { expect(contactSchema.safeParse({name:'Jo',email:'x',message:'0123456789'}).success).toBe(false) })
it('accepts valid', () => { expect(contactSchema.safeParse({name:'Jo',email:'a@b.fr',message:'0123456789'}).success).toBe(true) })
```
Run → FAIL then PASS after creating file.

- [ ] **Step 2: mail.ts** — Resend send helper; if `RESEND_API_KEY` missing, throw `Error('email-not-configured')`.

- [ ] **Step 3: contact route** — parse JSON, `contactSchema.parse`, send mail to `CONTACT_EMAIL`; return `{ok:true}`; on `email-not-configured` return 503 `{error}`; on zod error 400.

- [ ] **Step 4: upload route** — `getSession()` guard (401 if not admin), read multipart file, upload via `cloudinary` SDK (config from env); if unconfigured return 400 `{error:'media-not-configured'}`; else `{url}`.

- [ ] **Step 5: Verify.** `npx vitest run src/lib/__tests__/contact-schema.test.ts` → PASS.

---

## Task 11: Admin server actions

**Files:**
- Create: `src/app/[locale]/admin/actions.ts`
- Test: `src/lib/__tests__/actions-guard.test.ts` (guard logic extracted)

**Interfaces:**
- Consumes: `getSession`, `checkCredentials`, `signToken`, `COOKIE_NAME`, `supabase`, `isBackendConfigured`.
- Produces (all `'use server'`): `login(prev,formData)`, `logout()`, `addCase(formData)`, `deleteCase(id)`, `addDocument(formData)`, `deleteDocument(id)`, `addPost(formData)`, `deletePost(id)`. Return `{error?:string}`.

- [ ] **Step 1: actions.ts.** `login`: `checkCredentials`; on success `signToken({admin:true})` → `cookies().set(COOKIE_NAME, token, {httpOnly:true, secure:true, sameSite:'lax', path:'/'})`; else `{error:'invalid'}`. `logout`: `cookies().delete(COOKIE_NAME)`. Each mutation: `const s = await getSession(); if(!s?.admin) return {error:'unauthorized'}; if(!isBackendConfigured()) return {error:'backend-not-configured'}`; else Supabase insert/delete; then `revalidatePath('/','layout')`.

- [ ] **Step 2: Guard test** — extract `assertAdmin(session)` returning boolean; test it rejects null/non-admin, accepts `{admin:true}`. Run → PASS.

- [ ] **Step 3: Verify.** `npx tsc --noEmit` clean.

---

## Task 12: Admin page (login + dashboard)

**Files:**
- Create: `src/app/[locale]/admin/page.tsx` (server, reads `getSession`)
- Create: `src/app/[locale]/admin/LoginForm.tsx` (client)
- Create: `src/app/[locale]/admin/Dashboard.tsx` (client, tabs + forms)

**Interfaces:**
- Consumes: `getSession`, data getters, admin actions.

- [ ] **Step 1: page.tsx** — full-screen dark wrapper (`#0C1512`). `const session = await getSession()`. If `!session?.admin` render `<LoginForm/>` (HANDOFF lines 321–333) else `<Dashboard cases docs posts subscribers/>` fetched via getters (HANDOFF lines 335–458).

- [ ] **Step 2: LoginForm** (`'use client'`) — identifiant/mot de passe inputs, calls `login` action (`useFormState`/`useActionState`), error toast on `{error}`. On success the server re-renders dashboard (revalidate).

- [ ] **Step 3: Dashboard** (`'use client'`) — logout button, 4 stat cards (`cases.length`, `docs.length`, static `5 214`, `18,7 k€`), tab state cases/docs/posts/subs. Each add form calls the matching action; delete buttons call delete actions. Subscribers tab = read-only table with colored status pills (HANDOFF lines 443–455, 602–606). Add-case form includes optional media upload posting to `/api/upload`, storing returned `url` in the insert.

- [ ] **Step 4: Verify.** `npm run build`; load `/admin` → login screen; submit with dev creds → dashboard (backend-not-configured toast on add if Supabase absent, which is expected without keys).

---

## Task 13: Middleware, env, responsive + full verification

**Files:**
- Modify: `src/middleware.ts` (keep next-intl; no hard admin redirect — page-level guard used)
- Modify: `.env.local.example` (add `ADMIN_USER`, `ADMIN_PASSWORD`)
- Modify: `README.md` (setup: env keys, `supabase/schema.sql`, run)
- Verify only.

- [ ] **Step 1: env + README** — add `ADMIN_USER=admin`, `ADMIN_PASSWORD=change-me` to `.env.local.example`; document Supabase schema load + Cloudinary/Resend keys in README.

- [ ] **Step 2: Responsive audit** — confirm 920px (nav→hamburger, grids collapse) + 560px (single-col) behavior across all pages via CSS matching HANDOFF media queries (lines 27–44). Add any missing responsive utilities.

- [ ] **Step 3: Full verify (superpowers:verification-before-completion).**
  - `npx vitest run` → all green.
  - `npx tsc --noEmit` → clean.
  - `npm run build` → success.
  - `npm run dev`: drive `/`, `/cases` (filter chips), `/publications`, `/blog`, `/pricing` (toggle), `/about` (submit contact — expect 503 toast without RESEND key), `/admin` (login → add/delete case → seed list updates in memory path; publicly reflects when Supabase configured). Switch fr↔en. Check sensitive reveal + premium lock → pricing.
  - Report evidence (command output) before declaring done.

---

## Self-Review

- **Spec coverage:** tokens/fonts (T1), i18n trim+messages (T1,T5), data model+fallback (T2,T3), auth (T4), all 7 routes (T8,T9,T12), components (T6,T7), actions/CRUD (T11), contact+upload (T10), middleware/env (T13), testing (each task + T13). Covered.
- **Placeholder scan:** no TBD/TODO; code shown for logic steps; visual markup intentionally delegated to HANDOFF source line refs (single source of truth) — implementer copies verbatim.
- **Type consistency:** `Case.description` (not `desc`), `media_url/pdf_url/cover_url` nullable, `Doc.year:string`, `SubStatus` union, action returns `{error?}` — consistent across T2/T3/T6/T11/T12.

## Notes for implementer

- HANDOFF path: `../Site dentaire moderne Surgery for All/design_handoff_surgery4all/`. Do NOT port `support.js`/`image-slot.js` runtime.
- When copying inline styles, keep exact px/rgba values. Convert `style-hover="..."` to Tailwind `hover:` or a CSS class.
- `useRouter`/`Link`/`usePathname` come from `@/navigation` (next-intl), not `next/navigation`.
