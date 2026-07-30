import type { Metadata } from "next";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  lockPublicLeadsAction,
  unlockPublicLeadsAction,
  type CompactLeadStatus,
} from "@/lib/actions/public-leads";
import { hasPublicLeadsAccess } from "@/lib/public-leads-access";
import {
  PublicLeadsManager,
  type PublicLeadRow,
} from "@/components/admin/public-leads-manager";

export const metadata: Metadata = {
  title: "Cereri primite | AlpinistiUtilitari.ro",
  description: "Administrare internă a cererilor trimise din formular.",
  robots: { index: false, follow: false },
};

const inProgressStatuses = [
  "in_lucru",
  "in_analiza",
  "executanti_contactati",
  "client_contactat",
  "ofertare_in_curs",
] as const;
const resolvedStatuses = ["rezolvata", "finalizata", "inchisa", "respinsa"] as const;

type AdminCereriPageProps = {
  searchParams: Promise<{
    error?: string;
    q?: string;
    county?: string;
    date?: string;
    status?: string;
    perPage?: string;
    page?: string;
  }>;
};

function normalizeStatus(status: string): CompactLeadStatus {
  if (resolvedStatuses.includes(status as (typeof resolvedStatuses)[number])) return "rezolvata";
  if (inProgressStatuses.includes(status as (typeof inProgressStatuses)[number])) return "in_lucru";
  return "noua";
}

function formatRomanianDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    timeZone: "Europe/Bucharest",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(",", "");
}

function bucharestMidnight(dateValue: string) {
  const utcGuess = new Date(`${dateValue}T00:00:00.000Z`);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(utcGuess);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  const localTimeAsUtc = Date.UTC(
    value("year"),
    value("month") - 1,
    value("day"),
    value("hour"),
    value("minute"),
    value("second"),
  );
  return new Date(utcGuess.getTime() - (localTimeAsUtc - utcGuess.getTime()));
}

function pageHref(
  params: Awaited<AdminCereriPageProps["searchParams"]>,
  page: number,
) {
  const query = new URLSearchParams();
  for (const key of ["q", "county", "date", "status", "perPage"] as const) {
    const value = params[key]?.trim();
    if (value) query.set(key, value);
  }
  query.set("page", String(page));
  return `/admin-cereri?${query.toString()}`;
}

