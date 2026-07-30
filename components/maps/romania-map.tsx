"use client";

import romania from "@svg-maps/romania";
import { MapPinned } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CountyWithStats } from "@/lib/data/types";
import { Card } from "@/components/ui/card";
import { slugify } from "@/lib/utils";

type RomaniaMapProps = {
  counties?: CountyWithStats[];
};

type CountyLayout = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

type RomaniaSvgLocation = {
  name: string;
  id: string;
  path: string;
};

type LabelPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const [VIEWBOX_WIDTH, VIEWBOX_HEIGHT] = romania.viewBox.split(" ").slice(2).map(Number);

const countyLayouts: Record<string, CountyLayout> = {
  "satu-mare": { x: 100, y: 50, width: 70, height: 38 },
  maramures: { x: 177, y: 42, width: 80, height: 42 },
  bihor: { x: 70, y: 105, width: 74, height: 48 },
  salaj: { x: 150, y: 90, width: 58, height: 38 },
  cluj: { x: 220, y: 107, width: 78, height: 48 },
  "bistrita-nasaud": { x: 294, y: 77, width: 66, height: 42 },
  suceava: { x: 430, y: 56, width: 88, height: 52 },
  botosani: { x: 515, y: 58, width: 60, height: 40 },
  iasi: { x: 512, y: 120, width: 68, height: 52 },
  vaslui: { x: 537, y: 185, width: 60, height: 54 },
  neamt: { x: 434, y: 121, width: 74, height: 46 },
  bacau: { x: 444, y: 182, width: 72, height: 48 },
  vrancea: { x: 480, y: 251, width: 60, height: 54 },
  galati: { x: 550, y: 285, width: 58, height: 52 },
  braila: { x: 520, y: 330, width: 64, height: 44 },
  tulcea: { x: 603, y: 299, width: 78, height: 62 },
  constanta: { x: 571, y: 379, width: 84, height: 58 },
  calarasi: { x: 493, y: 371, width: 70, height: 48 },
  ialomita: { x: 478, y: 322, width: 68, height: 44 },
  prahova: { x: 389, y: 269, width: 66, height: 46 },
  dambovita: { x: 338, y: 308, width: 68, height: 46 },
  arges: { x: 286, y: 280, width: 68, height: 48 },
  buzau: { x: 444, y: 276, width: 66, height: 44 },
  covasna: { x: 396, y: 214, width: 62, height: 40 },
  brasov: { x: 345, y: 230, width: 72, height: 52 },
  harghita: { x: 405, y: 170, width: 72, height: 50 },
  mures: { x: 329, y: 144, width: 74, height: 46 },
  sibiu: { x: 284, y: 209, width: 66, height: 42 },
  alba: { x: 237, y: 182, width: 70, height: 46 },
  hunedoara: { x: 176, y: 213, width: 80, height: 56 },
  arad: { x: 89, y: 147, width: 84, height: 54 },
  timis: { x: 85, y: 228, width: 90, height: 60 },
  "caras-severin": { x: 137, y: 307, width: 94, height: 70 },
  mehedinti: { x: 155, y: 351, width: 64, height: 38 },
  dolj: { x: 255, y: 364, width: 84, height: 56 },
  gorj: { x: 233, y: 307, width: 74, height: 46 },
  valcea: { x: 291, y: 290, width: 58, height: 46 },
  olt: { x: 322, y: 357, width: 62, height: 48 },
  teleorman: { x: 390, y: 405, width: 88, height: 60 },
  giurgiu: { x: 444, y: 399, width: 62, height: 42 },
  ilfov: { x: 409, y: 320, width: 45, height: 26 },
  bucuresti: { x: 424, y: 343, width: 36, height: 22 },
};

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
  return [...(counties ?? [])].filter((county) => county.slug in countyLayouts);
}

function getCountyColorByCount(count: number) {
  if (count >= 30) return countLegend[3].color;
  if (count >= 15) return countLegend[2].color;
  if (count >= 5) return countLegend[1].color;
  return countLegend[0].color;
}

function getLabelLines(name: string) {
  if (name.includes("-")) {
    return name.split("-").map((part) => part.toUpperCase());
  }

  const parts = name.split(" ");
  if (parts.length > 1) {
    return parts.map((part) => part.toUpperCase());
  }

  return [name.toUpperCase()];
}

const mapLocationBySlug = new Map(
  (romania.locations as RomaniaSvgLocation[]).map((location) => [slugify(location.name), location]),
);

function getDisplayLabel(county: CountyWithStats, width: number, height: number) {
  const lines = getLabelLines(county.name);
  const longestLine = Math.max(...lines.map((line) => line.length));
  const doesNotFit = longestLine * 5.2 > width * 0.82 || lines.length * 10 > height * 0.7;

  if ((width < 60 || height < 34 || doesNotFit) && county.shortCode) {
    return [county.shortCode.toUpperCase()];
  }

  return lines;
}

