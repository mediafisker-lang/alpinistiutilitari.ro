"use client";

import romania from "@svg-maps/romania";
import { MapPinned } from "lucide-react";
import { useMemo, useState } from "react";
import type { CountyWithStats } from "@/lib/data/types";
import { Card } from "@/components/ui/card";
import { slugify } from "@/lib/utils";

type RomaniaMapProps = {
  counties?: CountyWithStats[];
};

type RomaniaSvgLocation = {
  name: string;
  id: string;
  path: string;
};

const [VIEWBOX_WIDTH, VIEWBOX_HEIGHT] = romania.viewBox.split(" ").slice(2).map(Number);

const countLegend = [
  { label: "0-4 firme", color: "#BFDBFE" },
  { label: "5-14 firme", color: "#86EFAC" },
  { label: "15-29 firme", color: "#FDE047" },
  { label: "30+ firme", color: "#FB923C" },
] as const;

const strategicCountySlugs = ["bucuresti", "cluj", "brasov", "ilfov"] as const;

function getCountyCount(county: CountyWithStats) {
  return county.companyCount ?? county._count?.companies ?? 0;
}

function getVisibleCounties(counties?: CountyWithStats[]) {
  return [...(counties ?? [])].filter((county) => mapLocationBySlug.has(county.slug));
}

function getCountyColorByCount(count: number) {
  if (count >= 30) return countLegend[3].color;
  if (count >= 15) return countLegend[2].color;
  if (count >= 5) return countLegend[1].color;
  return countLegend[0].color;
}

const mapLocationBySlug = new Map(
  (romania.locations as RomaniaSvgLocation[]).map((location) => [slugify(location.name), location]),
);

export function RomaniaMap({ counties }: RomaniaMapProps) {
  const visibleCounties = useMemo(() => getVisibleCounties(counties), [counties]);
  const strategicCounties = strategicCountySlugs
    .map((slug) => visibleCounties.find((county) => county.slug === slug))
    .filter((county): county is CountyWithStats => Boolean(county));
  const highlightedCountySlugs = new Set(strategicCounties.map((county) => county.slug));
  const [selectedCountySlug, setSelectedCountySlug] = useState<string | null>(null);
  const selectedCounty = visibleCounties.find((county) => county.slug === selectedCountySlug);

  return (
    <Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-0 text-slate-950 shadow-xl shadow-slate-950/8">
      <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_42%),linear-gradient(180deg,#ffffff,#f8fbff)] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-3">
            <MapPinned className="size-6 text-sky-700" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
              Harta rapida
            </p>
            <h2 className="text-xl font-black leading-tight tracking-tight sm:text-2xl">
              Romania organizata pe judete
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Click pe județ și vezi rapid firmele listate din zonă.
            </p>
          </div>
        </div>
      </div>

      <div className="block p-3 sm:p-4">
        <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff,#eef6ff)] p-4 sm:p-5">
          <div className="mx-auto max-w-[960px]">
          <svg
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label="Harta Romaniei pe judete"
          >
            {visibleCounties.map((county) => {
              const count = getCountyCount(county);
              const mapLocation = mapLocationBySlug.get(county.slug);
              if (!mapLocation) return null;

              const topCities = (county.cities ?? []).slice(0, 3).map((city) => city.name).join(", ");
              const isHighlighted = highlightedCountySlugs.has(county.slug);
              const fillColor = getCountyColorByCount(count);

              return (
                <a
                  key={county.id}
                  href={`/${county.slug}`}
                  className="group cursor-pointer"
                  aria-label={`Selectează județul ${county.name}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setSelectedCountySlug(county.slug);
                  }}
                >
                  <title>{`${county.name} - ${count} firme${topCities ? ` - ${topCities}` : ""}`}</title>
                  <g
                    className="transition duration-200 ease-out group-hover:scale-[1.035] group-active:scale-[0.992]"
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <path
                      d={mapLocation.path}
                      fill={fillColor}
                      stroke={isHighlighted ? "#b45309" : "#1d4ed8"}
                      strokeWidth={isHighlighted ? "1.7" : "1.05"}
                      className="transition duration-200 group-hover:brightness-105 group-hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.32)]"
                    />
                    {isHighlighted ? (
                      <path
                        d={mapLocation.path}
                        fill="none"
                        stroke="#facc15"
                        strokeWidth="0.9"
                        strokeDasharray="3 2"
                        className="pointer-events-none opacity-80"
                      />
                    ) : null}
                  </g>
                </a>
              );
            })}
          </svg>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/85 px-3 py-2 shadow-lg backdrop-blur">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Legendă
              </span>
              {countLegend.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5"
                >
                  <span
                    className="size-3 rounded-full border border-slate-300"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium text-slate-600">{item.label}</span>
                </div>
              ))}
          </div>

          {selectedCounty ? (
            <div
              className="mt-4 rounded-2xl border border-sky-200 bg-white p-4 shadow-lg sm:flex sm:items-center sm:justify-between sm:gap-5"
              aria-live="polite"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                  Județ selectat
                </p>
                <h3 className="mt-1 text-lg font-black text-slate-950">{selectedCounty.name}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {getCountyCount(selectedCounty)} firme disponibile
                  {selectedCounty.cities?.length
                    ? ` · ${selectedCounty.cities.slice(0, 3).map((city) => city.name).join(", ")}`
                    : ""}
                </p>
              </div>
              <a
                href={`/${selectedCounty.slug}`}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#F97316] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#EA580C] sm:mt-0"
              >
                Vezi firmele din județ
              </a>
            </div>
          ) : null}
        </div>
      </div>

    </Card>
  );
}