export default async function AdminCereriPage({ searchParams }: AdminCereriPageProps) {
  const params = await searchParams;
  const isUnlocked = await hasPublicLeadsAccess();

  if (!isUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center px-3 py-8">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-700">
            AlpinistiUtilitari.ro
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Administrare cereri
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Introdu parola pentru acces la cererile clienților.
          </p>
          <form action={unlockPublicLeadsAction} className="mt-5 space-y-3">
            <label htmlFor="password" className="sr-only">
              Parolă
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Parolă"
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-sky-400"
              required
            />
            {params.error ? (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{params.error}</p>
            ) : null}
            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Vezi cererile
            </button>
          </form>
        </div>
      </div>
    );
  }

  const q = params.q?.trim() ?? "";
  const countyId = params.county?.trim() ?? "";
  const selectedDate = params.date?.trim() ?? "";
  const selectedStatus = ["noua", "in_lucru", "rezolvata"].includes(params.status ?? "")
    ? params.status!
    : "";
  const requestedPerPage = Number(params.perPage ?? "50");
  const perPage = [25, 50, 100].includes(requestedPerPage) ? requestedPerPage : 50;
  const requestedPage = Math.max(1, Number(params.page ?? "1") || 1);

  const where: Prisma.LeadRequestWhereInput = {};
  const combinedFilters: Prisma.LeadRequestWhereInput[] = [];
  if (q) {
    combinedFilters.push({
      OR: [
        { fullName: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (countyId === "national") {
    combinedFilters.push({
      OR: [
        { countyId: null },
        { countyText: { equals: "National", mode: "insensitive" } },
      ],
    });
  } else if (countyId) {
    where.countyId = countyId;
  }
  if (combinedFilters.length) where.AND = combinedFilters;
  if (/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
    const start = bucharestMidnight(selectedDate);
    const nextDate = new Date(`${selectedDate}T00:00:00.000Z`);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    const end = bucharestMidnight(nextDate.toISOString().slice(0, 10));
    where.createdAt = { gte: start, lt: end };
  }
  if (selectedStatus === "noua") {
    where.status = "noua";
  } else if (selectedStatus === "in_lucru") {
    where.status = { in: [...inProgressStatuses] } as Prisma.EnumLeadRequestStatusFilter;
  } else if (selectedStatus === "rezolvata") {
    where.status = { in: [...resolvedStatuses] } as Prisma.EnumLeadRequestStatusFilter;
  }

  const [counties, totalFiltered, newCount, inProgressCount, totalCount] = await Promise.all([
    prisma.county.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.leadRequest.count({ where }),
    prisma.leadRequest.count({ where: { status: "noua" } }),
    prisma.leadRequest.count({
      where: {
        status: { in: [...inProgressStatuses] } as Prisma.EnumLeadRequestStatusFilter,
      },
    }),
    prisma.leadRequest.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage));
  const currentPage = Math.min(requestedPage, totalPages);
  const leads = await prisma.leadRequest.findMany({
    where,
    select: {
      id: true,
      createdAt: true,
      fullName: true,
      phone: true,
      description: true,
      status: true,
      countyId: true,
      countyText: true,
      county: { select: { name: true, shortCode: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * perPage,
    take: perPage,
  });

  const rows: PublicLeadRow[] = leads.map((lead) => {
    const isNational = lead.countyText?.toLowerCase() === "national" || !lead.countyId;
    return {
      id: lead.id,
      createdAt: formatRomanianDate(lead.createdAt),
      fullName: lead.fullName,
      phone: lead.phone,
      description: lead.description,
      countyLabel: isNational ? "Național" : lead.county?.name ?? lead.countyText ?? "Județ",
      countyCode: isNational ? "N" : lead.county?.shortCode ?? "J",
      status: normalizeStatus(lead.status),
    };
  });

  const firstShown = totalFiltered ? (currentPage - 1) * perPage + 1 : 0;
  const lastShown = Math.min(currentPage * perPage, totalFiltered);

  return (
    <div className="min-h-screen px-2 py-2.5 sm:px-3 lg:px-4">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 pb-2">
        <div className="mr-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-700">
            AlpinistiUtilitari.ro
          </p>
          <h1 className="text-2xl font-black tracking-tight text-slate-950">Cereri primite</h1>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 font-semibold text-blue-700">
            Noi: {newCount}
          </span>
          <span className="rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1.5 font-semibold text-orange-700">
            În lucru: {inProgressCount}
          </span>
          <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-700">
            Total: {totalCount}
          </span>
        </div>
        <form action={lockPublicLeadsAction}>
          <button
            type="submit"
            className="h-8 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Ieșire
          </button>
        </form>
      </header>

      <details className="group mt-2 rounded-xl border border-slate-200 bg-white lg:border-0 lg:bg-transparent" open>
        <summary className="cursor-pointer list-none px-3 py-2 text-xs font-bold text-slate-700 lg:hidden">
          Filtre
        </summary>
        <form className="grid gap-2 border-t border-slate-100 p-2 lg:grid-cols-[minmax(210px,1.5fr)_minmax(150px,1fr)_150px_140px_105px_auto_auto] lg:border-0 lg:p-0">
          <input
            name="q"
            defaultValue={q}
            placeholder="Nume, telefon sau mesaj"
            className="h-9 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-sky-400"
          />
          <select
            name="county"
            defaultValue={countyId}
            className="h-9 min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs"
          >
            <option value="">Toate județele</option>
            <option value="national">Național</option>
            {counties.map((county) => (
              <option key={county.id} value={county.id}>
                {county.name}
              </option>
            ))}
          </select>
          <input
            name="date"
            type="date"
            defaultValue={selectedDate}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs"
          />
          <select
            name="status"
            defaultValue={selectedStatus}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs"
          >
            <option value="">Toate statusurile</option>
            <option value="noua">Nouă</option>
            <option value="in_lucru">În lucru</option>
            <option value="rezolvata">Rezolvată</option>
          </select>
          <select
            name="perPage"
            defaultValue={String(perPage)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs"
          >
            <option value="25">25 / pagină</option>
            <option value="50">50 / pagină</option>
            <option value="100">100 / pagină</option>
          </select>
          <button
            type="submit"
            className="h-9 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Aplică
          </button>
          <Link
            href="/admin-cereri"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Resetează filtrele
          </Link>
        </form>
      </details>

      {params.error ? (
        <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{params.error}</p>
      ) : null}

      <section className="mt-2">
        <PublicLeadsManager leads={rows} />
      </section>

      <footer className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-2 text-xs text-slate-600">
        <p>
          Afișate {firstShown}-{lastShown} din {totalFiltered} cereri
        </p>
        <nav className="flex items-center gap-1.5" aria-label="Paginare cereri">
          {currentPage > 1 ? (
            <Link
              href={pageHref(params, currentPage - 1)}
              className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 font-semibold hover:bg-slate-50"
            >
              Anterioară
            </Link>
          ) : (
            <span className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-slate-400">
              Anterioară
            </span>
          )}
          <span className="px-2 font-semibold text-slate-800">
            Pagina {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Link
              href={pageHref(params, currentPage + 1)}
              className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 font-semibold hover:bg-slate-50"
            >
              Următoarea
            </Link>
          ) : (
            <span className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-slate-400">
              Următoarea
            </span>
          )}
        </nav>
      </footer>
    </div>
  );
}
