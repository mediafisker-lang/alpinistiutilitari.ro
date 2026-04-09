import { notFound } from "next/navigation";
import {
  buildBreadcrumbJsonLd,
  buildCompanyJsonLd,
  buildFaqJsonLd,
  buildServiceJsonLd,
} from "@/lib/seo";
import { getQuickSearchOptions, getRelatedArticles, resolveLocalLanding } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CompanyCard } from "@/components/site/company-card";
import { LeadForm } from "@/components/forms/lead-form";
import { FAQBlock } from "@/components/site/faq-block";
import { ArticleCard } from "@/components/site/article-card";
import { CTASection } from "@/components/site/cta-section";
import { SeoLinkCloud } from "@/components/site/seo-link-cloud";
import {
  getCountyLocalitySlugs,
  getLocalLandingContent,
  isPriorityLandingPath,
} from "@/lib/content/local-commercial";

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

  const pagePath = sourcePage ?? `/${locationSlug}/${serviceSlug}`;
  const relatedArticles = await getRelatedArticles([data.service.id]);
  const locationName = data.type === "city" ? data.city.name : data.county.name;
  const landingContent = getLocalLandingContent({
    locationSlug,
    countySlug: data.county.slug,
    serviceSlug,
    serviceName: data.service.name,
    locationName,
    countyName: data.county.name,
    type: data.type,
  });

  const getLocalBadge = (company: (typeof data.companies)[number]): "direct" | "coverage" | undefined => {
    if (data.type === "city") {
      if (company.city?.slug === data.city.slug) return "direct";
      if (company.coverage.some((coverage) => coverage.city?.slug === data.city.slug)) return "coverage";
      if (company.county?.slug === data.county.slug) return "coverage";
      if (company.coverage.some((coverage) => coverage.county?.slug === data.county.slug)) return "coverage";
      return undefined;
    }

    if (company.county?.slug === data.county.slug) return "direct";
    if (company.coverage.some((coverage) => coverage.county?.slug === data.county.slug)) return "coverage";
    return undefined;
  };

  const getAreaBadge = (company: (typeof data.companies)[number]): "city" | "county" | undefined => {
    if (data.type === "city") {
      if (
        company.city?.slug === data.city.slug ||
        company.coverage.some((coverage) => coverage.city?.slug === data.city.slug)
      ) {
        return "city";
      }

      if (
        company.county?.slug === data.county.slug ||
        company.coverage.some((coverage) => coverage.county?.slug === data.county.slug)
      ) {
        return "county";
      }

      return undefined;
    }

    if (
      company.county?.slug === data.county.slug ||
      company.coverage.some((coverage) => coverage.county?.slug === data.county.slug)
    ) {
      return "county";
    }

    return undefined;
  };

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

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);
  const faqJsonLd = buildFaqJsonLd(landingContent.faq);
  const serviceJsonLd = buildServiceJsonLd({
    name: data.service.name,
    description: landingContent.description,
    path: pagePath,
    areaServed: data.type === "city" ? `${data.city.name}, ${data.county.name}` : data.county.name,
  });
  const primaryCompany = data.companies[0];
  const primaryCompanyJsonLd = primaryCompany
    ? buildCompanyJsonLd({
        name: primaryCompany.name,
        description: primaryCompany.descriptionShort || primaryCompany.descriptionLong || primaryCompany.name,
        path: `/firme/${primaryCompany.slug}`,
        phone: primaryCompany.phone,
        email: primaryCompany.email,
        website: primaryCompany.website,
        address: primaryCompany.address,
        city: primaryCompany.city?.name ?? locationName,
        county: primaryCompany.county?.name ?? data.county.name,
      })
    : null;

  const relatedServiceLinks = options.services
    .filter((service) => landingContent.relatedServiceSlugs.includes(service.slug))
    .map((service) => ({
      href: `/${data.type === "city" ? data.city.slug : data.county.slug}/${service.slug}`,
      label: `${service.name} in ${locationName}`,
    }));

  const toLabel = (slug: string) =>
    slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const essentialLinks = [
    { href: `/${data.county.slug}`, label: `Judet ${data.county.name}` },
    { href: `/servicii/${data.service.slug}`, label: `Serviciu: ${data.service.name}` },
    ...(data.type === "city"
      ? [{ href: `/${data.county.slug}/${data.service.slug}`, label: `${data.service.name} in ${data.county.name}` }]
      : []),
  ];

  const localCandidates = landingContent.relatedLocationSlugs.length
    ? landingContent.relatedLocationSlugs
    : getCountyLocalitySlugs(data.county.slug);

  const nearbyPrimaryLinks = [...new Set(localCandidates)]
    .filter((slug) => slug !== locationSlug)
    .filter((slug) => isPriorityLandingPath(slug, data.service.slug))
    .slice(0, 4)
    .map((slug) => ({
      href: `/${slug}/${data.service.slug}`,
      label: `${data.service.name} in ${toLabel(slug)}`,
    }));

  const nearbyLocationLinks =
    nearbyPrimaryLinks.length >= 2
      ? nearbyPrimaryLinks
      : [
          ...nearbyPrimaryLinks,
          ...[...new Set(localCandidates)]
            .filter((slug) => slug !== locationSlug)
            .filter((slug) => isPriorityLandingPath(slug, "spalare-geamuri-la-inaltime"))
            .slice(0, 4 - nearbyPrimaryLinks.length)
            .map((slug) => ({
              href: `/${slug}/spalare-geamuri-la-inaltime`,
              label: `Spalare geamuri la inaltime in ${toLabel(slug)}`,
            })),
        ];

  const selectedServiceOption = options.services.find((service) => service.slug === data.service.slug);
  const isFacadeRiskVertical =
    data.service.slug === "decopertari-tencuiala" ||
    data.service.slug === "punere-in-siguranta-fatade";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      {primaryCompanyJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(primaryCompanyJsonLd) }}
        />
      ) : null}
      <Breadcrumbs items={breadcrumbs} />

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Pagină comercială locală
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{landingContent.h1}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{landingContent.intro}</p>
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

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {landingContent.sections.map((section) => (
              <div key={section.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-base font-bold text-slate-950">{section.title}</h2>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                  {section.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
            ))}
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

          {isFacadeRiskVertical ? (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="text-xl font-bold text-slate-950">Interventii conexe pe demolare.ro</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Pentru cazuri unde degradarea fatadei necesita si lucrari de demolare controlata,
                poti consulta si platforma partenera pentru demolari si debarasari tehnice.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <a
                  href="https://demolare.ro"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
                >
                  servicii de demolare controlata pe demolare.ro
                </a>
                <a
                  href="https://demolare.ro"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
                >
                  evaluare rapida pentru fatade cu risc structural
                </a>
              </div>
            </div>
          ) : null}

          <FAQBlock items={landingContent.faq} />

          <div className="grid gap-6 lg:grid-cols-3">
            <SeoLinkCloud
              eyebrow="Navigare esentiala"
              title="Linkuri principale"
              links={essentialLinks}
            />
            <SeoLinkCloud
              eyebrow="Servicii apropiate"
              title={`Servicii conexe în ${locationName}`}
              links={relatedServiceLinks}
            />
            <SeoLinkCloud
              eyebrow="Zone relevante"
              title="Pagini locale apropiate"
              links={nearbyLocationLinks}
            />
          </div>
        </div>

        <LeadForm
          sourcePage={pagePath}
          countyId={data.county.id}
          countyName={data.county.name}
          cityId={data.type === "city" ? data.city.id : undefined}
          cityName={data.type === "city" ? data.city.name : undefined}
          serviceId={selectedServiceOption?.id}
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
          title={`Vrei ${data.service.name.toLowerCase()} în ${locationName}? Trimite cererea și primești opțiuni potrivite.`}
          description="Formularul este construit pentru cereri comerciale reale: descriere clară, zonă, urgență și detalii tehnice utile pentru ofertare."
          primaryHref="/cere-oferta"
          primaryLabel="Trimite cererea"
          secondaryHref="/firme"
          secondaryLabel="Vezi toate firmele"
        />
      </section>
    </div>
  );
}
