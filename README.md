# Portal Asociație de Bloc

MVP pentru etapa 1, construit cu Next.js App Router, TypeScript, Tailwind CSS, componente compatibile cu stilul shadcn/ui și Supabase.

## Configurare

1. Instalează Node.js 20+.
2. Copiază `.env.example` în `.env.local`.
3. Completează variabilele Supabase și `ADMIN_ACCESS_KEY`.
4. Rulează schema din `supabase/schema.sql` în proiectul tău Supabase.

## Rulare locală

```bash
npm install
npm run dev
```

Aplicația va porni implicit la `http://localhost:3000`.

## Admin

Accesul în admin se face prin URL:

```text
/admin?key=valoarea-din-ADMIN_ACCESS_KEY
```

## Observații

- Conținutul demo este marcat clar în interfață și în seed-ul SQL.
- Dacă Supabase nu este configurat, homepage-ul rămâne vizibil cu fallback demo, iar formularele răspund cu mesaj explicit.
