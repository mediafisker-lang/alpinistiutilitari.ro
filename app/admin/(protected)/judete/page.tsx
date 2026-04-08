import { upsertCountyAction } from "@/lib/actions/admin";
import { prisma } from "@/lib/db";

export default async function AdminCountiesPage() {
  const counties = await prisma.county.findMany({
    include: { _count: { select: { cities: true, companies: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Taxonomie</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Județe</h1>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <h2 className="text-xl font-bold text-slate-950">Adaugă județ</h2>
        <form action={upsertCountyAction} className="mt-5 grid gap-4 lg:grid-cols-2">
          <input name="name" placeholder="Nume județ" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <input name="slug" placeholder="Slug" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <input name="shortCode" placeholder="Cod scurt" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <input name="seoTitle" placeholder="SEO title" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <textarea name="intro" placeholder="Intro" className="min-h-28 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" />
          <textarea name="seoDescription" placeholder="SEO description" className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" />
          <button type="submit" className="h-12 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white lg:col-span-2">
            Salvează județul
          </button>
        </form>
      </section>

      <div className="grid gap-4">
        {counties.map((county) => (
          <form
            key={county.id}
            action={upsertCountyAction}
            className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 lg:grid-cols-5"
          >
            <input type="hidden" name="id" value={county.id} />
            <input name="name" defaultValue={county.name} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="slug" defaultValue={county.slug} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="shortCode" defaultValue={county.shortCode ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="seoTitle" defaultValue={county.seoTitle ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <button type="submit" className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">
              Update
            </button>
            <textarea name="intro" defaultValue={county.intro ?? ""} className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-3" />
            <textarea name="seoDescription" defaultValue={county.seoDescription ?? ""} className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" />
            <div className="text-sm text-slate-500 lg:col-span-5">
              {county._count.cities} orașe · {county._count.companies} firme
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
