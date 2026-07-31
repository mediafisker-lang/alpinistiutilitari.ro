import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Clock3,
  Factory,
  Grid2X2,
  Headphones,
  MapPinned,
  Megaphone,
  ShieldCheck,
  Sparkles,
  TreePine,
  Wrench,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getQuickSearchOptions, getServices } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ServiceCard } from "@/components/site/service-card";
import { ServiceFilters } from "@/components/services/service-filters";

const industrialLinks = [
  "alpinism-industrial-greu",
  "inspectii-ndt-la-inaltime",
  "protectie-anticoroziva-la-inaltime",
  "mentenanta-cosuri-industriale",
  "mentenanta-turbine-eoliene",
  "mentenanta-structuri-metalice-industriale",
] as const;

const categoryTabs = [
  { value: "toate", label: "Toate serviciile", icon: Grid2X2 },
  { value: "fatade", label: "Fațade", icon: Building2 },
  { value: "acoperisuri", label: "Acoperișuri", icon: Wrench },
  { value: "arbori", label: "Arbori", icon: TreePine },
  { value: "industrial", label: "Industrial", icon: Factory },
  { value: "publicitate", label: "Publicitate", icon: Megaphone },
  { value: "urgente", label: "Urgențe", icon: Sparkles },
] as const;

const workTypes = [
  { value: "toate", label: "Toate tipurile" },
  { value: "curatare", label: "Curățare și spălare" },
  { value: "montaj", label: "Montaj și instalare" },
  { value: "reparatii", label: "Reparații și mentenanță" },
  { value: "inspectii", label: "Inspecții și protecție" },
] as const;

type SearchParams = {
  categorie?: string;
  judet?: string;
  tip?: string;
  firme?: string;
};

function serviceSearchText(service: { name: string; slug: string; category: string | null }) {
  return `${service.name} ${service.slug} ${service.category ?? ""}`.toLowerCase();
}

function matchesCategory(
  service: { name: string; slug: string; category: string | null },
  category: string,
) {
  if (category === "toate") return true;
  const text = serviceSearchText(service);

  const terms: Record<string, string[]> = {
    fatade: ["fatad", "tencuiala", "balcon", "geam", "pereti-cortina", "termoizol"],
    acoperisuri: ["acoperis", "jgheab", "burlan", "turtur", "deszapez", "panouri-solare"],
    arbori: ["arbor", "copac"],
    industrial: [
      "industrial",
      "siloz",
      "turbine",
      "poduri",
      "viaducte",
      "portuar",
      "naval",
      "spatii-confinate",
      "structuri-metalice",
      "tubulaturi",
    ],
    publicitate: ["publicitate", "banner", "mesh", "litere", "firme-luminoase", "decoratiuni"],
    urgente: ["urgent", "siguranta", "turtur", "deszapez"],
  };

  return terms[category]?.some((term) => text.includes(term)) ?? true;
}

function matchesWorkType(
  service: { name: string; slug: string; category: string | null },
  workType: string,
) {
  if (workType === "toate") return true;
  const text = serviceSearchText(service);
  const terms: Record<string, string[]> = {
    curatare: ["curata", "spalare", "deszapez", "turtur"],
    montaj: ["montaj", "structur", "tubulaturi", "paratrasnet", "antene"],
    reparatii: ["repar", "mentenanta", "vops", "etans", "hidroizol", "termoizol"],
    inspectii: ["inspect", "protect", "siguranta", "ndt", "foto-video"],
  };
  return terms[workType]?.some((term) => text.includes(term)) ?? true;
}

function categoryHref(category: string, filters: SearchParams) {
  const params = new URLSearchParams();
  if (category !== "toate") params.set("categorie", category);
  if (filters.judet) params.set("judet", filters.judet);
  if (filters.tip && filters.tip !== "toate") params.set("tip", filters.tip);
  if (filters.firme && filters.firme !== "0") params.set("firme", filters.firme);
  const query = params.toString();
  return query ? `/servicii?${query}` : "/servicii";
}

