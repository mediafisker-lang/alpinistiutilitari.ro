# Migrare PostgreSQL local -> remote

Acest proiect foloseste local:

- `C:\Program Files\PostgreSQL\18\bin\pg_dump.exe`
- `C:\Program Files\PostgreSQL\18\bin\psql.exe`

## 1. Export baza locala

Din PowerShell:

```powershell
$env:PGPASSWORD='Postgres123!'
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" `
  -U postgres `
  -h localhost `
  -d alpinistiutilitari `
  -F p `
  -f "C:\xampp\htdocs\backups\alpinistiutilitari.sql"
```

## 2. Creeaza baza remote

In Neon / Vercel Postgres / Supabase:

1. creezi baza noua
2. copiezi connection string-ul

Exemplu generic:

```env
postgresql://user:password@host:5432/dbname?sslmode=require
```

## 3. Import in baza remote

```powershell
$env:PGPASSWORD='PAROLA_REMOTE'
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" `
  -U USER_REMOTE `
  -h HOST_REMOTE `
  -d DB_REMOTE `
  -f "C:\xampp\htdocs\backups\alpinistiutilitari.sql"
```

## 4. Configureaza proiectul local pentru baza remote

In `.env.local`:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
GOOGLE_MAPS_API_KEY="..."
```

## 5. Configureaza Vercel pentru productie

Adaugi in Vercel:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `GOOGLE_MAPS_API_KEY`
- `GOOGLE_SITE_VERIFICATION`
- `BING_SITE_VERIFICATION`

## 6. Verifica Prisma pe baza remote

```powershell
cd C:\xampp\htdocs
npx prisma generate
npx prisma migrate deploy
```

Daca schema a fost deja importata integral prin dump SQL, iar migrarile nu mai sunt necesare imediat, poti testa si cu:

```powershell
npx prisma db pull
```

## 7. Redeploy

```powershell
cd C:\xampp\htdocs
npx vercel deploy --prod --yes
```

## 8. Audit final

```powershell
npm run audit:live-seo -- --base=https://alpinistiutilitari.vercel.app
```

Paginile importante trebuie sa treaca de la:

- `Judet indisponibil`
- `noindex`
- `404`

la:

- `200`
- title local corect
- canonical corect
- fara `noindex` pe paginile substantiale