function getPathLabelPosition(pathElement: SVGPathElement): LabelPosition {
  const bbox = pathElement.getBBox();
  const center = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
  const gridSize = 17;
  let bestPoint = center;
  let bestScore = Number.NEGATIVE_INFINITY;

  if (typeof pathElement.isPointInFill !== "function") {
    return { ...center, width: bbox.width, height: bbox.height };
  }

  for (let row = 1; row < gridSize; row += 1) {
    for (let column = 1; column < gridSize; column += 1) {
      const x = bbox.x + (bbox.width * column) / gridSize;
      const y = bbox.y + (bbox.height * row) / gridSize;
      const point = new DOMPoint(x, y);
      if (!pathElement.isPointInFill(point)) continue;

      const edgeDistance = Math.min(
        x - bbox.x,
        bbox.x + bbox.width - x,
        y - bbox.y,
        bbox.y + bbox.height - y,
      );
      const centerDistance = Math.hypot(x - center.x, y - center.y);
      const score = edgeDistance - centerDistance * 0.12;

      if (score > bestScore) {
        bestScore = score;
        bestPoint = { x, y };
      }
    }
  }

  return {
    ...bestPoint,
    width: bbox.width,
    height: bbox.height,
  };
}

export function RomaniaMap({ counties }: RomaniaMapProps) {
  const visibleCounties = useMemo(() => getVisibleCounties(counties), [counties]);
  const strategicCounties = strategicCountySlugs
    .map((slug) => visibleCounties.find((county) => county.slug === slug))
    .filter((county): county is CountyWithStats => Boolean(county));
  const highlightedCountySlugs = new Set(strategicCounties.map((county) => county.slug));
  const [labelPositions, setLabelPositions] = useState<Record<string, LabelPosition>>({});
  const [selectedCountySlug, setSelectedCountySlug] = useState<string | null>(null);
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const selectedCounty = visibleCounties.find((county) => county.slug === selectedCountySlug);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const nextPositions: Record<string, LabelPosition> = {};

      for (const county of visibleCounties) {
        const pathElement = pathRefs.current[county.slug];
        if (!pathElement) continue;

        nextPositions[county.slug] = getPathLabelPosition(pathElement);
      }

      setLabelPositions(nextPositions);
    });

    return () => cancelAnimationFrame(frame);
  }, [visibleCounties]);

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

              const fallbackLayout = countyLayouts[county.slug];
              const measuredLayout = labelPositions[county.slug];
              const labelPosition = measuredLayout ?? {
                x: fallbackLayout.x,
                y: fallbackLayout.y,
                width: fallbackLayout.width ?? 70,
                height: fallbackLayout.height ?? 44,
              };
              const width = labelPosition.width ?? fallbackLayout.width ?? 70;
              const height = labelPosition.height ?? fallbackLayout.height ?? 44;
              const isTiny = width < 56 || height < 34;
              const isSmall = width < 72 || height < 44;
              const labelLines = getDisplayLabel(county, width, height);
              const topCities = (county.cities ?? []).slice(0, 3).map((city) => city.name).join(", ");
              const labelX = labelPosition.x;
              const labelY = labelPosition.y;
              const isHighlighted = highlightedCountySlugs.has(county.slug);
              const fillColor = getCountyColorByCount(count);
              const labelFontSize = isTiny ? 7.2 : isSmall ? 8 : 9.6;
              const countFontSize = isTiny ? 0 : isSmall ? 6.5 : 7.8;
              const lineGap = isTiny ? 7.2 : isSmall ? 8 : 9.5;
              const showCountOnMap = !isTiny;
              const rowCount = labelLines.length + (showCountOnMap ? 1 : 0);
              const labelTopY = labelY - ((rowCount - 1) * lineGap) / 2;
              const countTextY = labelTopY + labelLines.length * lineGap;

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
                      ref={(element) => {
                        pathRefs.current[county.slug] = element;
                      }}
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
                    <text
                      x={labelX}
                      y={labelTopY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="Arial, Helvetica, sans-serif"
                      fill="#0f172a"
                      className="pointer-events-none select-none font-black"
                      style={{ fontSize: `${labelFontSize}px` }}
                    >
                      {labelLines.map((line, index) => (
                        <tspan
                          key={`${county.slug}-${line}`}
                          x={labelX}
                          dy={index === 0 ? 0 : lineGap}
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                    {showCountOnMap ? (
                      <text
                        x={labelX}
                        y={countTextY}
                        textAnchor="middle"
                        fontFamily="Arial, Helvetica, sans-serif"
                        fill="#0f172a"
                        className="pointer-events-none select-none font-bold"
                        style={{ fontSize: `${countFontSize}px` }}
                      >
                        {count}
                      </text>
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
