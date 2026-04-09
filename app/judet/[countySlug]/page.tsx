import Link from "next/link";
import { notFound } from "next/navigation";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildMetadata } from "@/lib/seo";
import { getCounty, getQuickSearchOptions, getRelatedArticles, getServices } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CompanyCard } from "@/components/site/company-card";
import { ServiceCard } from "@/components/site/service-card";
import { LeadForm } from "@/components/forms/lead-form";
import { FAQBlock } from "@/components/site/faq-block";
import { SeoLinkCloud } from "@/components/site/seo-link-cloud";
import { CTASection } from "@/components/site/cta-section";
import { ArticleCard } from "@/components/site/article-card";
import { buildCountyFaqs, buildCountyIntro } from "@/lib/content/local-seo";
import { getPrimaryCompanies } from "@/lib/company-ranking";
import {
  getCountyCommercialFaq,
  getCountyCommercialSections,
  getCountyLocalitySlugs,
  getCountySeoOverride,
  getCountyServiceSlugs,
} from "@/lib/content/local-commercial";

type Props = {
  params: Promise<{ countySlug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { countySlug } = await params;
  const county = await getCounty(countySlug);

  if (!county) {
    return buildMetadata({
      title: "Judet indisponibil",
      description: "Judetul cautat nu exista.",
    });
  }

  return buildMetadata({
    title: `Alpinism utilitar in ${county.name}`,
    description:
      county.intro ??
      `Gasesti firme de alpinism utilitar din ${county.name}, orase importante si servicii relevante pentru proiecte la inaltime.`,
    path: `/${county.slug}`,
    noIndex: true,
  });
}

export default async function CountyPage({ params }: Props) {
  const { countySlug } = await params;
  const [county, services, options] = await Promise.all([getCounty(countySlug), getServices(), getQuickSearchOptions()]);

  if (!county) notFound();

  const countyOverride = getCountySeoOverride(county.slug);
  const priorityServiceSlugs = getCountyServiceSlugs(county.slug);
  const priorityLocalitySlugs = getCountyLocalitySlugs(county.slug);
  const countyCommercialSections = getCountyCommercialSections(county.slug);
  const localServices = services.slice(0, 6);
  const priorityServiceLinks =
    priorityServiceSlugs.length
      ? priorityServiceSlugs.map((serviceSlug) => {
          const matchedService = options.services.find((service) => service.slug === serviceSlug);
          const fallbackLabel = serviceSlug.replaceAll("-", " ");
          return {
            href: `/${county.slug}/${serviceSlug}`,
            label: `${matchedService?.name ?? fallbackLabel} în ${county.name}`,
          };
        })
      : [];
  const serviceLinks = (priorityServiceLinks.length
    ? priorityServiceLinks
    : localServices.map((service) => ({
        href: `/${county.slug}/${service.slug}`,
        label: `${service.name} în ${county.name}`,
      })));
  const cityLinks = county.cities.slice(0, 8).map((city) => ({
    href: `/${county.slug}/${city.slug}`,
    label: city.name,
  }));
  const countyAeoFaq = [
    {
      question: "Cât durează răspunsul la cerere?",
      answer:
        "Cererea este evaluată intern imediat după trimitere. Pentru lucrări urgente menționezi prioritatea și intervalul dorit, iar răspunsul inițial vine de regulă rapid.",
    },
    {
      question: "Ce tipuri de clădiri deserviți?",
      answer:
        "Platforma acoperă cereri pentru blocuri, birouri, spații comerciale, hale, clădiri tehnice și proprietăți rezidențiale cu acces dificil.",
    },
    {
      question: "Lucrați și în localitățile din jur?",
      answer:
        county.slug === "ilfov"
          ? "Da. Se preiau cereri și pentru Voluntari, Otopeni, Tunari, Chiajna, Popești-Leordeni, Buftea, Snagov sau Afumați."
          : "Da. Cererile pot fi preluate și în localitățile din jurul zonei principale, în funcție de tipul lucrării și disponibilitatea echipelor.",
    },
    {
      question: "Pot cere ofertă pentru mai multe lucrări?",
      answer:
        "Da. În aceeași cerere poți include lucrări multiple, iar solicitarea este structurată intern pentru o ofertare corectă.",
    },
    {
      question: "Ce include o intervenție de alpinism utilitar?",
      answer:
        "Evaluare acces și risc, plan de intervenție, execuție la înălțime în condiții de siguranță și recomandări pentru etapele următoare.",
    },
  ];
  const faqItems = [...buildCountyFaqs(county), ...getCountyCommercialFaq(county.slug), ...countyAeoFaq];
  const countyIntro = buildCountyIntro(county);
  const primaryCompanies = getPrimaryCompanies(county.companies, 10);
  const additionalCompanies = county.companies.filter(
    (company) => !primaryCompanies.some((primary) => primary.id === company.id),
  );
  const serviceIds = county.companies.flatMap((company) => company.services.map((item) => item.serviceId));
  const relatedArticles = await getRelatedArticles([...new Set(serviceIds)]);
  const breadcrumbItems = [
    { label: "Acasa", href: "/" },
    { label: "Judete", href: "/judete" },
    { label: county.name },
  ];
  const getLocalBadge = (company: (typeof county.companies)[number]): "direct" | "coverage" | undefined => {
    if (company.countyId === county.id) return "direct";
    if (company.coverage.some((coverage) => coverage.countyId === county.id)) return "coverage";
    return undefined;
  };
  const getAreaBadge = (company: (typeof county.companies)[number]): "county" | undefined => {
    if (company.countyId === county.id || company.coverage.some((coverage) => coverage.countyId === county.id)) {
      return "county";
    }
    return undefined;
  };
  const visiblePrimaryCompanies = primaryCompanies.slice(0, 8);
  const extraPrimaryCompanies = primaryCompanies.slice(8);
  const visibleAdditionalCompanies = additionalCompanies.slice(0, 8);
  const extraAdditionalCompanies = additionalCompanies.slice(8);
  const directCount = county.companies.filter((company) => getLocalBadge(company) === "direct").length;
  const coverageCount = county.companies.filter((company) => getLocalBadge(company) === "coverage").length;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);
  const faqJsonLd = buildFaqJsonLd(faqItems);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            {countyOverride?.h1 ?? `Firme de alpinism utilitar in ${county.name}`}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {countyOverride?.intro ??
              county.intro ??
              `Aici gasesti rapid firme din ${county.name} pentru lucrari la inaltime, reparatii, bannere, geamuri si alte interventii speciale.`}
          </p>
          <p className="mt-4 text-base leading-8 text-slate-600">{countyIntro}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-black text-slate-950">{county.companies.length}</p>
              <p className="mt-1 text-sm text-slate-600">firme listate în județ</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-black text-slate-950">{county.cities.length}</p>
              <p className="mt-1 text-sm text-slate-600">orașe și localități</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-black text-slate-950">{localServices.length}</p>
              <p className="mt-1 text-sm text-slate-600">servicii</p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Orase importante
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Pagini locale utile pentru trafic organic și pentru clienții care caută rapid firme active în {county.name}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {county.cities.map((city) => (
              <Link
                key={city.id}
                href={`/${county.slug}/${city.slug}`}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {countyCommercialSections.length ? (
        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {countyCommercialSections.map((section) => (
            <div key={section.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
              <h2 className="text-base font-bold text-slate-950">{section.title}</h2>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                {section.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Firme principale din {county.name}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Am prioritizat profilele cele mai utile comercial pentru utilizatori: firme verificate,
              profile complete, servicii clare și rezultate locale relevante.
            </p>
          </div>
          <p className="text-sm text-slate-500">{primaryCompanies.length} afișate prioritar</p>
        </div>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
            <span className="font-semibold">{county.companies.length}</span> firme pentru {county.name}
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
            <span className="font-semibold">{directCount}</span> cu sediu direct în județ
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
            <span className="font-semibold">{coverageCount}</span> care acoperă județul
          </div>
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <span className="font-semibold">{county.cities.length}</span> orașe și localități SEO
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visiblePrimaryCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              localBadge={getLocalBadge(company)}
              areaBadge={getAreaBadge(company)}
            />
          ))}
        </div>
        {extraPrimaryCompanies.length ? (
          <details className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
              Vezi încă {extraPrimaryCompanies.length} firme principale din {county.name}
            </summary>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {extraPrimaryCompanies.map((company) => (
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
      </section>

      {additionalCompanies.length ? (
        <section className="mt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-950">Alte firme active în {county.name}</h2>
            <p className="text-sm text-slate-500">{additionalCompanies.length} rezultate suplimentare</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleAdditionalCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                localBadge={getLocalBadge(company)}
                areaBadge={getAreaBadge(company)}
              />
            ))}
          </div>
          {extraAdditionalCompanies.length ? (
            <details className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
                Vezi încă {extraAdditionalCompanies.length} rezultate suplimentare
              </summary>
              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {extraAdditionalCompanies.map((company) => (
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
        </section>
      ) : null}

      <section className="mt-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-950">
            Servicii cautate frecvent in {county.name}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Servicii principale, lucrari la inaltime, firme specializate.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {localServices.slice(0, 3).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <SeoLinkCloud
          eyebrow="Servicii locale"
          title={`Pagini locale ${county.name} + serviciu`}
          links={serviceLinks}
        />
        <SeoLinkCloud
          eyebrow="Orașe"
          title={`Orașe importante din ${county.name}`}
          links={
            priorityLocalitySlugs.length
              ? priorityLocalitySlugs.map((slug) => ({
                  href: `/${slug}/spalare-geamuri-la-inaltime`,
                  label: slug.replaceAll("-", " "),
                }))
              : cityLinks
          }
        />
      </section>

      {relatedArticles.length ? (
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-950">Articole utile pentru {county.name}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <FAQBlock items={faqItems} />
        <LeadForm
          sourcePage={`/${county.slug}`}
          countyId={county.id}
          countyName={county.name}
          selectableCompanies={primaryCompanies.slice(0, 10).map((company) => ({
            id: company.id,
            label: `${company.name} · ${company.city?.name ?? "Localitate neprecizată"}`,
          }))}
          counties={options.counties.map((item) => ({ id: item.id, label: item.name }))}
          services={options.services.map((item) => ({ id: item.id, label: item.name }))}
        />
      </section>

      <section className="mt-12">
        <CTASection
          eyebrow="Cerere pentru județ"
          title={`Ai o lucrare în ${county.name}? Trimite detaliile și o analizăm intern.`}
          description={`Poți atașa poze, adresă și detalii tehnice. Cererea rămâne în platformă și este procesată manual pentru a selecta executanții potriviți în ${county.name}.`}
          primaryHref="/cere-oferta"
          primaryLabel="Trimite cerere"
          secondaryHref="/firme"
          secondaryLabel="Vezi toate firmele"
        />
      </section>
    </div>
  );
}
