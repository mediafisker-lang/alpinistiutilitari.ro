import { prisma } from "@/lib/db";
import { upsertFaqAction } from "@/lib/actions/admin";

export default async function AdminFaqPage() {
  const [faqs, counties, cities, services, articles] = await Promise.all([
    prisma.fAQ.findMany({
      include: { county: true, city: true, service: true, article: true },
      orderBy: [{ pageType: "asc" }, { sortOrder: "asc" }, { updatedAt: "desc" }],
    }),
    prisma.county.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.city.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.service.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.article.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">FAQ</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          Întrebări frecvente pentru paginile SEO
        </h1>
      </div>

      <form action={upsertFaqAction} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 xl:grid-cols-2">
        <input name="pageType" placeholder="pageType: county, city, service, company, article" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
        <input name="pageRefId" placeholder="pageRefId opțional" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
        <select name="countyId" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm">
          <option value="">Fără județ</option>
          {counties.map((county) => <option key={county.id} value={county.id}>{county.name}</option>)}
        </select>
        <select name="cityId" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm">
          <option value="">Fără oraș</option>
          {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
        </select>
        <select name="serviceId" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm">
          <option value="">Fără serviciu</option>
          {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
        </select>
        <select name="articleId" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm">
          <option value="">Fără articol</option>
          {articles.map((article) => <option key={article.id} value={article.id}>{article.title}</option>)}
        </select>
        <input name="sortOrder" type="number" min="0" defaultValue="0" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
        <input name="question" placeholder="Întrebare" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm xl:col-span-2" />
        <textarea name="answer" placeholder="Răspuns" className="min-h-32 rounded-3xl border border-slate-200 px-4 py-3 text-sm xl:col-span-2" />
        <button type="submit" className="h-12 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white xl:col-span-2">
          Salvează FAQ
        </button>
      </form>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-4 font-medium">Întrebare</th>
              <th className="px-4 py-4 font-medium">Tip pagină</th>
              <th className="px-4 py-4 font-medium">Legături</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-950">{faq.question}</p>
                  <p className="mt-2 line-clamp-2 text-slate-600">{faq.answer}</p>
                </td>
                <td className="px-4 py-4 text-slate-700">{faq.pageType ?? "-"}</td>
                <td className="px-4 py-4 text-slate-500">
                  {[faq.county?.name, faq.city?.name, faq.service?.name, faq.article?.title].filter(Boolean).join(" · ") || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
