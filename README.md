# AlpinistiUtilitari.ro

Portal web construit cu:

- Next.js 16
- TypeScript
- App Router
- PostgreSQL
- Prisma ORM
- Tailwind CSS
- componente UI în stil shadcn/ui

Platforma este orientată în primul rând pe SEO local și comercial pentru România, iar în al doilea rând pe centralizarea internă a cererilor de ofertă pentru lucrări la înălțime și servicii conexe.

## Obiective

### Scop primar
- dominare SEO pentru căutări locale și comerciale din România
- structură scalabilă pe județe, orașe, servicii și firme
- pagini indexabile pentru combinații locale de tip:
  - `alpinism utilitar bucuresti`
  - `spalare geamuri la inaltime brasov`
  - `montaj bannere ilfov`

### Scop secundar
- utilizatorul trimite o singură cerere de ofertă în platformă
- cererea se salvează intern
- administratorul analizează cererea și contactează manual executanții relevanți

## Structură principală

### Public
- `/`
- `/cere-oferta`
- `/firme`
- `/firme/[companySlug]`
- `/judete`
- `/[countySlug]`
- `/[countySlug]/[citySlug]`
- `/[countySlug]/[serviceSlug]`
- `/[countySlug]/[citySlug]/[serviceSlug]`
- `/servicii`
- `/servicii/[serviceSlug]`
- `/blog`
- `/blog/[postSlug]`
- `/despre-noi`
- `/contact`
- `/cum-functioneaza`
- `/pentru-firme`
- `/intrebari-frecvente`
- `/multumim`

### Admin
- `/admin/login`
- `/admin`
- `/admin/cereri`
- `/admin/cereri/[id]`
- `/admin/firme`
- `/admin/judete`
- `/admin/orase`
- `/admin/servicii`
- `/admin/articole`
- `/admin/faq`
- `/admin/seo`
- `/admin/import`

## Configurare

1. Copiază `.env.example` în `.env.local`
2. Completează variabilele:

```env
DATABASE_URL="postgresql://postgres:Postgres123!@localhost:5432/alpinistiutilitari"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
GOOGLE_MAPS_API_KEY=""
```

## Instalare

```bash
npm install
npx prisma generate
```

## Baza de date

### Variantă rapidă

```bash
npx prisma db push --accept-data-loss
npm run db:seed
```

### Variantă cu migrații

Migrația inițială este în:

- `prisma/migrations/20260327_init/migration.sql`

Poți aplica schema și apoi seed-ul:

```bash
npx prisma migrate deploy
npm run db:seed
```

## Pornire locală

```bash
npm run dev
```

Apoi deschizi:

- `http://localhost:3000`

## Build producție

```bash
npm run build
npm run start
```

## Seed demo

Seed-ul include:

- județe demo
- orașe demo
- servicii demo
- firme demo
- articole demo
- cereri demo
- FAQ demo
- admin user demo
- mapări Google place types → servicii

### Cont admin demo

- email: `admin@alpinistiutilitari.ro`
- parolă: `Admin1234!`

## Workflow cereri

1. clientul completează formularul din homepage, pagini locale sau pagina firmei
2. cererea este salvată în `LeadRequest`
3. imaginile se salvează în `public/uploads/lead-requests`
4. statusul inițial este `noua`
5. se creează eveniment intern în `LeadRequestEvent`
6. administratorul actualizează statusul, notițele și rezultatul final din admin

Statusuri disponibile:

- `noua`
- `in_analiza`
- `executanti_contactati`
- `client_contactat`
- `ofertare_in_curs`
- `finalizata`
- `inchisa`
- `respinsa`

## Import firme din Google Places API

Implementarea folosește sursa oficială Google Maps Platform Places API.

### Ce se importă
- `place_id`
- nume firmă
- adresă formatată
- telefon public
- website
- coordonate
- rating
- număr recenzii
- tipuri Google
- program
- link Google Maps

### Ce NU se face
- nu se scrapează HTML din Google Maps
- nu se fac bulk extraction neoficiale
- nu se copiază review-uri text

### Script de import

```bash
npm run import:places -- --county=bucuresti
```

Exemple:

```bash
npm run import:places -- --city=brasov
npm run import:places -- --query="alpinism utilitar Bucuresti"
```

Scripturi utile suplimentare:

```bash
npm run sync:counties
npm run sync:articles
npm run sync:local-articles
npm run review:google-places
npm run refresh:featured
```

La fiecare rulare:

- se creează un `CompanyImportRun`
- se jurnalizează evenimente în `CompanyImportEvent`
- se face upsert pe `externalPlaceId`
- se evită duplicatele și pe website / telefon / nume + oraș
- se mapează automat serviciile în funcție de tipuri Google și query

## SEO tehnic inclus

- metadata dinamică
- canonical-uri
- `robots.txt`
- `sitemap.xml` ca sitemap index
- sitemap-uri separate:
  - `sitemap-main.xml`
  - `sitemap-counties.xml`
  - `sitemap-cities.xml`
  - `sitemap-services.xml`
  - `sitemap-county-service.xml`
  - `sitemap-companies.xml`
  - `sitemap-blog.xml`
- breadcrumbs
- JSON-LD pentru:
  - Organization
  - LocalBusiness
  - Article
  - BreadcrumbList
  - FAQPage

### Praguri de indexare

- județ: minim 3 firme + intro
- oraș: minim 2 firme + intro
- județ + serviciu: minim 4 firme
- oraș + serviciu: minim 3 firme

Paginile sub aceste praguri nu sunt împinse în sitemap sau intră pe `noindex`.

## Search Console și Bing

Pentru verificare meta tag în producție:

- completează `GOOGLE_SITE_VERIFICATION`
- completează `BING_SITE_VERIFICATION`

După deploy:

1. verifici `https://domeniul-tau.ro/robots.txt`
2. verifici `https://domeniul-tau.ro/sitemap.xml`
3. trimiți sitemap-ul în Google Search Console
4. trimiți sitemap-ul în Bing Webmaster Tools

### Checklist live

Ghidul complet pentru lansare este în:

- `docs/live-launch-checklist.md`
- `docs/migrate-local-postgres-to-remote.md`

Audit rapid după deploy:

```bash
npm run audit:live-seo -- --base=https://alpinistiutilitari.vercel.app
```

## Observații importante

- partea publică funcționează și fără DB prin fallback demo pentru preview vizual
- adminul și importul Places au nevoie de bază reală
- dacă `DATABASE_URL` nu este setat, build-ul trece, dar Prisma va afișa warnings în timpul generării paginilor dinamice

## Fișiere importante

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `app/page.tsx`
- `app/cere-oferta/page.tsx`
- `app/[countySlug]/page.tsx`
- `app/[countySlug]/[...segments]/page.tsx`
- `app/admin/*`
- `lib/actions/leads.ts`
- `lib/actions/admin.ts`
- `lib/data/queries.ts`
- `lib/integrations/google-places.ts`
- `scripts/import-places.ts`

## Ce rămâne ușor de extins ulterior

- importuri programate prin cron / queue
- moderare avansată pentru firme
- formular separat de revendicare profil firmă
- galerie publică și logo-uri aprobate în admin
- scoring mai avansat pentru firme recomandate
