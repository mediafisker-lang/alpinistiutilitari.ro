import { prisma } from "@/lib/db";

export default async function AdminSeoPage() {
  const [counties, cities, services, companies, articles] = await Promise.all([
    prisma.county.count({ where: { isActive: true } }),
    prisma.city.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.company.count({ where: { isPublished: true, isActive: true } }),
    prisma.article.count({ where: { isPublished: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">SEO</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          Control SEO și status de indexare
        </h1>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Județe active", value: counties },
          { label: "Orașe active", value: cities },
          { label: "Servicii active", value: services },
          { label: "Firme publicate", value: companies },
          { label: "Articole publicate", value: articles },
        ].map((item) => (
          <div key={item.label} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-black text-slate-950">{item.value}</p>
          </div>
        ))}
      </section>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
        <h2 className="text-2xl font-bold text-slate-950">Unde se editează SEO-ul</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            Județele, orașele, serviciile, firmele și articolele au deja câmpuri SEO dedicate în formularele lor de administrare.
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            Indexarea este controlată de conținutul real și de statusul activ/publicat, plus de regulile din sitemap-uri și metadata dinamică.
          </div>
        </div>
      </div>
    </div>
  );
}
