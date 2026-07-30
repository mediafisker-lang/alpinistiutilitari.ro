import { buildMetadata } from "@/lib/seo";
import { getServices } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ServiceCard } from "@/components/site/service-card";
import Link from "next/link";

const industrialLinks = [
  ["alpinism-industrial-greu", "Alpinism industrial greu"],
  ["inspectii-ndt-la-inaltime", "Inspectii NDT la inaltime"],
  ["protectie-anticoroziva-la-inaltime", "Protectie anticoroziva"],
  ["mentenanta-cosuri-industriale", "Mentenanta cosuri industriale"],
  ["mentenanta-turbine-eoliene", "Mentenanta turbine eoliene"],
  ["mentenanta-structuri-metalice-industriale", "Structuri metalice industriale"],
] as const;

export const metadata = buildMetadata({
  title: "Servicii de alpinism utilitar în România",
  description:
    "Descoperă principalele servicii de alpinism utilitar: acoperișuri, fațade, geamuri, bannere, arbori și intervenții la înălțime.",
  path: "/servicii",
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: "Servicii" }]} />
      <div className="mt-6 max-w-4xl space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">
          Servicii de alpinism utilitar și lucrări la înălțime
        </h1>
        <p className="text-lg leading-8 text-slate-600">
          Structura comercială principală a platformei este gândită pe verticale SEO:
          acoperișuri, fațade, geamuri, publicitate la înălțime, arboricultură și intervenții tehnice.
        </p>
      </div>

      <section className="mt-10 rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl shadow-slate-950/15">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
          Divizie industriala
        </p>
        <h2 className="mt-3 text-3xl font-black">Alpinism industrial greu</h2>
        <p className="mt-3 max-w-4xl leading-7 text-slate-300">
          Pagini dedicate pentru rafinarii, porturi, santiere navale, combinate,
          termocentrale, turbine eoliene, hale si structuri metalice cu acces dificil.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {industrialLinks.map(([slug, label]) => (
            <Link
              key={slug}
              href={`/servicii/${slug}`}
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:border-sky-300 hover:bg-white/10"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} count={service._count.companies} />
        ))}
      </div>
    </div>
  );
}
