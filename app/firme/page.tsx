import { buildMetadata } from "@/lib/seo";
import { getCompaniesPage, getCounties, getServices } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CompanyCard } from "@/components/site/company-card";
import { SearchBar } from "@/components/site/search-bar";
import { SeoLinkCloud } from "@/components/site/seo-link-cloud";
import { CTASection } from "@/components/site/cta-section";
import { PaginationNav } from "@/components/site/pagination-nav";

export const metadata = buildMetadata({
  title: "Toate firmele de alpinism utilitar din Romania",
  description:
    "Lista de firme de alpinism utilitar organizate pentru cautari rapide dupa judet, oras si servicii.",
  path: "/firme",
});

type CompaniesPageProps = {
  searchParams: Promise<{
    q?: string;
    county?: string;
    city?: string;
    service?: string;
    page?: string;
  }>;
};

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const params = await searchParams;
  const requestedPage = Math.max(1, Number(params.page ?? "1") || 1);
  const [{ companies, total, page: safePage, totalPages }, counties, services] = await Promise.all([
    getCompaniesPage(
      {
        q: params.q,
        countySlug: params.county,
        citySlug: params.city,
        serviceSlug: params.service,
      },
      requestedPage,
      12,
    ),
    getCounties(),
    getServices(),
  ]);
  const searchCounties = counties.slice(0, 10);
  const searchCities = counties.flatMap((county) => county.cities ?? []).slice(0, 30);
  const searchServices = services.slice(0, 10);

  const countyLinks = counties.slice(0, 12).map((county) => ({
    href: `/${county.slug}`,
    label: `Firme din ${county.name}`,
  }));

  const serviceLinks = services.slice(0, 12).map((service) => ({
    href: `/servicii/${service.slug}`,
    label: service.name,
  }));
  const getLocalBadge = (company: (typeof companies)[number]): "direct" | "coverage" | undefined => {
    if (params.city) {
      if (company.city.slug === params.city) return "direct";
      if (company.coverage.some((coverage) => coverage.city?.slug === params.city)) return "coverage";
    }

    if (params.county) {
      if (company.county.slug === params.county) return "direct";
      if (company.coverage.some((coverage) => coverage.county?.slug === params.county)) return "coverage";
    }

    return undefined;
  };
  const getAreaBadge = (company: (typeof companies)[number]): "city" | "county" | undefined => {
    if (params.city) {
      if (company.city.slug === params.city || company.coverage.some((coverage) => coverage.city?.slug === params.city)) {
        return "city";
      }
      if (
        params.county &&
        (company.county.slug === params.county ||
          company.coverage.some((coverage) => coverage.county?.slug === params.county))
      ) {
        return "county";
      }
      return undefined;
    }

    if (params.county) {
      if (company.county.slug === params.county || company.coverage.some((coverage) => coverage.county?.slug === params.county)) {
        return "county";
      }
    }

    return undefined;
  };
  const directCount = companies.filter((company) => getLocalBadge(company) === "direct").length;
  const coverageCount = companies.filter((company) => getLocalBadge(company) === "coverage").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Firme" }]} />

      <div className="mt-6 grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Firme de alpinism utilitar din Romania
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            Filtreaza dupa judet, oras si tip de lucrare, apoi trimite o singura cerere pentru a fi
            analizata intern si corelata cu executantii potriviti.
          </p>
          {(params.q || params.county || params.city || params.service) ? (
            <p className="text-sm text-slate-500">
              Filtre active: {[params.q, params.county, params.city, params.service].filter(Boolean).join(" · ")}
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              Acoperire nationala completa, cu prioritizare pe nevoile clientului si ofertare corecta.
            </p>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
          <p className="text-sm font-semibold text-slate-900">Cauta direct in listarea centralizata</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Filtrarea te ajuta sa ajungi mai repede la profile active, servicii relevante si zonele
            unde firmele intervin frecvent.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <SearchBar counties={searchCounties} cities={searchCities} services={searchServices} />
      </div>

      <section className="mt-10 grid gap-4 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-slate-50 p-6 shadow-sm shadow-slate-950/5 md:grid-cols-3">
        <div>
          <p className="text-3xl font-black text-slate-950">{total}+</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">profile afisate in functie de filtrele actuale.</p>
        </div>
        <div>
          <p className="text-3xl font-black text-slate-950">{counties.length}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">judete disponibile pentru navigare SEO si selectie rapida.</p>
        </div>
        <div>
          <p className="text-3xl font-black text-slate-950">{services.length}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            verticale comerciale pentru lucrari la inaltime, fatade, arbori si interventii tehnice.
          </p>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Lista nationala de firme</h2>
            <p className="text-sm leading-7 text-slate-600">
              Fiecare card trimite catre profilul firmei, serviciile principale si formularul de cerere.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Rezultate ordonate pentru conversie: firme recomandate, profile complete, servicii vizibile.
          </p>
        </div>
        {(params.county || params.city || params.service) ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
              <span className="font-semibold">{total}</span> rezultate pentru filtrele active
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
              <span className="font-semibold">{directCount}</span> potriviri directe pe pagina curenta
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
              <span className="font-semibold">{coverageCount}</span> firme care acoperă zona pe pagina curenta
            </div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Primele rezultate favorizează proximitatea și serviciul cerut
            </div>
          </div>
        ) : null}
      </section>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            localBadge={getLocalBadge(company)}
            areaBadge={getAreaBadge(company)}
          />
        ))}
      </div>
      <PaginationNav
        currentPage={safePage}
        totalPages={totalPages}
        basePath="/firme"
        searchParams={{
          q: params.q,
          county: params.county,
          city: params.city,
          service: params.service,
        }}
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <SeoLinkCloud
          title="Cautari populare dupa judet"
          description="Construieste rapid un traseu intern catre judetele cu cea mai mare intentie comerciala."
          links={countyLinks}
        />
        <SeoLinkCloud
          title="Servicii comerciale importante"
          description="Pagini dedicate pentru lucrari la inaltime si interventii conexe cautate frecvent."
          links={serviceLinks}
        />
      </div>

      <div className="mt-10">
        <CTASection
          eyebrow="Cerere centralizata"
          title="Nu stii exact ce firma sa alegi? Trimite o singura cerere si revenim cu executantii potriviti."
          description="Platforma nu trimite automat mesajul catre toate firmele. Cererea este analizata intern si corelata cu zona, urgenta si tipul lucrarii."
          primaryAction={{ href: "/cere-oferta", label: "Trimite cererea acum" }}
          secondaryAction={{ href: "/judete", label: "Vezi judetele" }}
        />
      </div>
    </div>
  );
}
