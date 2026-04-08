import { notFound } from "next/navigation";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildMetadata } from "@/lib/seo";
import { getCity, getQuickSearchOptions, getRelatedArticles, getServices } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CompanyCard } from "@/components/site/company-card";
import { LeadForm } from "@/components/forms/lead-form";
import { FAQBlock } from "@/components/site/faq-block";
import { SeoLinkCloud } from "@/components/site/seo-link-cloud";
import { CTASection } from "@/components/site/cta-section";
import { ArticleCard } from "@/components/site/article-card";
import { buildCityFaqs, buildCityIntro } from "@/lib/content/local-seo";

type CityAliasPageProps = {
  params: Promise<{ countySlug: string; citySlug: string }>;
};

export async function generateMetadata({ params }: CityAliasPageProps) {
  const { countySlug, citySlug } = await params;
  const city = await getCity(countySlug, citySlug);

  if (!city) {
    return buildMetadata({
      title: "Localitate indisponibilă",
      description: "Localitatea căutată nu există.",
    });
  }

  return buildMetadata({
    title: `Alpinism utilitar în ${city.name}, ${city.county.name}`,
    description:
      city.intro ??
      `Vezi firme de alpinism utilitar din ${city.name}, județul ${city.county.name}, pentru proiecte la înălțime și intervenții tehnice.`,
    path: `/${city.county.slug}/${city.slug}`,
  });
}

export default async function CityAliasPage({ params }: CityAliasPageProps) {
  const { countySlug, citySlug } = await params;
  const [city, options, services] = await Promise.all([
    getCity(countySlug, citySlug),
    getQuickSearchOptions(),
    getServices(),
  ]);

  if (!city) notFound();
  const faqItems = buildCityFaqs(city);
  const cityIntro = buildCityIntro(city);
  const serviceIds = city.companies.flatMap((company) => company.services.map((item) => item.serviceId));
  const relatedArticles = await getRelatedArticles([...new Set(serviceIds)]);
  const localServiceLinks = services.slice(0, 6).map((service) => ({
    href: `/${city.county.slug}/${city.slug}/${service.slug}`,
    label: `${service.name} în ${city.name}`,
  }));
  const breadcrumbItems = [
    { label: "Acasă", href: "/" },
    { label: "Județe", href: "/judete" },
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

      <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.92fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
            <h1 className="text-4xl font-black tracking-tight text-slate-950">
              Alpinism utilitar în {city.name}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {city.intro ??
                `Găsești firme din ${city.name}, județul ${city.county.name}, pentru lucrări la înălțime, fațade și mentenanță.`}
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">{cityIntro}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {city.companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>

          <SeoLinkCloud
            eyebrow="Pagini locale"
            title={`Servicii populare în ${city.name}`}
            links={localServiceLinks}
          />

          {relatedArticles.length ? (
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Articole utile pentru {city.name}</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {relatedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          ) : null}

          <FAQBlock items={faqItems} />
        </div>

        <LeadForm
          sourcePage={`/${city.county.slug}/${city.slug}`}
          countyId={city.county.id}
          countyName={city.county.name}
          cityId={city.id}
          cityName={city.name}
          counties={options.counties.map((county) => ({ id: county.id, label: county.name }))}
          services={options.services.map((service) => ({ id: service.id, label: service.name }))}
        />
      </section>

      <section className="mt-12">
        <CTASection
          eyebrow="Cerere locală"
          title={`Ai nevoie de executanți în ${city.name}? Trimite lucrarea și revenim cu soluția potrivită.`}
          description={`Descrie intervenția, adresa și gradul de urgență. Platforma centralizează intern cererea și o procesează manual pentru ${city.name}, ${city.county.name}.`}
          primaryHref="/cere-oferta"
          primaryLabel="Trimite cerere"
          secondaryHref={`/${city.county.slug}`}
          secondaryLabel={`Vezi și ${city.county.name}`}
        />
      </section>
    </div>
  );
}
