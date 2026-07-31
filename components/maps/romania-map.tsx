"use client";

import romania from "@svg-maps/romania";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, Map, MapPinned, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { CountyWithStats } from "@/lib/data/types";
import { slugify } from "@/lib/utils";

type RomaniaMapProps = { counties?: CountyWithStats[] };
type RomaniaSvgLocation = { name: string; id: string; path: string };

const [VIEWBOX_WIDTH, VIEWBOX_HEIGHT] = romania.viewBox.split(" ").slice(2).map(Number);
const mapLocationBySlug = new globalThis.Map(
  (romania.locations as RomaniaSvgLocation[]).map((location) => [slugify(location.name), location]),
);
const popularSlugs = ["bucuresti", "ilfov", "cluj", "timis", "brasov", "iasi", "constanta", "prahova"];

function getCountyCount(county: CountyWithStats) {
  return county.companyCount ?? county._count?.companies ?? 0;
}

export function RomaniaMap({ counties = [] }: RomaniaMapProps) {
  const router = useRouter();
  const visibleCounties = useMemo(
    () => [...counties].filter((county) => mapLocationBySlug.has(county.slug)),
    [counties],
  );
  const popularCounties = popularSlugs
    .map((slug) => counties.find((county) => county.slug === slug))
    .filter((county): county is CountyWithStats => Boolean(county));
  const [selectedCounty, setSelectedCounty] = useState("");
  const companyTotal = counties.reduce((total, county) => total + getCountyCount(county), 0);

  function openSelectedCounty() {
    if (selectedCounty) router.push(`/${selectedCounty}`);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
      <div className="flex min-w-0 flex-col">
        <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#0063F7]">Acoperire națională</p>
        <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-[#102A43] sm:text-3xl">
          Alege rapid județul sau vezi toate județele
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Găsește firme de alpinism utilitar în orice colț al României.</p>

        <div className="mt-5 flex flex-1 flex-col rounded-2xl border border-[#DCE8F5] bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F8FD_100%)] p-3 shadow-[0_10px_28px_rgba(16,42,67,0.06)] sm:p-5">
          <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className="mx-auto h-auto w-full max-w-[470px]" role="img" aria-label="Hartă interactivă a României pe județe">
            {visibleCounties.map((county) => {
              const location = mapLocationBySlug.get(county.slug);
              if (!location) return null;
              const active = county.slug === selectedCounty;
              return (
                <a key={county.id} href={`/${county.slug}`} aria-label={`Vezi firmele din ${county.name}`} onClick={(event) => { event.preventDefault(); setSelectedCounty(county.slug); }} className="group">
                  <title>{`${county.name} · ${getCountyCount(county)} firme`}</title>
                  <path d={location.path} fill={active ? "#BBD6FF" : "#F4F8FF"} stroke={active ? "#0063F7" : "#8DB9F6"} strokeWidth={active ? "2" : "1.15"} className="cursor-pointer transition group-hover:fill-[#DCEAFF] group-hover:stroke-[#0063F7]" />
                </a>
              );
            })}
          </svg>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#DCE8F5] pt-3 text-[0.68rem] font-semibold text-slate-500">
            <span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-[#0063F7]" />Acoperire în toată România</span>
            <span>{counties.length} județe și București</span>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4 lg:pt-9">
        <div className="rounded-2xl border border-[#DCE8F5] bg-white p-4 shadow-[0_10px_28px_rgba(16,42,67,0.06)] sm:p-5">
          <label htmlFor="homepage-county" className="text-xs font-extrabold text-[#102A43]">Alege județul</label>
          <div className="mt-2 flex overflow-hidden rounded-xl border border-[#DCE8F5] bg-white focus-within:border-[#0063F7]">
            <select id="homepage-county" value={selectedCounty} onChange={(event) => setSelectedCounty(event.target.value)} className="h-12 min-w-0 flex-1 appearance-none bg-transparent px-4 text-sm font-medium text-slate-600 outline-none">
              <option value="">Selectează județul</option>
              {counties.map((county) => <option key={county.id} value={county.slug}>{county.name}</option>)}
            </select>
            <button type="button" onClick={openSelectedCounty} disabled={!selectedCounty} aria-label="Deschide județul selectat" className="flex w-12 items-center justify-center border-l border-[#DCE8F5] text-[#0063F7] transition hover:bg-[#EEF5FF] disabled:text-slate-300"><Search className="size-4" /></button>
          </div>

          <p className="mt-5 text-xs font-extrabold text-[#102A43]">Județe populare</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {popularCounties.map((county) => (
              <Link key={county.id} href={`/${county.slug}`} className="flex min-h-11 items-center justify-between rounded-xl border border-[#E2EBF5] px-3 text-xs font-bold text-[#334E68] transition hover:border-[#8DB9F6] hover:bg-[#F4F8FF] hover:text-[#0063F7]">
                {county.name}<ArrowRight className="size-3.5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#DCE8F5] bg-white p-4 shadow-[0_10px_28px_rgba(16,42,67,0.06)] sm:p-5">
          <p className="text-xs font-extrabold text-[#102A43]">Toate județele</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {counties.slice(0, 14).map((county) => <Link key={county.id} href={`/${county.slug}`} title={county.name} className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#DCE8F5] bg-[#F8FBFF] text-[0.62rem] font-extrabold uppercase text-[#365A7D] transition hover:border-[#0063F7] hover:text-[#0063F7]">{county.name.slice(0, 2)}</Link>)}
            <Link href="/judete" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#DCE8F5] text-xs font-black text-[#0063F7]">•••</Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/judete" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#082F55] px-5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(8,47,85,0.16)] transition hover:bg-[#0B416F]"><MapPinned className="size-4" />Vezi toate județele</Link>
          <Link href="/judete" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#FF6B0B] bg-white px-5 text-sm font-extrabold text-[#FF6B0B] transition hover:bg-[#FFF7F1]"><Map className="size-4" />Vezi harta completă</Link>
        </div>

        <div className="grid gap-3 rounded-2xl border border-[#DCE8F5] bg-white p-4 sm:grid-cols-3">
          {[
            { icon: MapPinned, title: "Acoperire națională", detail: `${counties.length} județe și București` },
            { icon: ShieldCheck, title: "Firme verificate", detail: "Selecție riguroasă" },
            { icon: Clock3, title: "Găsești rapid", detail: `${companyTotal} firme locale` },
          ].map((item) => <div key={item.title} className="flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#8DB9F6] text-[#164B8A]"><item.icon className="size-4" /></span><div><p className="text-[0.68rem] font-extrabold text-[#102A43]">{item.title}</p><p className="mt-0.5 text-[0.58rem] text-slate-500">{item.detail}</p></div></div>)}
        </div>
      </div>
    </div>
  );
}
