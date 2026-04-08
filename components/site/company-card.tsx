import Link from "next/link";
import { Building2, Globe, MapPin, Phone, Star } from "lucide-react";
import type { CompanyCardData } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CompanyCardProps = {
  company: CompanyCardData;
  localBadge?: "direct" | "coverage";
  areaBadge?: "city" | "county";
};

export function CompanyCard({ company, localBadge, areaBadge }: CompanyCardProps) {
  const serviceCount = company.services.length;
  const isCityPriority = areaBadge === "city";
  const isCountyPriority = areaBadge === "county";

  return (
    <Card className="group flex h-full flex-col rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-sm shadow-slate-950/5 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/60">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {isCityPriority ? (
              <Badge className="border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-600">
                În orașul tău
              </Badge>
            ) : null}
            {!isCityPriority && isCountyPriority ? (
              <Badge className="border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-50">
                În județul tău
              </Badge>
            ) : null}
            <Badge className="bg-slate-100 text-slate-700">
              {company.verificationStatus === "verified" ? "Firma verificata" : "Profil activ"}
            </Badge>
            {company.isFeatured ? <Badge>Recomandată</Badge> : null}
            {localBadge === "direct" ? (
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                Potrivire directă
              </Badge>
            ) : null}
            {localBadge === "coverage" ? (
              <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100">
                Acoperă zona
              </Badge>
            ) : null}
          </div>
          <h3 className="text-xl font-bold text-slate-950">{company.name}</h3>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-sky-50 p-3 text-sky-700 shadow-inner">
          <Building2 className="size-5" />
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">{company.descriptionShort}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {company.services.slice(0, 3).map((item) => (
          <span
            key={item.id}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
          >
            {item.service.shortName ?? item.service.name}
          </span>
        ))}
      </div>

      <div className="mt-5 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <MapPin className="size-4 text-sky-700" />
          {company.city.name}, {company.county.name}
        </p>
        {typeof company.ratingValue === "number" ? (
          <p className="flex items-center gap-2">
            <Star className="size-4 text-amber-500" />
            {company.ratingValue.toFixed(1)} / 5
            {typeof company.ratingCount === "number" ? ` · ${company.ratingCount} recenzii` : ""}
          </p>
        ) : null}
        {company.phone ? (
          <p className="flex items-center gap-2">
            <Phone className="size-4 text-sky-700" />
            {company.phone}
          </p>
        ) : null}
        {company.website ? (
          <p className="flex items-center gap-2">
            <Globe className="size-4 text-sky-700" />
            Website disponibil
          </p>
        ) : null}
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
        {serviceCount} servicii asociate · profil local pentru {company.county.name}
      </div>

      <div className="mt-auto flex gap-3 pt-6">
        <Link href={`/firme/${company.slug}`} className="flex-1">
          <Button className="w-full">Vezi profilul</Button>
        </Link>
        <Link href={`/cere-oferta?company=${company.slug}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            Cere oferta
          </Button>
        </Link>
      </div>
    </Card>
  );
}
