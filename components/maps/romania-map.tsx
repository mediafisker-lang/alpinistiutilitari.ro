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

const labelNudges: Record<
  string,
  { dx?: number; dy?: number; countDx?: number; countDy?: number; tooltipDx?: number; tooltipDy?: number }
> = {
  bucuresti: { dx: 12, dy: 16, countDx: 12, countDy: 20, tooltipDx: 14, tooltipDy: 18 },
  ilfov: { dx: 12, dy: -10, countDx: 12, countDy: -2, tooltipDx: 16, tooltipDy: -6 },
  giurgiu: { dx: 12, dy: 18, countDx: 12, countDy: 26, tooltipDx: 12, tooltipDy: 18 },
  calarasi: { dx: 16, dy: 8, countDx: 16, countDy: 16, tooltipDx: 22, tooltipDy: 8 },
  ialomita: { dx: 18, dy: -2, countDx: 18, countDy: 8, tooltipDx: 24, tooltipDy: -6 },
  braila: { dx: 18, dy: -2, countDx: 18, countDy: 8, tooltipDx: 24, tooltipDy: -6 },
  galati: { dx: 20, dy: -2, countDx: 20, countDy: 8, tooltipDx: 26, tooltipDy: -6 },
  tulcea: { dx: 18, dy: 4, countDx: 18, countDy: 14, tooltipDx: 24, tooltipDy: 2 },
  constanta: { dx: 14, dy: 14, countDx: 14, countDy: 22, tooltipDx: 18, tooltipDy: 12 },
  covasna: { dx: 10, dy: 4, countDx: 10, countDy: 14 },
  vrancea: { dx: 10, dy: 4, countDx: 10, countDy: 14 },
  bacau: { dx: 8, dy: -4, countDx: 8, countDy: 8 },
  neamt: { dx: 8, dy: -4, countDx: 8, countDy: 8 },
  botosani: { dx: 12, dy: -4, countDx: 12, countDy: 8 },
  iasi: { dx: 14, dy: 0, countDx: 14, countDy: 10 },
  vaslui: { dx: 12, dy: 4, countDx: 12, countDy: 14 },
  sibiu: { dx: 8, dy: 2, countDx: 8, countDy: 12 },
  salaj: { dx: 8, dy: -2, countDx: 8, countDy: 10 },
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

function getDisplayLabel(county: CountyWithStats, isSmall: boolean) {
  if (isSmall && county.shortCode) {
    return [county.shortCode.toUpperCase()];
  }

  return getLabelLines(county.name);
}

function getPathCentroid(pathElement: SVGPathElement) {
  const totalLength = pathElement.getTotalLength();
  const sampleCount = 180;
  const points = Array.from({ length: sampleCount }, (_, index) => {
    const distance = (totalLength * index) / sampleCount;
    return pathElement.getPointAtLength(distance);
  });

  let twiceArea = 0;
  let centroidX = 0;
  let centroidY = 0;

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const factor = current.x * next.y - next.x * current.y;

    twiceArea += factor;
    centroidX += (current.x + next.x) * factor;
    centroidY += (current.y + next.y) * factor;
  }

  if (Math.abs(twiceArea) < 1) {
    const bbox = pathElement.getBBox();
    return {
      x: bbox.x + bbox.width / 2,
      y: bbox.y + bbox.height / 2,
      width: bbox.width,
      height: bbox.height,
    };
  }

  return {
    x: centroidX / (3 * twiceArea),
    y: centroidY / (3 * twiceArea),
    width: pathElement.getBBox().width,
    height: pathElement.getBBox().height,
  };
}

