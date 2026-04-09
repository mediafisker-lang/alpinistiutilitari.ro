import Link from "next/link";
import { notFound } from "next/navigation";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildMetadata } from "@/lib/seo";
import { getQuickSearchOptions, getService } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CompanyCard } from "@/components/site/company-card";
import { ArticleCard } from "@/components/site/article-card";
import { SeoLinkCloud } from "@/components/site/seo-link-cloud";
import { CTASection } from "@/components/site/cta-section";
import { buildServiceCommercialBlocks, buildServiceFaqs } from "@/lib/content/local-seo";
import { LeadForm } from "@/components/forms/lead-form";
import { FAQBlock } from "@/components/site/faq-block";
import { getPrimaryCompanies } from "@/lib/company-ranking";
import { PaginationNav } from "@/components/site/pagination-nav";

type Props = {
  params: Promise<{ serviceSlug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { serviceSlug } = await params;
  const service = await getService(serviceSlug);

  if (!service) {
    return buildMetadata({
      title: "Serviciu indisponibil",
      description: "Serviciul cautat nu exista.",
    });
  }

  return buildMetadata({
    title: service.seoTitle ?? `${service.name} - firme din Romania`,
    description: service.seoDescription ?? service.shortDescription,
    path: `/servicii/${service.slug}`,
  });
}

export default async function ServicePage({ params, searchParams }: Props) {
  const { serviceSlug } = await params;
  const { page } = await searchParams;
  const [service, options] = await Promise.all([getService(serviceSlug), getQuickSearchOptions()]);

  if (!service) notFound();

  const companies = service.companies.map((item) => item.company);
  const primaryCompanies = getPrimaryCompanies(companies, 48);
  const pageSize = 9;
  const currentPage = Math.max(1, Number(page ?? "1") || 1);
  const totalPages = Math.max(1, Math.ceil(primaryCompanies.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedCompanies = primaryCompanies.slice((safePage - 1) * pageSize, safePage * pageSize);
  const articles = service.articles.map((item) => item.article);
  const faqItems = buildServiceFaqs(service);
  const commercialBlocks = buildServiceCommercialBlocks(service);
  const dynamicCountyLinks = [...new Map(
    companies.map((company) => [
      company.county.slug,
      { href: `/${company.county.slug}/${service.slug}`, label: `${service.name} în ${company.county.name}` },
    ]),
  ).values()];
  const isFacadeRiskService =
    service.slug === "decopertari-tencuiala" || service.slug === "punere-in-siguranta-fatade";
  const strategicCountyLinks =
    service.slug === "decopertari-tencuiala"
      ? [
          { href: `/bucuresti/decopertari-tencuiala`, label: "Decopertari tencuiala in Bucuresti" },
          { href: `/ilfov/decopertari-tencuiala`, label: "Decopertari tencuiala in Ilfov" },
        ]
      : service.slug === "punere-in-siguranta-fatade"
        ? [
            {
              href: `/bucuresti/punere-in-siguranta-fatade`,
              label: "Punere in siguranta fatade in Bucuresti",
            },
            {
              href: `/ilfov/punere-in-siguranta-fatade`,
              label: "Punere in siguranta fatade in Ilfov",
            },
          ]
        : [];
  const countyLinks = [...new Map(
    [...strategicCountyLinks, ...dynamicCountyLinks].map((item) => [item.href, item]),
  ).values()].slice(0, 8);
  const breadcrumbItems = [
    { label: "Acasa", href: "/" },
    { label: "Servicii", href: "/servicii" },
    { label: service.name },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);
  const faqJsonLd = buildFaqJsonLd(faqItems);
  const topCountyCount = new Set(companies.map((company) => company.countyId)).size;
  const featuredCount = companies.filter((company) => company.isFeatured).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            {service.name}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {service.longDescription}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
              <p className="text-sm font-medium text-slate-500">Firme relevante</p>
              <p className="mt-3 text-3xl font-black text-slate-950">{companies.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
              <p className="text-sm font-medium text-slate-500">Județe active</p>
              <p className="mt-3 text-3xl font-black text-slate-950">{topCountyCount}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
              <p className="text-sm font-medium text-slate-500">Firme recomandate</p>
              <p className="mt-3 text-3xl font-black text-slate-950">{featuredCount}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {commercialBlocks.map((block) => (
              <div key={block.title} className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-950/5">
                <h2 className="text-base font-bold text-slate-950">{block.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{block.content}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Cautari populare
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Pleacă direct spre pagini locale cu intenție comercială mare și trimite mai rapid cererea potrivită.
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <Link href="/bucuresti" className="block font-medium text-slate-700 hover:text-sky-700">
              {service.name} Bucuresti
            </Link>
            <Link href="/brasov" className="block font-medium text-slate-700 hover:text-sky-700">
              {service.name} Brasov
            </Link>
            <Link href="/ilfov" className="block font-medium text-slate-700 hover:text-sky-700">
              {service.name} Ilfov
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <SeoLinkCloud
          eyebrow="Combinații locale"
          title={`Pagini locale pentru ${service.name.toLowerCase()}`}
          links={countyLinks}
        />
      </section>

      {isFacadeRiskService ? (
        <section className="mt-10 rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-2xl font-bold text-slate-950">Interventii conexe pentru fatade periculoase</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Pentru proiectele unde degradarea fatadei implica si faze de demolare controlata,
            poti combina cererea de alpinism utilitar cu servicii conexe de pe platforma partenera.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link
              href={
                service.slug === "punere-in-siguranta-fatade"
                  ? "/bucuresti/punere-in-siguranta-fatade"
                  : "/bucuresti/decopertari-tencuiala"
              }
              className="rounded-full border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
            >
              {service.slug === "punere-in-siguranta-fatade"
                ? "punere in siguranta fatade in Bucuresti"
                : "decopertari tencuiala in Bucuresti"}
            </Link>
            <Link
              href={
                service.slug === "punere-in-siguranta-fatade"
                  ? "/ilfov/punere-in-siguranta-fatade"
                  : "/ilfov/decopertari-tencuiala"
              }
              className="rounded-full border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
            >
              {service.slug === "punere-in-siguranta-fatade"
                ? "punere in siguranta fatade in Ilfov"
                : "decopertari tencuiala in Ilfov"}
            </Link>
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
              evaluare pentru fatade degradate pe demolare.ro
            </a>
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Firme principale pentru acest serviciu</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Prioritizăm profilele cu semnale comerciale și locale mai bune, pentru a ajuta clientul
              să ajungă mai repede la executanți relevanți.
            </p>
          </div>
          <p className="text-sm text-slate-500">Pagina {safePage} din {totalPages}</p>
        </div>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <span className="font-semibold">{companies.filter((company) => company.isVerified).length}</span> firme verificate
          </div>
          <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
            <span className="font-semibold">{companies.filter((company) => company.website).length}</span> au website disponibil
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
            <span className="font-semibold">{companies.filter((company) => company.phone).length}</span> au contact direct
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
            Rezultatele sunt ordonate după relevanță pentru {service.name.toLowerCase()}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {paginatedCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
        <PaginationNav
          currentPage={safePage}
          totalPages={totalPages}
          basePath={`/servicii/${service.slug}`}
        />
      </section>

      {articles.length ? (
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-950">Articole utile pentru acest serviciu</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <FAQBlock items={faqItems} />
        <LeadForm
          sourcePage={`/servicii/${service.slug}`}
          serviceId={service.id}
          selectableCompanies={primaryCompanies.slice(0, 10).map((company) => ({
            id: company.id,
            label: `${company.name} · ${company.city?.name ?? "Localitate neprecizată"}, ${company.county?.name ?? "Județ neprecizat"}`,
          }))}
          counties={options.counties.map((item) => ({ id: item.id, label: item.name }))}
          services={options.services.map((item) => ({ id: item.id, label: item.name }))}
        />
      </section>

      <section className="mt-12">
        <CTASection
          eyebrow="Cerere pe serviciu"
          title={`Ai nevoie de ${service.name.toLowerCase()}? Trimite cererea și o direcționăm intern.`}
          description="Completezi formularul cu județul, orașul, adresa și urgența, iar platforma selectează manual firmele candidate în funcție de serviciul ales."
          primaryHref="/cere-oferta"
          primaryLabel="Trimite cerere"
          secondaryHref="/firme"
          secondaryLabel="Vezi toate firmele"
        />
      </section>
    </div>
  );
}
