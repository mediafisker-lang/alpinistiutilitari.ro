import Link from "next/link";
import { prisma } from "@/lib/db";
import { getFallbackCounties, getFallbackServices } from "@/lib/data/fallback";
import { Button } from "@/components/ui/button";

export async function SearchBar() {
  const [counties, cities, services] = await (async () => {
    try {
      return await Promise.all([
        prisma.county.findMany({ orderBy: { name: "asc" }, take: 10 }),
        prisma.city.findMany({ orderBy: { name: "asc" }, take: 30 }),
        prisma.service.findMany({ orderBy: { name: "asc" }, take: 10 }),
      ]);
    } catch {
      const fallbackCounties = getFallbackCounties();
      return [
        fallbackCounties,
        fallbackCounties.flatMap((county) => county.cities ?? []),
        getFallbackServices(),
      ];
    }
  })();

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/5">
      <form action="/firme" className="grid gap-3 xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
        <label className="space-y-2">
          <span className="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Căutare
          </span>
          <input
            name="q"
            placeholder="Serviciu, județ sau nume firmă"
            className="h-14 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-sky-300"
          />
        </label>
        <label className="space-y-2">
          <span className="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Județ
          </span>
          <select
            name="county"
            className="h-14 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-sky-300"
            defaultValue=""
          >
            <option value="">Toate judetele</option>
            {counties.map((county) => (
              <option key={county.id} value={county.slug}>
                {county.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Oraș
          </span>
          <select
            name="city"
            className="h-14 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-sky-300"
            defaultValue=""
          >
            <option value="">Toate orașele</option>
            {cities.map((city) => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Tip lucrare
          </span>
          <select
            name="service"
            className="h-14 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-sky-300"
            defaultValue=""
          >
            <option value="">Toate serviciile</option>
            {services.map((service) => (
              <option key={service.id} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
        </label>
        <Button className="h-14">Cauta</Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="font-medium text-slate-700">Cautari rapide:</span>
        <Link href="/bucuresti/reparatii-acoperisuri" className="hover:text-sky-700">
          reparatii acoperisuri Bucuresti
        </Link>
        <span>·</span>
        <Link href="/brasov/spalare-geamuri-la-inaltime" className="hover:text-sky-700">
          spalare geamuri Brasov
        </Link>
        <span>·</span>
        <Link href="/ilfov/toaletare-copaci" className="hover:text-sky-700">
          toaletare copaci Ilfov
        </Link>
      </div>
    </div>
  );
}
