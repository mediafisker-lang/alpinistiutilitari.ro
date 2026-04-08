import { notFound } from "next/navigation";
import { buildBreadcrumbJsonLd, buildCompanyJsonLd, buildMetadata } from "@/lib/seo";
import { getCompanies, getCompany, getQuickSearchOptions, getRelatedArticles, getServices } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { FAQBlock } from "@/components/site/faq-block";
import { Badge } from "@/components/ui/badge";
import { SeoLinkCloud } from "@/components/site/seo-link-cloud";
import { CTASection } from "@/components/site/cta-section";
import { ArticleCard } from "@/components/site/article-card";
import { getPrimaryCompanies } from "@/lib/company-ranking";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) {
    return buildMetadata({
      title: "Firma indisponibila",
      description: "Profilul firmei cautate nu exista.",
    });
  }

  return buildMetadata({
    title: `${company.name} - ${company.city.name}, ${company.county.name}`,
    description: company.descriptionShort,
    path: `/firme/${company.slug}`,
    noIndex: true,
  });
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const [company, options, services] = await Promise.all([getCompany(slug), getQuickSearchOptions(), getServices()]);

  if (!company) notFound();

  const relatedArticles = await getRelatedArticles(company.services.map((item) => item.serviceId));
  const nearbyCompanies = getPrimaryCompanies(
    (await getCompanies({
      countySlug: company.county.slug,
      citySlug: company.city.slug,
      serviceSlug: company.services[0]?.service.slug,
    })).filter((item) => item.id !== company.id),
    6,
  );

  const breadcrumbItems = [
    { label: "Acasa", href: "/" },
    { label: "Firme", href: "/firme" },
    { label: company.county.name, href: `/${company.county.slug}` },
    { label: company.city.name, href: `/${company.county.slug}/${company.city.slug}` },
    { label: company.name },
  ];
  const companyJsonLd = buildCompanyJsonLd({
    name: company.name,
    description: company.descriptionShort,
    path: `/firme/${company.slug}`,
    phone: company.phone,
    email: company.email,
    website: company.website,
    address: company.address,
    city: company.city.name,
    county: company.county.name,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  const countyServiceLinks = company.services.map((item) => ({
    href: `/${company.county.slug}/${item.service.slug}`,
    label: `${item.service.name} ${company.county.name}`,
  }));
  const cityServiceLinks = company.services.map((item) => ({
    href: `/${company.county.slug}/${company.city.slug}/${item.service.slug}`,
    label: `${item.service.name} ${company.city.name}`,
  }));
  const complementaryServiceLinks = services
    .filter((service) => !company.services.some((item) => item.serviceId === service.id))
    .slice(0, 8)
    .map((service) => ({
      href: `/servicii/${service.slug}`,
      label: service.name,
    }));
  const selectableCompanies = [
    {
      id: company.id,
      label: `${company.name} · ${company.city?.name ?? "Localitate neprecizată"}, ${company.county?.name ?? "Județ neprecizat"}`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(companyJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge>{company.verificationStatus === "verified" ? "Verificata" : "Profil activ"}</Badge>
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">În orașul tău</Badge>
              <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100">În județul tău</Badge>
              {company.isFeatured ? <Badge>Recomandată</Badge> : null}
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950">{company.name}</h1>
            <p className="text-lg leading-8 text-slate-600">{company.descriptionShort}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Proximitate</p>
              <p className="mt-2 text-sm font-medium text-slate-900">Activă în {company.city.name}</p>
              <p className="mt-2 text-sm text-slate-600">Lucrare locală, contact mai rapid și context mai clar.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Servicii</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{company.services.length} servicii asociate</p>
              <p className="mt-2 text-sm text-slate-600">Profilele sunt ordonate și după relevanța comercială.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Acoperire</p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {Math.max(company.coverage.length, 1)} {Math.max(company.coverage.length, 1) === 1 ? "zonă" : "zone"}
              </p>
              <p className="mt-2 text-sm text-slate-600">Zona principală și ariile secundare unde poate interveni.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Localizare</p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {company.city.name}, {company.county.name}
              </p>
              {company.address ? <p className="mt-2 text-sm text-slate-600">{company.address}</p> : null}
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Contact</p>
              {company.phone ? <p className="mt-2 text-sm text-slate-900">{company.phone}</p> : null}
              {company.email ? <p className="mt-2 text-sm text-slate-600">{company.email}</p> : null}
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-sm font-medium text-sky-700"
                >
                  Website oficial
                </a>
              ) : null}
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Sursa profil</p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {company.sourceType === "google_places"
                  ? "Importat prin Google Places API"
                  : company.sourceType === "claimed"
                    ? "Revendicat si completat de firma"
                    : "Adaugat manual in platforma"}
              </p>
              {company.ratingValue ? (
                <p className="mt-2 text-sm text-slate-600">
                  Rating: {company.ratingValue.toFixed(1)} / 5 ({company.ratingCount ?? 0} recenzii)
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-950">Servicii relevante</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {company.services.map((item) => (
                <a
                  key={item.id}
                  href={`/servicii/${item.service.slug}`}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                >
                  {item.service.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-950">Descriere</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">
              {company.descriptionLong}
            </p>
          </div>

          {company.coverage.length ? (
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Arii de acoperire</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {company.coverage.map((coverage) => (
                  <a
                    key={coverage.id}
                    href={coverage.city ? `/${company.county.slug}/${coverage.city.slug}` : coverage.county ? `/${coverage.county.slug}` : "#"} 
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    {coverage.city?.name ?? coverage.county?.name ?? "Zonă activă"}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <FAQBlock
            items={[
              {
                question: `Ce tipuri de lucrări poate prelua ${company.name}?`,
                answer:
                  "Profilul public afișează serviciile asociate și zona principală de intervenție. Pentru clarificări, trimite o cerere prin formularul intern.",
              },
              {
                question: "Cererea ajunge direct la firmă?",
                answer:
                  "Nu. Cererea este înregistrată intern, apoi este analizată manual pentru a reveni cu soluția potrivită și executanții relevanți.",
              },
            ]}
          />
        </div>

        <LeadForm
          companyId={company.id}
          selectableCompanies={selectableCompanies}
          selectedCompanyIds={[company.id]}
          serviceId={company.services[0]?.serviceId}
          countyId={company.county.id}
          countyName={company.county.name}
          cityId={company.city.id}
          cityName={company.city.name}
          sourcePage={`/firme/${company.slug}`}
          counties={options.counties.map((county) => ({ id: county.id, label: county.name }))}
          services={options.services.map((service) => ({ id: service.id, label: service.name }))}
        />
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <SeoLinkCloud
          title={`Servicii în ${company.county.name}`}
          description="Trimite vizitatorul către paginile comerciale locale cele mai apropiate de lucrarea sa."
          links={countyServiceLinks}
        />
        <SeoLinkCloud
          title={`Servicii în ${company.city.name}`}
          description="Leagă profilul firmei de pagina locală a orașului pentru căutări de proximitate."
          links={cityServiceLinks}
        />
        <SeoLinkCloud
          title="Alte servicii din platformă"
          description="Extinde navigarea către alte verticale SEO și comerciale relevante."
          links={complementaryServiceLinks}
        />
      </div>

      {nearbyCompanies.length ? (
        <section className="mt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Alternative locale</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Alte firme din aceeași zonă și cu servicii apropiate
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Dacă vrei să compari mai multe opțiuni, poți vedea și alte firme din {company.city.name} și {company.county.name}.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {nearbyCompanies.map((item) => (
              <a
                key={item.id}
                href={`/firme/${item.slug}`}
                className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/60"
              >
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-emerald-50 text-emerald-800 hover:bg-emerald-50">În zona ta</Badge>
                  {item.isFeatured ? <Badge>Recomandată</Badge> : null}
                </div>
                <h3 className="mt-3 text-xl font-bold text-slate-950">{item.name}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{item.descriptionShort}</p>
                <p className="mt-4 text-sm font-medium text-slate-700">
                  {item.city.name}, {item.county.name}
                </p>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {relatedArticles.length ? (
        <section className="mt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Articole utile</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Ghiduri relevante pentru tipurile de lucrari prestate
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Aceste articole ajută clientul să înțeleagă mai bine intervenția, riscurile și criteriile de alegere.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-10">
        <CTASection
          eyebrow="Ai deja o firmă în minte?"
          title="Trimite cererea direct din platformă și revenim manual cu pașii următori."
          description="Cererea este salvată intern și analizată înainte de a fi corelată cu executanții disponibili. Asta reduce zgomotul și crește șansa unui răspuns util."
          primaryAction={{ href: "/cere-oferta", label: "Trimite cererea" }}
          secondaryAction={{ href: `/${company.county.slug}`, label: `Vezi și alte firme din ${company.county.name}` }}
        />
      </div>
    </div>
  );
}
