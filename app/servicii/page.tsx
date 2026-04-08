import { buildMetadata } from "@/lib/seo";
import { getServices } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ServiceCard } from "@/components/site/service-card";

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

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} count={service._count.companies} />
        ))}
      </div>
    </div>
  );
}
