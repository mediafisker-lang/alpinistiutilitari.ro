# Live Launch Checklist

Acest proiect este deja legat la Vercel si are deploy live pe:

- `https://alpinistiutilitari.vercel.app`

Pentru ca productia sa fie complet functionala, mai trebuie configurata baza de date remote si tokenii de verificare.

## 1. Configureaza PostgreSQL remote

Poti folosi una dintre variante:

### Varianta A: Neon

1. Creezi un proiect nou in Neon.
2. Creezi o baza de date PostgreSQL.
3. Copiezi connection string-ul `DATABASE_URL`.

### Varianta B: Vercel Marketplace / Storage

1. In Vercel mergi la proiectul `alpinistiutilitari`.
2. Deschizi `Storage`.
3. Adaugi un Postgres nou.
4. Copiezi `DATABASE_URL` generat pentru productie.

## 2. Adauga variabilele in Vercel

In proiectul Vercel trebuie sa existe cel putin:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `GOOGLE_MAPS_API_KEY`
- `GOOGLE_SITE_VERIFICATION`
- `BING_SITE_VERIFICATION`

Exemplu:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
NEXT_PUBLIC_SITE_URL="https://alpinistiutilitari.vercel.app"
GOOGLE_MAPS_API_KEY="..."
GOOGLE_SITE_VERIFICATION="..."
BING_SITE_VERIFICATION="..."
```

## 3. Ruleaza schema pe baza remote

Dupa ce `DATABASE_URL` este configurat pe masina ta locala cu URL-ul remote:

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

Daca nu folosesti inca migrarile in productie, poti folosi temporar:

```bash
npx prisma db push
npm run db:seed
```

## 4. Redeploy productie

```bash
npx vercel deploy --prod --yes
```

## 5. Verificare Search Console si Bing

### Google Search Console

1. Adaugi proprietatea domeniului.
2. Verifici proprietatea prin meta tag sau DNS.
3. Dupa verificare, trimiti:
   - `https://alpinistiutilitari.vercel.app/sitemap.xml`

### Bing Webmaster Tools

1. Adaugi site-ul.
2. Verifici proprietatea.
3. Trimiti acelasi sitemap.

## 6. Audit live rapid

Exemplu:

```bash
npm run audit:live-seo -- --base=https://alpinistiutilitari.vercel.app
```

Scriptul verifica:

- homepage
- `robots.txt`
- `sitemap.xml`
- cateva pagini canonice importante
- status HTTP
- title
- canonical
- meta robots

## 7. Dupa lansare

Verifica manual:

- `/robots.txt`
- `/sitemap.xml`
- `/judete`
- `/servicii`
- un judet mare
- un oras
- un serviciu
- o pagina `judet + serviciu`
- un profil de firma
- un articol blog

## 8. Ce inseamna lansare completa

Lansarea este cu adevarat completa doar cand:

- site-ul live foloseste DB remote
- lead-urile se salveaza in DB remote
- adminul functioneaza live
- sitemap-ul este trimis in Search Console
- URL-urile importante sunt inspectate si indexabile
