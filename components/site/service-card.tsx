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
      <Card className="group h-full rounded-[2rem] border border-slate-200/90 p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Verticală SEO
        </p>
        <h3 className="mt-3 text-xl font-bold text-slate-950">{service.name}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {service.shortDescription}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">{service.category ?? "Serviciu"}</span>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">Pagini locale active</span>
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