export function RomaniaMap({ counties }: RomaniaMapProps) {
  const visibleCounties = useMemo(() => getVisibleCounties(counties), [counties]);
  const strategicCounties = strategicCountySlugs
    .map((slug) => visibleCounties.find((county) => county.slug === slug))
    .filter((county): county is CountyWithStats => Boolean(county));
  const highlightedCountySlugs = new Set(strategicCounties.map((county) => county.slug));
  const [labelPositions, setLabelPositions] = useState<Record<string, LabelPosition>>({});
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});

  useEffect(() => {
    const nextPositions: Record<string, LabelPosition> = {};

    for (const county of visibleCounties) {
      const pathElement = pathRefs.current[county.slug];
      if (!pathElement) continue;

      nextPositions[county.slug] = getPathCentroid(pathElement);
    }

    setLabelPositions(nextPositions);
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
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Romania organizata pe judete
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Click pe județ și vezi rapid firmele listate din zonă.
            </p>
          </div>
        </div>
      </div>

      <div className="block p-3 sm:p-4">
        <div className="relative rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff,#eef6ff)] p-4 pb-20 sm:p-5 sm:pb-20">
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
              const nudge = labelNudges[county.slug] ?? {};
              const width = labelPosition.width ?? fallbackLayout.width ?? 70;
              const height = labelPosition.height ?? fallbackLayout.height ?? 44;
              const isTiny = width < 56 || height < 34;
              const isSmall = width < 72 || height < 44;
              const labelLines = getDisplayLabel(county, isSmall || isTiny);
              const topCities = (county.cities ?? []).slice(0, 3).map((city) => city.name).join(", ");
              const tooltipWidth = Math.max(150, Math.min(210, county.name.length * 10 + 64));
              const labelX = labelPosition.x + (nudge.dx ?? 0);
              const labelY = labelPosition.y + (nudge.dy ?? 0);
              const countX = labelPosition.x + (nudge.countDx ?? nudge.dx ?? 0);
              const countY = labelPosition.y + (nudge.countDy ?? 0);
              const tooltipX = labelPosition.x - tooltipWidth / 2 + (nudge.tooltipDx ?? 0);
              const tooltipY = Math.max(12, labelPosition.y - 104 + (nudge.tooltipDy ?? 0));
              const isHighlighted = highlightedCountySlugs.has(county.slug);
              const fillColor = getCountyColorByCount(count);
              const labelFontSize = isTiny ? 7.2 : isSmall ? 8 : 9.6;
              const countFontSize = isTiny ? 0 : isSmall ? 6.5 : 7.8;
              const lineGap = isTiny ? 7.2 : isSmall ? 8 : 9.5;
              const labelTopY = labelY - (labelLines.length > 1 ? lineGap / 1.3 : 1);
              const countTextY = countY + (labelLines.length > 1 ? lineGap * 1.35 : 10);
              const showCountOnMap = !isTiny;

              return (
                <a key={county.id} href={`/${county.slug}`} className="group">
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
                        x={countX}
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
                  <foreignObject
                    x={tooltipX}
                    y={tooltipY}
                    width={tooltipWidth}
                    height="86"
                    className="pointer-events-none hidden opacity-0 transition duration-200 lg:block group-hover:opacity-100"
                  >
                    <div className="rounded-2xl border border-sky-200 bg-white/95 px-3 py-2 text-center text-slate-950 shadow-2xl shadow-slate-300/60">
                      <div className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
                        {county.name}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-950">{count} firme</div>
                      {topCities ? (
                        <div className="mt-1 text-[11px] leading-4 text-slate-600">
                          {topCities}
                        </div>
                      ) : null}
                    </div>
                  </foreignObject>
                </a>
              );
            })}
          </svg>
          </div>

          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2 sm:inset-x-5 sm:bottom-5 lg:inset-x-auto lg:right-5 lg:max-w-[34rem] lg:items-end">
            <div className="rounded-2xl border border-white/70 bg-white/85 px-3 py-2 text-center text-xs leading-5 text-slate-500 shadow-lg backdrop-blur lg:text-left">
              Numerele din hartă folosesc aceeași bază de firme publicate și active.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/85 px-3 py-2 shadow-lg backdrop-blur lg:justify-end">
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
          </div>
        </div>
      </div>

    </Card>
  );
}
