import { upsertServiceAction } from "@/lib/actions/admin";
import { prisma } from "@/lib/db";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    include: { _count: { select: { companies: true, leadRequests: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Taxonomie</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Servicii</h1>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <h2 className="text-xl font-bold text-slate-950">Adaugă serviciu</h2>
        <form action={upsertServiceAction} className="mt-5 grid gap-4 lg:grid-cols-2">
          <input name="name" placeholder="Nume serviciu" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <input name="slug" placeholder="Slug" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <input name="category" placeholder="Categorie" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <input name="shortName" placeholder="Nume scurt" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <textarea name="shortDescription" placeholder="Descriere scurtă" className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" />
          <textarea name="longDescription" placeholder="Descriere lungă" className="min-h-32 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" />
          <input name="seoTitle" placeholder="SEO title" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <input name="seoDescription" placeholder="SEO description" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <textarea name="seoIntro" placeholder="SEO intro" className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" />
          <button type="submit" className="h-12 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white lg:col-span-2">
            Salvează serviciul
          </button>
        </form>
      </section>

      <div className="grid gap-4">
        {services.map((service) => (
          <form
            key={service.id}
            action={upsertServiceAction}
            className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 lg:grid-cols-4"
          >
            <input type="hidden" name="id" value={service.id} />
            <input name="name" defaultValue={service.name} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="slug" defaultValue={service.slug} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="category" defaultValue={service.category ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="shortName" defaultValue={service.shortName ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <textarea name="shortDescription" defaultValue={service.shortDescription} className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" />
            <textarea name="longDescription" defaultValue={service.longDescription} className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" />
            <input name="seoTitle" defaultValue={service.seoTitle ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="seoDescription" defaultValue={service.seoDescription ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <textarea name="seoIntro" defaultValue={service.seoIntro ?? ""} className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm lg:col-span-2" />
            <button type="submit" className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Update</button>
            <div className="text-sm text-slate-500 lg:col-span-4">
              {service._count.companies} firme · {service._count.leadRequests} cereri
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
