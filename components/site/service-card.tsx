import Link from "next/link";
import type { Service } from "@prisma/client";
import {
  Anchor,
  ArrowRight,
  Building2,
  Camera,
  Construction,
  Droplets,
  Factory,
  Fan,
  Hammer,
  Megaphone,
  Mountain,
  PaintRoller,
  RadioTower,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Sun,
  TreePine,
  Users,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";

function ServiceIcon({ service }: { service: Pick<Service, "slug" | "category"> }) {
  const value = `${service.slug} ${service.category ?? ""}`.toLowerCase();
  const props = { className: "size-6", strokeWidth: 1.8 };
  if (value.includes("arb") || value.includes("copac")) return <TreePine {...props} />;
  if (value.includes("iarna") || value.includes("zapada") || value.includes("turtur")) return <Snowflake {...props} />;
  if (value.includes("solar")) return <Sun {...props} />;
  if (value.includes("eolian")) return <Wind {...props} />;
  if (value.includes("portuar") || value.includes("naval")) return <Anchor {...props} />;
  if (value.includes("foto-video") || value.includes("inspect")) return <Camera {...props} />;
  if (value.includes("public") || value.includes("banner") || value.includes("mesh")) return <Megaphone {...props} />;
  if (value.includes("antena") || value.includes("pilon") || value.includes("catarg")) return <RadioTower {...props} />;
  if (value.includes("paratrasnet")) return <Zap {...props} />;
  if (value.includes("aer-conditionat")) return <Fan {...props} />;
  if (value.includes("curata") || value.includes("spalare")) return <Sparkles {...props} />;
  if (value.includes("hidro") || value.includes("infiltrat") || value.includes("etans")) return <Droplets {...props} />;
  if (value.includes("vops")) return <PaintRoller {...props} />;
  if (value.includes("protect") || value.includes("siguranta") || value.includes("viata")) return <ShieldCheck {...props} />;
  if (value.includes("industrial") || value.includes("siloz") || value.includes("hala")) return <Factory {...props} />;
  if (value.includes("montaj") || value.includes("structur") || value.includes("tubul")) return <Construction {...props} />;
  if (value.includes("repar") || value.includes("tencuiala") || value.includes("fatad")) return <Hammer {...props} />;
  if (value.includes("acoperis") || value.includes("jgheab")) return <Building2 {...props} />;
  if (value.includes("alpinism")) return <Mountain {...props} />;
  return <Wrench {...props} />;
}

export function ServiceCard({
  service,
  count,
  href,
}: {
  service: Service;
  count?: number;
  href?: string;
}) {
  return (
    <Link href={href ?? `/servicii/${service.slug}`} className="block h-full">
      <Card className="ui-card-hover group flex h-full min-h-[245px] flex-col rounded-2xl border border-[#DCE4E9] bg-white p-5 shadow-[0_10px_28px_rgba(16,42,67,0.06)] transition sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF5FF] text-[#0063F7] ring-1 ring-[#DCE9FF] transition group-hover:bg-[#0063F7] group-hover:text-white">
            <ServiceIcon service={service} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#0063F7]">
              Serviciu la înălțime
            </p>
            <h3 className="mt-2 text-lg font-extrabold leading-tight text-[#102A43]">
              {service.name}
            </h3>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {service.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-[0.68rem] font-semibold">
          <span className="rounded-full bg-[#EEF5FF] px-2.5 py-1 text-[#0063F7]">
            {service.category ?? "Serviciu"}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            Acces dificil
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-5">
          {typeof count === "number" ? (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
              <Users className="size-4" />
              {count} firme listate
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-500">Disponibil național</span>
          )}
          <span className="inline-flex shrink-0 items-center gap-2 text-xs font-bold text-[#0063F7]">
            Vezi serviciul
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
