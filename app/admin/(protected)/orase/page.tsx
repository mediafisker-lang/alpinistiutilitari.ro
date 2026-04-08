import { upsertCityAction } from "@/lib/actions/admin";
import { prisma } from "@/lib/db";

export default async function AdminCitiesPage() {
  const [counties, cities] = await Promise.all([
    prisma.county.findMany({ orderBy: { name: "asc" } }),
    prisma.city.findMany({
      include: { county: true, _count: { select: { companies: true } } },
      orderBy: [{ county: { name: "asc" } }, { name: "asc" }],
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Taxonomie</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Orașe</h1>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <h2 className="text-xl font-bold text-slate-950">Adaugă oraș</h2>
        <form action={upsertCityAction} className="mt-5 grid gap-4 lg:grid-cols-2">
          <select name="countyId" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm">
            <option value="">Selectează județ</option>
            {counties.map((county) => (
              <option key={county.id} value={county.id}>
                {county.name}
              </option>
            ))}
          </select>
          <input name="name" placeholder="Nume oraș" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <input name="slug" placeholder="Slug" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <input name="seoTitle" placeholder="SEO title" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <textarea name="intro" placeholder="Intro" className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" />
          <textarea name="seoDescription" placeholder="SEO description" className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" />
          <button type="submit" className="h-12 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white lg:col-span-2">
            Salvează orașul
          </button>
        </form>
      </section>

      <div className="grid gap-4">
        {cities.map((city) => (
          <form
            key={city.id}
            action={upsertCityAction}
            className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 lg:grid-cols-5"
          >
            <input type="hidden" name="id" value={city.id} />
            <select name="countyId" defaultValue={city.countyId} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm">
              {counties.map((county) => (
                <option key={county.id} value={county.id}>
                  {county.name}
                </option>
              ))}
            </select>
            <input name="name" defaultValue={city.name} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="slug" defaultValue={city.slug} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="seoTitle" defaultValue={city.seoTitle ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <button type="submit" className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Update</button>
            <textarea name="intro" defaultValue={city.intro ?? ""} className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-3" />
            <textarea name="seoDescription" defaultValue={city.seoDescription ?? ""} className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" />
            <div className="text-sm text-slate-500 lg:col-span-5">
              {city.county.name} · {city._count.companies} firme
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
