import { buildMetadata } from "@/lib/seo";
import { getCounties } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CountyCard } from "@/components/site/county-card";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Judete - alpinism utilitar Romania",
  description:
    "Navigheaza rapid pe judete si vezi firme de alpinism utilitar, orase si servicii relevante pentru fiecare zona.",
  path: "/judete",
});

export default async function CountiesPage() {
  const counties = await getCounties();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Judete" }]} />
      <div className="mt-6 max-w-3xl space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">
          Judete si zone acoperite
        </h1>
        <p className="text-lg leading-8 text-slate-600">
          Paginile de judet sunt gandite SEO-first si ajuta clientii sa ajunga mai
          repede la firme locale sau regionale.
        </p>
        <p className="text-sm leading-7 text-slate-500">
          Portalul ramane national, cu toate judetele active in arhitectura; Bucuresti si Ilfov
          sunt tratate prioritar in faza curenta de optimizare comerciala.
        </p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {counties.map((county) => (
            <CountyCard
              key={county.id}
              county={county}
              count={county.companyCount ?? county._count.companies}
            />
          ))}
      </div>
    </div>
  );
}
