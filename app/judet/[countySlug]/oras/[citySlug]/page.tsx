import { notFound } from "next/navigation";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildMetadata } from "@/lib/seo";
import { getCity, getQuickSearchOptions, getRelatedArticles, getServices } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CompanyCard } from "@/components/site/company-card";
import { ServiceCard } from "@/components/site/service-card";
import { SeoLinkCloud } from "@/components/site/seo-link-cloud";
import { LeadForm } from "@/components/forms/lead-form";
import { FAQBlock } from "@/components/site/faq-block";
import { CTASection } from "@/components/site/cta-section";
import { ArticleCard } from "@/components/site/article-card";
import { buildCityFaqs, buildCityIntro } from "@/lib/content/local-seo";
import { getPrimaryCompanies } from "@/lib/company-ranking";

type Props = {
  params: Promise<{ countySlug: string; citySlug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { countySlug, citySlug } = await params;
  const city = await getCity(countySlug, citySlug);

  if (!city) {
    return buildMetadata({
      title: "Localitate indisponibila",
      description: "Localitatea cautata nu exista.",
    });
  }

  return buildMetadata({
    title: `${city.name}, ${city.county.name} - firme de alpinism utilitar`,
    description:
      city.intro ??
      `Vezi firme de alpinism utilitar din ${city.name}, judetul ${city.county.name}, pentru proiecte la inaltime si interventii tehnice.`,
    path: `/${city.county.slug}/${city.slug}`,
    noIndex: true,
  });
}

export default async function CityPage({ params }: Props) {
  const { countySlug, citySlug } = await params;
  const [city, services, options] = await Promise.all([getCity(countySlug, citySlug), getServices(), getQuickSearchOptions()]);

  if (!city) notFound();
  const faqItems = buildCityFaqs(city);
  const cityIntro = buildCityIntro(city);
  const primaryCompanies = getPrimaryCompanies(city.companies, 10);
  const additionalCompanies = city.companies.filter(
    (company) => !primaryCompanies.some((primary) => primary.id === company.id),
  );
  const serviceIds = city.companies.flatMap((company) => company.services.map((item) => item.serviceId));
  const topServiceIds = [...new Set(serviceIds)].slice(0, 3);
  const localServices = services.filter((service) => topServiceIds.includes(service.id));
  const relatedArticles = await getRelatedArticles([...new Set(serviceIds)]);
  const serviceLinks = (localServices.length ? localServices : services.slice(0, 4)).map((service) => ({
    href: `/${city.slug}/${service.slug}`,
    label: `${service.name} în ${city.name}`,
  }));
  const breadcrumbItems = [
    { label: "Acasa", href: "/" },
    { label: "Judete", href: "/judete" },
    { label: city.county.name, href: `/${city.county.slug}` },
    { label: city.name },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);
  const faqJsonLd = buildFaqJsonLd(faqItems);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumbs items={breadcrumbItems} />
      <section className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-4xl space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            Alpinism utilitar in {city.name}
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            {city.intro ??
              `Gasesti firme din ${city.name}, judetul ${city.county.name}, pentru lucrari la inaltime, fatade si mentenanta.`}
          </p>
          <p className="text-base leading-8 text-slate-600">{cityIntro}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-black text-slate-950">{city.companies.length}</p>
              <p className="mt-1 text-sm text-slate-600">firme listate local</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-black text-slate-950">{localServices.length || services.slice(0, 4).length}</p>
              <p className="mt-1 text-sm text-slate-600">servicii comerciale populare</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <p className="text-2xl font-black text-slate-950">{relatedArticles.length}</p>
              <p className="mt-1 text-sm text-slate-600">articole utile legate de servicii</p>
            </div>
          </div>
        </div>
        <SeoLinkCloud
          eyebrow="Căutări locale"
          title={`Servicii populare în ${city.name}`}
          description={`Pagini create pentru căutări locale reale de tip „serviciu + ${city.name}”.`}
          links={serviceLinks}
        />
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Firme principale în {city.name}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Lista de sus evidențiază profilele cu relevanță mai bună pentru lucrări la înălțime și
              servicii conexe căutate de clienți în această localitate.
            </p>
          </div>
          <p className="text-sm text-slate-500">{primaryCompanies.length} afișate prioritar</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {primaryCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>

      {additionalCompanies.length ? (
        <section className="mt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-950">Alte profile active din {city.name}</h2>
            <p className="text-sm text-slate-500">{additionalCompanies.length} rezultate suplimentare</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {additionalCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-950">Tipuri de lucrări căutate în {city.name}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Am selectat serviciile care apar frecvent în profilurile locale și în cererile comerciale pentru această zonă.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(localServices.length ? localServices : services.slice(0, 3)).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {relatedArticles.length ? (
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-950">Articole utile pentru {city.name}</h2>
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
          sourcePage={`/${city.county.slug}/${city.slug}`}
          countyId={city.county.id}
          countyName={city.county.name}
          cityId={city.id}
          cityName={city.name}
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
          eyebrow="Cerere locală"
          title={`Ai o lucrare în ${city.name}? Trimite-o și o analizăm manual.`}
          description={`Pentru ${city.name} și împrejurimi poți încărca poze, adresa lucrării și nivelul de urgență. Cererea intră în platformă și este evaluată înainte de contactarea executanților.`}
          primaryHref="/cere-oferta"
          primaryLabel="Trimite cerere"
          secondaryHref={`/${city.county.slug}`}
          secondaryLabel={`Vezi și ${city.county.name}`}
        />
      </section>
    </div>
  );
}
