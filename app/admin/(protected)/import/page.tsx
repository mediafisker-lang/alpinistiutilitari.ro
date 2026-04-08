import { runPlacesImportAction } from "@/lib/actions/admin";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function AdminImportPage() {
  const [runs, counties, cities] = await Promise.all([
    prisma.companyImportRun.findMany({
      include: { county: true, city: true, events: true },
      orderBy: { startedAt: "desc" },
    }),
    prisma.county.findMany({ orderBy: { name: "asc" } }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Google Places</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
          Import și sincronizare firme
        </h1>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <h2 className="text-xl font-bold text-slate-950">Cum rulezi importul</h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
          <p>Importul folosește Google Maps Platform Places API și nu scrapează HTML din Google Maps.</p>
          <p>Rulare locală:</p>
          <pre className="overflow-x-auto rounded-3xl bg-slate-950 p-4 text-slate-100">
            <code>npm run import:places -- --county=bucuresti</code>
          </pre>
          <p>Poți filtra după județ, oraș sau query liber în scriptul de import.</p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <h2 className="text-xl font-bold text-slate-950">Rulează importul din admin</h2>
        <form action={runPlacesImportAction} className="mt-5 grid gap-4 lg:grid-cols-3">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Județ</span>
            <input
              name="county"
              placeholder="Slug județ (ex: bucuresti)"
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Oraș</span>
            <input
              name="city"
              placeholder="Slug oraș (ex: brasov)"
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Query liber</span>
            <input
              name="query"
              placeholder="Ex: alpinism utilitar bucuresti"
              className="h-12 rounded-2xl border border-slate-200 px-4 text-sm"
            />
          </label>
          <Button type="submit" className="h-12 lg:col-span-3">Pornește importul</Button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <h2 className="text-xl font-bold text-slate-950">Import rapid pe județe populare</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Rulare rapidă pentru județele cu volum comercial ridicat, fără să completezi manual formularul.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {counties.slice(0, 10).map((county) => (
            <form key={county.id} action={runPlacesImportAction}>
              <input type="hidden" name="county" value={county.slug} />
              <Button type="submit" variant="secondary" className="rounded-full">
                Importă {county.name}
              </Button>
            </form>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <h2 className="text-xl font-bold text-slate-950">Query-uri recomandate</h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {[
            "alpinism utilitar bucuresti",
            "spalare geamuri la inaltime brasov",
            "toaletare copaci ilfov",
            "lucrari la inaltime cluj napoca",
          ].map((query) => (
            <form key={query} action={runPlacesImportAction} className="rounded-3xl border border-slate-200 p-4">
              <input type="hidden" name="query" value={query} />
              <p className="text-sm font-semibold text-slate-900">{query}</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">
                Util pentru descoperirea firmelor care apar în rezultate comerciale Google Places.
              </p>
              <Button type="submit" variant="secondary" className="mt-4 w-full">
                Rulează query
              </Button>
            </form>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Județe disponibile</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {counties.map((county) => (
                <span key={county.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {county.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-950">Orașe disponibile</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {cities.slice(0, 24).map((city) => (
                <span key={city.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {city.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4">
        {runs.map((run) => (
          <div
            key={run.id}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
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
              Găsite: {run.totalFound} · Importate: {run.totalImported} · Actualizate: {run.totalUpdated}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {run.events.length} evenimente legate de rulare · început la{" "}
              {new Intl.DateTimeFormat("ro-RO", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(run.startedAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
