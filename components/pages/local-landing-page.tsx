import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo";
import { getQuickSearchOptions, getRelatedArticles, resolveLocalLanding } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CompanyCard } from "@/components/site/company-card";
import { LeadForm } from "@/components/forms/lead-form";
import { FAQBlock } from "@/components/site/faq-block";
import { ArticleCard } from "@/components/site/article-card";
import { CTASection } from "@/components/site/cta-section";
import { SeoLinkCloud } from "@/components/site/seo-link-cloud";
import { buildLocalLandingCopy } from "@/lib/content/local-seo";
import { notFound } from "next/navigation";

type LocalLandingContentProps = {
  locationSlug: string;
  serviceSlug: string;
  sourcePage?: string;
};

export async function LocalLandingPageContent({
  locationSlug,
  serviceSlug,
  sourcePage,
}: LocalLandingContentProps) {
  const [data, options] = await Promise.all([
    resolveLocalLanding(locationSlug, serviceSlug),
    getQuickSearchOptions(),
  ]);

  if (!data) notFound();

  const relatedArticles = await getRelatedArticles([data.service.id]);
  const locationName = data.type === "city" ? data.city.name : data.county.name;
  const getLocalBadge = (company: (typeof data.companies)[number]): "direct" | "coverage" | undefined => {
    if (data.type === "city") {
      if (company.cityId === data.city.id) return "direct";
      if (company.coverage.some((coverage) => coverage.cityId === data.city.id)) return "coverage";
      if (company.countyId === data.county.id) return "coverage";
      if (company.coverage.some((coverage) => coverage.countyId === data.county.id)) return "coverage";
      return undefined;
    }

    if (company.countyId === data.county.id) return "direct";
    if (company.coverage.some((coverage) => coverage.countyId === data.county.id)) return "coverage";
    return undefined;
  };
  const getAreaBadge = (company: (typeof data.companies)[number]): "city" | "county" | undefined => {
    if (data.type === "city") {
      if (company.cityId === data.city.id || company.coverage.some((coverage) => coverage.cityId === data.city.id)) {
        return "city";
      }

      if (
        company.countyId === data.county.id ||
        company.coverage.some((coverage) => coverage.countyId === data.county.id)
      ) {
        return "county";
      }

      return undefined;
    }

    if (
      company.countyId === data.county.id ||
      company.coverage.some((coverage) => coverage.countyId === data.county.id)
    ) {
      return "county";
    }

    return undefined;
  };
  const localCopy = buildLocalLandingCopy(locationName, data.service.name, data.type);
  const visibleCompanies = data.companies.slice(0, 8);
  const extraCompanies = data.companies.slice(8);
  const directCount = data.companies.filter((company) => getLocalBadge(company) === "direct").length;
  const coverageCount = data.companies.filter((company) => getLocalBadge(company) === "coverage").length;
  const cityPriorityCount = data.companies.filter((company) => getAreaBadge(company) === "city").length;
  const countyPriorityCount = data.companies.filter((company) => getAreaBadge(company) === "county").length;
  const breadcrumbs = [
    { label: "Acasă", href: "/" },
    data.type === "city"
      ? { label: data.county.name, href: `/${data.county.slug}` }
      : { label: "Județe", href: "/judete" },
    data.type === "city"
      ? {
          label: data.city.name,
          href: `/${data.county.slug}/${data.city.slug}`,
        }
      : { label: data.county.name, href: `/${data.county.slug}` },
    { label: data.service.name },
  ];

  const faqItems = [
    {
      question: `Cum aleg o firmă pentru ${data.service.name.toLowerCase()} în ${locationName}?`,
      answer:
        "Compară serviciile listate, profilul firmei, localizarea și claritatea modului de contact. Cererea ta este analizată intern înainte de contactarea executanților.",
    },
    {
      question: "Cererea mea este trimisă automat către firme?",
      answer:
        "Nu. Cererea se salvează în platformă și este procesată manual de administrator pentru a filtra executanții potriviți.",
    },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);
  const faqJsonLd = buildFaqJsonLd(faqItems);
  const otherLinks =
    data.type === "city"
      ? [
          {
            href: `/${data.county.slug}`,
            label: `Firme de alpinism utilitar în ${data.county.name}`,
          },
          {
            href: `/servicii/${data.service.slug}`,
            label: data.service.name,
          },
        ]
      : data.county.cities.slice(0, 6).map((city) => ({
          href: `/${data.county.slug}/${city.slug}`,
          label: city.name,
        }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Pagină comercială locală
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              {data.service.name} în {locationName}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {data.type === "city"
                ? `Vezi firme active în ${data.city.name}, județul ${data.county.name}, pentru ${data.service.name.toLowerCase()}, lucrări la înălțime și intervenții conexe.`
                : `Compară firme din județul ${data.county.name} care oferă ${data.service.name.toLowerCase()} și trimite rapid o cerere internă.`}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">De ce această pagină</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{localCopy.lead}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Cum alegi mai rapid</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{localCopy.why}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Ce faci mai departe</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{localCopy.cta}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Firme listate</p>
              <p className="mt-3 text-3xl font-black text-slate-950">{data.companies.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Zonă</p>
              <p className="mt-3 text-xl font-bold text-slate-950">{locationName}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Tip lucrare</p>
              <p className="mt-3 text-xl font-bold text-slate-950">{data.service.name}</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-950">Firme recomandate</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Primele rezultate sunt ordonate după potrivirea cu serviciul, proximitatea față de zona aleasă și
              semnalele comerciale ale profilului.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                <span className="font-semibold">{cityPriorityCount}</span> firme în orașul tău
              </div>
              <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
                <span className="font-semibold">{countyPriorityCount}</span> firme în județul tău
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
                <span className="font-semibold">{directCount}</span> potriviri directe
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
                <span className="font-semibold">{coverageCount}</span> firme care acoperă zona
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">
                <span className="size-2 rounded-full bg-emerald-500" />
                Potrivire directă = sediu sau prezență directă în zona căutată
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sky-800">
                <span className="size-2 rounded-full bg-sky-500" />
                Acoperă zona = firmă activă care intervine și în această zonă
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">
                În orașul tău / În județul tău = nivelul de proximitate comercială pentru lucrare
              </span>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {data.companies.length ? (
                visibleCompanies.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    localBadge={getLocalBadge(company)}
                    areaBadge={getAreaBadge(company)}
                  />
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 md:col-span-2">
                  Nu există încă firme publicate pentru această combinație locală. Poți trimite totuși cererea,
                  iar noi o analizăm intern.
                </div>
              )}
            </div>
            {extraCompanies.length ? (
              <details className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
                  Vezi încă {extraCompanies.length} firme relevante pentru {data.service.name.toLowerCase()}
                </summary>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {extraCompanies.map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      localBadge={getLocalBadge(company)}
                      areaBadge={getAreaBadge(company)}
                    />
                  ))}
                </div>
              </details>
            ) : null}
          </div>

          {relatedArticles.length ? (
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Articole utile</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {relatedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          ) : null}

          <FAQBlock items={faqItems} />

          <SeoLinkCloud
            eyebrow="Navigare utilă"
            title={data.type === "city" ? "Legături utile pentru aceeași zonă" : "Orașe și pagini locale apropiate"}
            links={otherLinks}
          />
        </div>

        <LeadForm
          sourcePage={sourcePage ?? `/${locationSlug}/${serviceSlug}`}
          countyId={data.county.id}
          countyName={data.county.name}
          cityId={data.type === "city" ? data.city.id : undefined}
          cityName={data.type === "city" ? data.city.name : undefined}
          serviceId={data.service.id}
          selectableCompanies={data.companies.slice(0, 10).map((company) => ({
            id: company.id,
            label: `${company.name} · ${company.city?.name ?? "Localitate neprecizată"}, ${company.county?.name ?? "Județ neprecizat"}`,
          }))}
          counties={options.counties.map((county) => ({ id: county.id, label: county.name }))}
          services={options.services.map((service) => ({ id: service.id, label: service.name }))}
        />
      </section>

      <section className="mt-12">
        <CTASection
          eyebrow="Cerere locală"
          title={`Vrei ${data.service.name.toLowerCase()} în ${locationName}? Trimite cererea și revenim cu soluția potrivită.`}
          description="Câmpurile din formular sunt gândite pentru solicitări comerciale și rezidențiale reale. Administratorul verifică cererea și contactează manual executanții potriviți."
          primaryHref="/cere-oferta"
          primaryLabel="Trimite cererea"
          secondaryHref="/firme"
          secondaryLabel="Vezi toate firmele"
        />
      </section>
    </div>
  );
}
