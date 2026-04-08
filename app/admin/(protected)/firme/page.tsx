import Link from "next/link";
import { upsertCompanyAction } from "@/lib/actions/admin";
import { prisma } from "@/lib/db";

export default async function AdminCompaniesPage() {
  const [counties, cities, companies] = await Promise.all([
    prisma.county.findMany({ orderBy: { name: "asc" } }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.company.findMany({
      include: {
        county: true,
        city: true,
        services: { include: { service: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Directory</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Firme</h1>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <h2 className="text-xl font-bold text-slate-950">Adaugă firmă manual</h2>
        <form action={upsertCompanyAction} className="mt-5 grid gap-4">
          <div className="grid gap-3 lg:grid-cols-3">
            <input name="name" placeholder="Nume firmă" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="slug" placeholder="Slug" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="phone" placeholder="Telefon" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="email" placeholder="Email" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="website" placeholder="Website" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="address" placeholder="Adresă" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
            <select name="countyId" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm">
              <option value="">Selectează județ</option>
              {counties.map((county) => (
                <option key={county.id} value={county.id}>
                  {county.name}
                </option>
              ))}
            </select>
            <select name="cityId" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm">
              <option value="">Selectează oraș</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <select name="verificationStatus" defaultValue="pending" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm">
              <option value="pending">pending</option>
              <option value="verified">verified</option>
              <option value="hidden">hidden</option>
            </select>
          </div>
          <textarea name="descriptionShort" placeholder="Descriere scurtă" className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm" />
          <textarea name="descriptionLong" placeholder="Descriere lungă" className="min-h-32 rounded-3xl border border-slate-200 px-4 py-3 text-sm" />
          <div className="flex flex-wrap gap-5 text-sm text-slate-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isPublished" defaultChecked />
              Publicată
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isFeatured" />
              Recomandată
            </label>
          </div>
          <button type="submit" className="h-12 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">
            Salvează firma
          </button>
        </form>
      </section>

      <div className="grid gap-4">
        {companies.map((company) => (
          <form
            key={company.id}
            action={upsertCompanyAction}
            className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5"
          >
            <input type="hidden" name="id" value={company.id} />
            <div className="grid gap-3 lg:grid-cols-3">
              <input name="name" defaultValue={company.name} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
              <input name="slug" defaultValue={company.slug} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
              <input name="phone" defaultValue={company.phone ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
              <input name="email" defaultValue={company.email ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
              <input name="website" defaultValue={company.website ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
              <input name="address" defaultValue={company.address ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
              <select name="countyId" defaultValue={company.countyId} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm">
                {counties.map((county) => (
                  <option key={county.id} value={county.id}>
                    {county.name}
                  </option>
                ))}
              </select>
              <select name="cityId" defaultValue={company.cityId} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm">
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              <select
                name="verificationStatus"
                defaultValue={company.verificationStatus}
                className="h-11 rounded-2xl border border-slate-200 px-4 text-sm"
              >
                <option value="pending">pending</option>
                <option value="verified">verified</option>
                <option value="hidden">hidden</option>
              </select>
            </div>

            <textarea name="descriptionShort" defaultValue={company.descriptionShort} className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm" />
            <textarea name="descriptionLong" defaultValue={company.descriptionLong} className="min-h-32 rounded-3xl border border-slate-200 px-4 py-3 text-sm" />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-5 text-sm text-slate-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isPublished" defaultChecked={company.isPublished} />
                  Publicată
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isFeatured" defaultChecked={company.isFeatured} />
                  Recomandată
                </label>
                <Link href={`/firme/${company.slug}`} className="font-medium text-sky-700">
                  Vezi profil public
                </Link>
              </div>
              <button type="submit" className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">
                Salvează
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
