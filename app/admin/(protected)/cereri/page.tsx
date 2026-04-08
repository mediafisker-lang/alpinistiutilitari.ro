import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

type CereriPageProps = {
  searchParams: Promise<{
    status?: string;
    countyId?: string;
    cityId?: string;
    serviceId?: string;
  }>;
};

export default async function AdminCereriPage({ searchParams }: CereriPageProps) {
  const params = await searchParams;
  const [counties, cities, services, leads] = await Promise.all([
    prisma.county.findMany({ orderBy: { name: "asc" } }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.service.findMany({ orderBy: { name: "asc" } }),
    prisma.leadRequest.findMany({
      where: {
        status: params.status as never,
        countyId: params.countyId || undefined,
        cityId: params.cityId || undefined,
        serviceId: params.serviceId || undefined,
      },
      include: {
        county: true,
        city: true,
        service: true,
        company: true,
        selections: { include: { company: true } },
        images: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Cereri</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          Cereri de ofertă în platformă
        </h1>
      </div>

      <form className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 lg:grid-cols-5">
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="h-12 rounded-2xl border border-slate-200 px-4 text-sm"
        >
          <option value="">Toate statusurile</option>
          <option value="noua">Nouă</option>
          <option value="in_analiza">În analiză</option>
          <option value="executanti_contactati">Executanți contactați</option>
          <option value="client_contactat">Client contactat</option>
          <option value="ofertare_in_curs">Ofertare în curs</option>
          <option value="finalizata">Finalizată</option>
          <option value="inchisa">Închisă</option>
          <option value="respinsa">Respinsă</option>
        </select>
        <select
          name="countyId"
          defaultValue={params.countyId ?? ""}
          className="h-12 rounded-2xl border border-slate-200 px-4 text-sm"
        >
          <option value="">Toate județele</option>
          {counties.map((county) => (
            <option key={county.id} value={county.id}>
              {county.name}
            </option>
          ))}
        </select>
        <select
          name="cityId"
          defaultValue={params.cityId ?? ""}
          className="h-12 rounded-2xl border border-slate-200 px-4 text-sm"
        >
          <option value="">Toate orașele</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <select
          name="serviceId"
          defaultValue={params.serviceId ?? ""}
          className="h-12 rounded-2xl border border-slate-200 px-4 text-sm"
        >
          <option value="">Toate serviciile</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-12 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white"
        >
          Filtrează
        </button>
      </form>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-4 font-medium">Client</th>
              <th className="px-4 py-4 font-medium">Serviciu</th>
              <th className="px-4 py-4 font-medium">Zonă</th>
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-slate-100">
                <td className="px-4 py-4">
                  <Link href={`/admin/cereri/${lead.id}`} className="font-semibold text-slate-950 hover:text-sky-700">
                    {lead.fullName}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">{lead.phone}</p>
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {lead.serviceText ?? lead.service?.name ?? "Nespecificat"}
                  {lead.selections.length ? (
                    <p className="mt-1 text-xs text-slate-500">
                      {lead.selections.length} firme selectate
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {lead.cityText ?? lead.city?.name ?? "-"},{" "}
                  {lead.countyText ?? lead.county?.name ?? "-"}
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {lead.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-500">{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
