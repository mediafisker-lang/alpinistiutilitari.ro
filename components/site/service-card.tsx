import Link from "next/link";
import type { Service } from "@prisma/client";
import { Card } from "@/components/ui/card";

export function ServiceCard({
  service,
  count,
}: {
  service: Service;
  count?: number;
}) {
  return (
    <Link href={`/servicii/${service.slug}`}>
      <Card className="ui-card-hover group flex h-full flex-col rounded-2xl border border-[#DCE4E9] bg-white p-6 shadow-[0_12px_32px_rgba(16,42,67,0.07)] transition">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#176B87]">
          Verticală SEO
        </p>
        <h3 className="mt-3 text-xl font-extrabold text-[#102A43]">{service.name}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {service.shortDescription}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">{service.category ?? "Serviciu"}</span>
          <span className="rounded-full bg-[#E8F0F3] px-3 py-1 text-[#176B87]">Pagini locale active</span>
        </div>
        {typeof count === "number" ? (
          <p className="mt-5 text-sm font-semibold text-slate-900">
            {count} firme listate
          </p>
        ) : null}
      </Card>
    </Link>
  );
}
