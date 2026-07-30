import Link from "next/link";
import type { City, County } from "@prisma/client";
import { Card } from "@/components/ui/card";

type CountyCardCounty = County & {
  cities?: City[];
};

export function CountyCard({
  county,
  count,
}: {
  county: CountyCardCounty;
  count?: number;
}) {
  const topCities = county.cities?.slice(0, 4) ?? [];

  return (
    <Link href={`/${county.slug}`}>
      <Card className="ui-card-hover flex h-full flex-col rounded-2xl border border-[#DCE4E9] bg-white p-6 shadow-[0_12px_32px_rgba(16,42,67,0.07)] transition">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#176B87]">
          Județ
        </p>
        <h3 className="mt-3 text-xl font-extrabold text-[#102A43]">{county.name}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {county.intro ?? "Vezi firme, localitati importante si servicii relevante."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">Pagini locale</span>
          {county.shortCode ? (
            <span className="rounded-full bg-[#E8F0F3] px-3 py-1 text-[#176B87]">{county.shortCode}</span>
          ) : null}
        </div>
        {topCities.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {topCities.map((city) => (
              <span
                key={city.id}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
              >
                {city.name}
              </span>
            ))}
          </div>
        ) : null}
        {typeof count === "number" ? (
          <p className="mt-5 text-sm font-semibold text-slate-900">{count} firme</p>
        ) : null}
      </Card>
    </Link>
  );
}
