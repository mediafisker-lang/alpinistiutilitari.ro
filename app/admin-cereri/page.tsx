import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { lockPublicLeadsAction, unlockPublicLeadsAction } from "@/lib/actions/public-leads";
import { hasPublicLeadsAccess } from "@/lib/public-leads-access";

export const metadata: Metadata = {
  title: "Admin cereri | AlpinistiUtilitari.ro",
  description: "Vizualizare internă a tuturor cererilor trimise din formular.",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminCereriPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminCereriPage({ searchParams }: AdminCereriPageProps) {
  const params = await searchParams;
  const isUnlocked = await hasPublicLeadsAccess();

  if (!isUnlocked) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12 sm:px-6">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Admin cereri
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Acces cu parolă
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Introdu parola pentru a vedea toate cererile trimise din formular.
          </p>

          <form action={unlockPublicLeadsAction} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Parolă
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-sky-300"
                required
              />
            </div>

            {params.error ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {params.error}
              </p>
            ) : null}

            <button
              type="submit"
              className="h-12 w-full rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Vezi cererile
            </button>
          </form>
        </div>
      </div>
    );
  }

  const leads = await prisma.leadRequest.findMany({
    include: {
      county: true,
      city: true,
      service: true,
      company: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Admin cereri
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Toate cererile trimise
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Cererile sunt listate automat în ordine descrescătoare după data și ora trimiterii.
          </p>
        </div>

        <form action={lockPublicLeadsAction}>
          <button
            type="submit"
            className="h-11 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
          >
            Ieșire
          </button>
        </form>
      </div>

      <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-4 font-medium">Nume client</th>
              <th className="px-4 py-4 font-medium">Telefon</th>
              <th className="px-4 py-4 font-medium">Serviciu</th>
              <th className="px-4 py-4 font-medium">Localizare</th>
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 font-medium">Data și ora</th>
            </tr>
          </thead>
          <tbody>
            {leads.length ? (
              leads.map((lead) => (
                <tr key={lead.id} className="border-t border-slate-100">
                  <td className="px-4 py-4 font-semibold text-slate-900">{lead.fullName}</td>
                  <td className="px-4 py-4 text-slate-700">{lead.phone}</td>
                  <td className="px-4 py-4 text-slate-700">
                    {lead.serviceText ?? lead.service?.name ?? "Nespecificat"}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {(lead.cityText ?? lead.city?.name ?? "Localitate neprecizată")},{" "}
                    {lead.countyText ?? lead.county?.name ?? "Județ neprecizat"}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {lead.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{formatDate(lead.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  Nu există cereri înregistrate încă.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

