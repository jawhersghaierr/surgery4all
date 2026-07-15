# Surgery4All

Site vitrine du Dr Sghaier Jihed — chirurgie orale (implantologie, extractions, greffes, chirurgie
buccale). Cas cliniques, publications, blog, tarifs (abonnement premium hors périmètre — pas de
Stripe), à propos, prise de contact, back-office admin.

## Stack

- **Next.js 14** (App Router) + **next-intl** (locales `fr` / `en`, `fr` par défaut)
- **React 18** + **TypeScript**
- **Tailwind CSS** + tailwindcss-animate + shadcn/ui (Radix)
- **Supabase** — base de données (cas, publications, articles, plans) ; fallback automatique sur
  des données de seed en mémoire (lecture seule) si les clés Supabase ne sont pas configurées
- **jose** — auth admin par JWT (session cookie, vérifiée au niveau page/action)
- **Resend** — envoi du formulaire de contact
- **Cloudinary** — upload des images (cas cliniques, couvertures)
- **react-hook-form** + **zod** — formulaires
- **next-themes** (clair/sombre), **sonner** (toasts), **lucide-react** (icônes)

## Démarrer

```bash
npm install
cp .env.local.example .env.local   # remplir les clés (voir ci-dessous)
npm run dev
```

Ouvrir http://localhost:3000

### Base de données Supabase

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Ouvrir le **SQL editor** du projet et exécuter le contenu de `supabase/schema.sql` pour créer
   les tables (cas cliniques, publications, articles de blog, plans tarifaires).
3. Renseigner `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` et
   `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`.

> Sans ces clés, l'application démarre quand même : elle sert automatiquement les données de seed
> intégrées (lecture seule — pas de création/édition/suppression persistante).

### Variables d'environnement (`.env.local`)

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Connexion Supabase (optionnel, sinon seed) |
| `JWT_SECRET` | Secret de signature des sessions admin (jose) — à changer en production |
| `ADMIN_USER` / `ADMIN_PASSWORD` | Identifiants de connexion à `/admin` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Upload d'images (optionnel) |
| `RESEND_API_KEY` / `CONTACT_EMAIL` | Envoi du formulaire de contact (optionnel — sans clé, le formulaire répond une erreur 503) |

### Admin

Interface de gestion accessible sur `/admin`. Connexion via `ADMIN_USER` / `ADMIN_PASSWORD`
(cookie de session JWT, vérifié à la page et dans les server actions — pas de blocage au niveau du
middleware). Permet la gestion des cas cliniques, publications et articles de blog (persistant si
Supabase est configuré, en mémoire sinon).

> **Hors périmètre** : la facturation des abonnements premium (page tarifs) n'est pas connectée à
> un prestataire de paiement (pas de Stripe) — affichage uniquement.

## Structure

```
src/
  app/[locale]/          # pages publiques localisées (home, cases, publications, blog, pricing, about, admin)
  components/ui/         # composants shadcn
  lib/                   # utils, auth (jose), clients Supabase, Cloudinary, Resend
  messages/              # traductions fr/en
  routing.ts i18n.ts middleware.ts navigation.ts
supabase/
  schema.sql             # DDL des tables (à exécuter dans le SQL editor Supabase)
```

## Tests

```bash
npm run test     # vitest run
```

## Palette

Thème clinique (teal) via variables CSS dans `globals.css` + couleurs `clinic-*` /
`sfa-*` dans `tailwind.config.ts` et `globals.css`.