export const metadata = buildMetadata({
  title: "Servicii de alpinism utilitar în România",
  description:
    "Descoperă toate serviciile de alpinism utilitar: acoperișuri, fațade, geamuri, lucrări industriale, publicitate, arbori și intervenții urgente.",
  path: "/servicii",
});

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [services, options, filters] = await Promise.all([
    getServices(),
    getQuickSearchOptions(),
    searchParams,
  ]);

  const selectedCategory = categoryTabs.some((tab) => tab.value === filters.categorie)
    ? filters.categorie!
    : "toate";
  const selectedWorkType = workTypes.some((type) => type.value === filters.tip)
    ? filters.tip!
    : "toate";
  const selectedCounty = options.counties.find((county) => county.slug === filters.judet);
  const minimumCompanies = Math.max(0, Number(filters.firme ?? "0") || 0);
  const filteredServices = services.filter(
    (service) =>
      matchesCategory(service, selectedCategory) &&
      matchesWorkType(service, selectedWorkType) &&
      service._count.companies >= minimumCompanies,
  );
  const servicesBySlug = new Map(services.map((service) => [service.slug, service]));

  function serviceHref(slug: string) {
    return selectedCounty ? `/${selectedCounty.slug}/${slug}` : `/servicii/${slug}`;
  }

  return (
    <div className="services-directory bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_34%)] pb-16">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: "Servicii" }]} />

        <header className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#102A43] sm:text-4xl lg:text-[2.6rem]">
              Servicii de alpinism utilitar și lucrări la înălțime
            </h1>
            <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
              Intervenții la înălțime pentru fațade, acoperișuri, arbori, structuri industriale,
              publicitate și urgențe. Alege categoria potrivită sau explorează toate cele {services.length} de servicii disponibile.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[500px]">
            {[
              { icon: ShieldCheck, title: "Firme verificate", text: "Selecție atentă" },
              { icon: MapPinned, title: "Acoperire națională", text: "Toate județele" },
              { icon: Clock3, title: "Răspuns rapid", text: "Intervenții eficiente" },
            ].map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#B8CDE8] text-[#164B8A]">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-[#102A43]">{benefit.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{benefit.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </header>

        <nav
          aria-label="Categorii servicii"
          className="mt-7 flex snap-x gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_10px_28px_rgba(16,42,67,0.06)] lg:grid lg:grid-cols-7 lg:overflow-visible"
        >
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.value;
            return (
              <Link
                key={tab.value}
                href={categoryHref(tab.value, filters)}
                className={[
                  "inline-flex min-h-12 shrink-0 snap-start items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition lg:px-2",
                  isActive
                    ? "bg-[#082F55] text-white shadow-[0_8px_20px_rgba(8,47,85,0.2)]"
                    : "text-[#164B8A] hover:bg-slate-50",
                ].join(" ")}
              >
                <Icon className="size-5" />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <ServiceFilters
              categories={categoryTabs.map(({ value, label }) => ({ value, label }))}
              counties={options.counties}
              workTypes={workTypes}
              selectedCategory={selectedCategory}
              selectedCountySlug={selectedCounty?.slug ?? ""}
              selectedWorkType={selectedWorkType}
              minimumCompanies={minimumCompanies}
            />

            <div className="mt-5 hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] lg:block">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF5FF] text-[#0063F7]">
                  <Headphones className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-[#102A43]">Ai nevoie de ajutor?</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Sună-ne pentru o ofertă personalizată.</p>
                </div>
              </div>
              <a href="tel:+40799102030" className="mt-4 block text-sm font-extrabold text-[#102A43]">0799 102 030</a>
              <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#0063F7]">
                Contactează-ne <ArrowRight className="size-4" />
              </Link>
            </div>
          </aside>

          <div className="min-w-0">
            <section className="relative overflow-hidden rounded-2xl bg-[#082F55] p-6 text-white shadow-[0_16px_38px_rgba(8,47,85,0.18)] sm:p-8">
              <Image
                src="/images/articles/vopsitorie-industriala.jpg"
                alt="Alpiniști industriali pe o structură metalică"
                fill
                sizes="(max-width: 1023px) 100vw, 75vw"
                className="object-cover object-center opacity-[0.38]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,31,62,0.98)_0%,rgba(4,31,62,0.89)_54%,rgba(4,31,62,0.48)_100%)]" />
              <div className="relative z-10">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#FF6B0B]">Divizie industrială</p>
                <h2 className="mt-3 text-2xl font-black !text-white sm:text-3xl">Alpinism industrial greu</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
                  Pagini dedicate pentru rafinării, porturi, șantiere navale, combinate, termocentrale,
                  turbine eoliene, hale și structuri metalice cu acces dificil.
                </p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {industrialLinks.map((slug) => {
                    const service = servicesBySlug.get(slug);
                    if (!service) return null;
                    return (
                      <Link key={slug} href={serviceHref(slug)} className="flex items-center justify-between rounded-xl border border-white/12 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/18">
                        {service.shortName ?? service.name}
                        <ArrowRight className="size-4" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#0063F7]">Catalog complet</p>
                <h2 className="mt-1 text-2xl font-black text-[#102A43]">
                  {selectedCounty ? `Servicii în ${selectedCounty.name}` : "Toate serviciile disponibile"}
                </h2>
              </div>
              <p className="text-sm font-semibold text-slate-500">{filteredServices.length} rezultate</p>
            </div>

            {filteredServices.length ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredServices.map((service) => (
                  <div key={service.id} className="service-directory-card">
                    <ServiceCard
                      service={service}
                      count={service._count.companies}
                      href={serviceHref(service.slug)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="font-bold text-[#102A43]">Nu am găsit servicii pentru filtrele selectate.</p>
                <Link href="/servicii" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#0063F7]">
                  Resetează filtrele
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
