import type { Metadata } from "next";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  deleteSelectedPublicLeadsAction,
  lockPublicLeadsAction,
  unlockPublicLeadsAction,
} from "@/lib/actions/public-leads";
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
  searchParams: Promise<{ error?: string; success?: string; date?: string }>;
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

  const selectedDate = params.date?.trim() ?? "";
  const where: Prisma.LeadRequestWhereInput = {};
  if (/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
    const dayStart = new Date(`${selectedDate}T00:00:00`);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    where.createdAt = { gte: dayStart, lt: dayEnd };
  }

  const leads = await prisma.leadRequest.findMany({
    where,
    select: {
      id: true,
      createdAt: true,
      fullName: true,
      phone: true,
      description: true,
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
            Cererile sunt listate în ordine descrescătoare după data și ora trimiterii.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <form method="get" className="flex flex-wrap items-end gap-2">
            <div>
              <label
                htmlFor="date"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
              >
                Filtru dată
              </label>
              <input
                id="date"
                name="date"
                type="date"
                defaultValue={selectedDate}
                className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-sky-300"
              />
            </div>
            <button
              type="submit"
              className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              Filtrează
            </button>
            {selectedDate ? (
              <Link
                href="/admin-cereri"
                className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold leading-10 text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                Resetează
              </Link>
            ) : null}
          </form>

          <form action={lockPublicLeadsAction}>
            <button
              type="submit"
              className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              Ieșire
            </button>
          </form>
        </div>
      </div>

      {params.error ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {params.error}
        </p>
      ) : null}

      {params.success ? (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {params.success}
        </p>
      ) : null}

      <form action={deleteSelectedPublicLeadsAction} className="mt-6 space-y-4">
        <input type="hidden" name="date" value={selectedDate} />

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Selectează cererile pe care vrei să le ștergi
          </p>
          <button
            type="submit"
            className="h-10 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
          >
            Șterge selectate
          </button>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-4 font-medium">Selectează</th>
                <th className="px-4 py-4 font-medium">Data și ora</th>
                <th className="px-4 py-4 font-medium">Nume</th>
                <th className="px-4 py-4 font-medium">Mesaj</th>
                <th className="px-4 py-4 font-medium">Telefon</th>
              </tr>
            </thead>
            <tbody>
              {leads.length ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 text-slate-700">
                      <input
                        type="checkbox"
                        name="leadIds"
                        value={lead.id}
                        className="size-4 rounded border-slate-300 text-sky-700 focus:ring-sky-300"
                      />
                    </td>
                    <td className="px-4 py-4 text-slate-700">{formatDate(lead.createdAt)}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{lead.fullName}</td>
                    <td className="px-4 py-4 text-slate-700">{lead.description}</td>
                    <td className="px-4 py-4 text-slate-700">{lead.phone}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                    Nu există cereri înregistrate încă.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
}
