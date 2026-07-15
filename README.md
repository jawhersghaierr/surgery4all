# Surgery4All — Cabinet dentaire

Site vitrine d'un cabinet dentaire. Même stack que `cartago-motors-car`.

## Stack

- **Next.js 14** (App Router) + **next-intl** (fr, en, ar, it, de)
- **React 18** + **TypeScript**
- **Tailwind CSS** + tailwindcss-animate + shadcn/ui (Radix)
- **Supabase** (DB / storage) — client dans `src/lib/supabase*.ts`
- **Cloudinary** (images) — à configurer
- **Resend** + **Nodemailer** (email) — à configurer
- **react-hook-form** + **zod** (formulaires)
- **next-themes** (light/dark), **sonner** (toasts), **lucide-react** (icônes), **jose** (JWT auth)

Les libs sont installées mais non branchées (sauf i18n + thème). Prêtes à être câblées.

## Démarrer

```bash
npm install
cp .env.local.example .env.local   # remplir les clés
npm run dev
```

Ouvrir http://localhost:3000

## Structure

```
src/
  app/[locale]/        # pages publiques localisées
  components/ui/        # composants shadcn
  lib/                  # utils, auth, supabase clients
  messages/             # traductions par locale
  routing.ts i18n.ts middleware.ts navigation.ts
```

## Palette

Thème clinique (teal) via variables CSS dans `globals.css` + couleurs `clinic-*` dans `tailwind.config.ts`.
