import { buildMetadata } from "@/lib/seo";
import { getCompanies, getQuickSearchOptions } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";

export const metadata = buildMetadata({
  title: "Cere ofertă pentru alpinism utilitar în România",
  description:
    "Trimite o cerere internă pentru lucrări la înălțime, după județ, oraș și tip de lucrare. Revenim cu soluția potrivită după analiza internă.",
  path: "/cere-oferta",
});

type OfferPageProps = {
  searchParams: Promise<{ company?: string }>;
};

export default async function OfferPage({ searchParams }: OfferPageProps) {
  const params = await searchParams;
  const [options, companies] = await Promise.all([getQuickSearchOptions(), getCompanies()]);
  const preselectedCompany = params.company
    ? companies.find((company) => company.slug === params.company)
    : undefined;
  const companySelections = companies.slice(0, 12).map((company) => ({
    id: company.id,
    label: `${company.name} · ${company.city?.name ?? "Localitate neprecizată"}, ${company.county?.name ?? "Județ neprecizat"}`,
  }));
  const countyOptions = options.counties.map((county) => ({ id: county.id, label: county.name }));
  const serviceOptions = options.services.map((service) => ({
    id: service.id,
    label: service.name,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: "Cere ofertă" }]} />
      <section className="mt-6 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <LeadForm
          sourcePage="/cere-oferta"
          selectableCompanies={companySelections}
          selectedCompanyIds={preselectedCompany ? [preselectedCompany.id] : []}
          counties={countyOptions}
          services={serviceOptions}
        />

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            In maxim 15 min primesti cea mai buna oferta!
          </h1>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              <span className="font-semibold text-slate-950">1.</span> Completezi cererea și o trimiți.
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              <span className="font-semibold text-slate-950">2.</span> O preluăm și o trimitem către firmele din județul ales de tine.
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-900">
              <span className="font-semibold">3.</span> Vei primi în maxim 15 minute oferte pe WhatsApp sau SMS.
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 text-sm leading-7 text-emerald-900">
              <span className="font-semibold">Observații:</span> Puteți lăsa cerințele și pe WhatsApp sau telefonic la numărul din contact.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
