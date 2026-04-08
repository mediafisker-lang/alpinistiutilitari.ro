import Link from "next/link";
import { getAdminDashboardData } from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";
import { AdminDashboardWidgets } from "@/components/admin/dashboard-widgets";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Panou intern
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          Dashboard administrare
        </h1>
      </div>

      <AdminDashboardWidgets stats={data.stats} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                Cereri recente
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Ultimele lead-uri</h2>
            </div>
            <Link href="/admin/cereri" className="text-sm font-semibold text-sky-700">
              Vezi toate
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {data.latestLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/cereri/${lead.id}`}
                className="block rounded-3xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{lead.fullName}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {lead.serviceText ?? lead.service?.name ?? "Serviciu nespecificat"} ·{" "}
                      {lead.cityText ?? lead.city?.name ?? "Oraș"} ·{" "}
                      {lead.countyText ?? lead.county?.name ?? "Județ"}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {lead.status.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-slate-600">{lead.description}</p>
                <p className="mt-3 text-xs text-slate-500">{formatDate(lead.createdAt)}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Importuri Google Places
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Istoric importuri</h2>
          <div className="mt-6 space-y-4">
            {data.recentImports.length ? (
              data.recentImports.map((run) => (
                <div key={run.id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{run.source}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {run.query ?? run.city?.name ?? run.county?.name ?? "Import general"}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {run.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Găsite: {run.totalFound} · Importate: {run.totalImported} · Actualizate:{" "}
                    {run.totalUpdated}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-3xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                Nu există încă importuri rulate.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
