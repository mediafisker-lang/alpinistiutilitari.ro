import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getHomepageData, getQuickSearchOptions } from "@/lib/data/queries";
import { RomaniaMap } from "@/components/maps/romania-map";
import { CompanyCard } from "@/components/site/company-card";
import { CountyCard } from "@/components/site/county-card";
import { ServiceCard } from "@/components/site/service-card";
import { ArticleCard } from "@/components/site/article-card";
import { SeoLinkCloud } from "@/components/site/seo-link-cloud";
import { LeadForm } from "@/components/forms/lead-form";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Firme de alpinism utilitar in Romania",
  description:
    "Platforma orientata pe lead generation pentru alpinism utilitar, cu cautare rapida pe judete, orase si servicii.",
  path: "/",
});

export default async function HomePage() {
  const [{ featuredCompanies, counties, services, articles, stats }, options] =
    await Promise.all([getHomepageData(), getQuickSearchOptions()]);

  const countyLinks = counties.slice(0, 8).map((county) => ({
    href: `/${county.slug}`,
    label: `Firme în ${county.name}`,
  }));
  const serviceLinks = services.slice(0, 8).map((service) => ({
    href: `/servicii/${service.slug}`,
    label: service.name,
  }));
  const localDemandLinks = counties.slice(0, 4).flatMap((county) =>
    services.slice(0, 2).map((service) => ({
      href: `/${county.slug}/${service.slug}`,
      label: `${service.name} în ${county.name}`,
    })),
  );

  const heroHighlights = [
    {
      title: "Răspuns rapid",
      description:
        "Cererea ajunge intern și este verificată înainte de a fi direcționată spre executanți.",
      icon: Clock3,
    },
    {
      title: "Acoperire reală",
      description:
        "Liste locale pe județe, orașe și servicii cu intenție comercială ridicată.",
      icon: MapPinned,
    },
    {
      title: "Selecție clară",
      description:
        "Compari firme și profiluri relevante, fără să cauți separat în zeci de locuri.",
      icon: ShieldCheck,
    },
  ];

  const quickAnchors = [
    { href: "#servicii", label: "Servicii" },
    { href: "#judete", label: "Județe" },
    { href: "#firme", label: "Firme" },
    { href: "#ghiduri", label: "Articole" },
    { href: "#cerere", label: "Cerere" },
  ];

  const supportSites = [
    {
      href: "https://www.expertcopaci.ro",
      label: "expertcopaci.ro",
      description: "Toaletări și tăieri de copaci în zone dificile.",
    },
    {
      href: "https://www.dubamarfa.ro",
      label: "dubamarfa.ro",
      description: "Transport rapid pentru materiale, moloz și echipamente.",
    },
  ];

  return (
    <div className="pb-16">
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="relative overflow-hidden rounded-[2.6rem] border border-white/70 bg-[linear-gradient(135deg,rgba(4,23,52,0.98),rgba(0,87,219,0.96)_52%,rgba(0,99,247,0.94)_72%,rgba(227,30,36,0.90)_100%)] px-5 py-6 text-white shadow-[0_34px_90px_rgba(8,26,58,0.24)] sm:px-7 sm:py-8 lg:px-8 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.16),transparent_22%)]" />
          <div className="pointer-events-none absolute -left-16 top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#e31e24]/30 blur-3xl" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1d3f] via-transparent to-transparent" />
            <Image
              src="/hero-alpinisti-photo.jpg"
              alt="Echipă de alpinism utilitar la lucru pe fațadă"
              fill
              priority
              className="object-cover object-[82%_center] opacity-30 mix-blend-screen"
            />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-6 animate-rise-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
                <Sparkles className="size-4" />
                PLATFORMA NATIONALA DE ALPINISM UTILITAR
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-100/90">
                  Interfață nouă, clară și rapidă
                </p>
                <h1 className="font-display max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Găsești rapid firme de alpinism utilitar și trimiți o singură cerere relevantă.
                </h1>
                <p className="max-w-3xl text-base leading-8 text-sky-50/88 sm:text-lg">
                  Pagina principală este acum gândită mai aproape de logica unui marketplace
                  modern: ofertă clară din primul ecran, navigare rapidă pe servicii și județe,
                  plus un flux simplu de cerere pentru mobil și desktop.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/cere-oferta"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-slate-950/20 transition hover:bg-slate-100"
                >
                  Trimite cererea acum
                  <ArrowRight className="ml-2 size-4" />
                </Link>
                <Link
                  href="/firme"
                  className="inline-flex items-center justify-center rounded-full border border-white/24 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/14"
                >
                  Vezi firmele listate
                </Link>
              </div>

              <div className="rounded-[2rem] border border-white/16 bg-white/10 p-5 text-white shadow-[0_20px_44px_rgba(2,12,27,0.2)] backdrop-blur-xl sm:p-6">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-100/86">
                  Alpinism Utilitar România
                </p>
                <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
                  Cere oferte rapide de la firme verificate!
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-7 text-white/84 sm:text-base">
                  <p>
                    Ai nevoie de lucrări la înălțime? Spălare geamuri, montaj bannere,
                    reparații fațade, intervenții pe acoperișuri sau copaci?
                  </p>
                  <p>
                    Pe <span className="font-bold text-white">www.alpinistiutilitari.ro</span> trimiți o
                    singură cerere și primești oferte de la mai multe firme de alpinism utilitar din
                    județul tău sau din toată țara, în aproximativ 15 minute.
                  </p>
                  <p>
                    Compari prețurile, experiența și recenziile, apoi alegi cea mai bună echipă.
                  </p>
                  <p className="font-semibold text-white">Simplu, rapid și gratuit pentru tine!</p>
                </div>
                <div className="mt-5">
                  <a
                    href="#cerere"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-black uppercase tracking-[0.08em] text-slate-950 transition hover:bg-slate-100"
                  >
                    Cere ofertă acum
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: `${stats.companies}+`, label: "firme active" },
                  { value: `${stats.counties}`, label: "județe acoperite" },
                  { value: `${stats.services}+`, label: "servicii populare" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.6rem] border border-white/16 bg-white/10 px-4 py-4 backdrop-blur"
                  >
                    <p className="text-2xl font-black text-white">{item.value}</p>
                    <p className="mt-1 text-sm text-white/78">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {heroHighlights.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className={[
                        "rounded-[1.7rem] border border-white/14 bg-white/8 p-4 backdrop-blur",
                        index > 0 ? "animate-rise-in animate-delay-1" : "",
                      ].join(" ")}
                    >
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-white/14 text-white">
                        <Icon className="size-5" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/72">{item.description}</p>
                    </div>
                  );
                })}
              </div>

              <nav
                aria-label="Navigare în pagină"
                className="flex flex-wrap gap-2 rounded-[1.7rem] border border-white/14 bg-white/8 p-3 backdrop-blur animate-rise-in animate-delay-2"
              >
                {quickAnchors.map((anchor) => (
                  <a
                    key={anchor.href}
                    href={anchor.href}
                    className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-semibold text-white/86 transition hover:bg-white/16"
                  >
                    {anchor.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="space-y-4 animate-rise-in animate-delay-1">
              <div className="rounded-[2.1rem] border border-white/16 bg-white/10 p-2 shadow-[0_24px_60px_rgba(2,12,27,0.24)] backdrop-blur-xl">
                <LeadForm
                  variant="compact"
                  sourcePage="/"
                  selectableCompanies={featuredCompanies.slice(0, 10).map((company) => ({
                    id: company.id,
                    label: `${company.name} · ${company.city?.name ?? "Localitate neprecizată"}, ${company.county?.name ?? "Județ neprecizat"}`,
                  }))}
                  counties={options.counties.map((county) => ({
                    id: county.id,
                    label: county.name,
                  }))}
                  services={options.services.map((service) => ({
                    id: service.id,
                    label: service.name,
                  }))}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.8rem] border border-white/14 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100/88">
                    Cereri populare
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {services.slice(0, 4).map((service) => (
                      <Link
                        key={service.id}
                        href={`/servicii/${service.slug}`}
                        className="rounded-full bg-white/12 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/18"
                      >
                        {service.shortName ?? service.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-white/14 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100/88">
                    Județe căutate
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {counties.slice(0, 4).map((county) => (
                      <Link
                        key={county.id}
                        href={`/${county.slug}`}
                        className="rounded-full bg-white/12 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/18"
                      >
                        {county.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.9rem] border border-white/14 bg-white/10 p-5 text-white/82 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100/88">
                  Flux simplificat
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    "Completezi datele esențiale ale lucrării.",
                    "Selectăm local profilurile cele mai potrivite.",
                    "Primești variante și compari clar ofertele.",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="rounded-[1.4rem] bg-white/10 px-4 py-4 text-sm leading-6"
                    >
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/64">
                        Pas {index + 1}
                      </p>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-950/5 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0063f7]">
              Gândit pentru mobil și desktop
            </p>
            <h2 className="font-display mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Informația importantă e acum la primul scroll: cerere, servicii, acoperire și firme.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Am reorganizat homepage-ul în jurul intenției de cumpărare: utilizatorul vede rapid
              ce poate cere, unde găsește executanți și cum trimite o solicitare completă.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Structură mai clară",
                  text: "Secțiuni ancorate și CTA-uri vizibile din primul ecran.",
                },
                {
                  title: "SEO mai solid",
                  text: "Ancore interne, metadate complete și imagini sociale dedicate.",
                },
                {
                  title: "Navigare mai bună",
                  text: "Meniu mobil real și evidențiere rapidă pentru acțiunile importante.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.6rem] border border-slate-200 bg-slate-50/90 p-4"
                >
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(135deg,#ffffff,#f5f9ff)] p-6 shadow-sm shadow-slate-950/5 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e31e24]">
              Recomandări utile
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              Resurse conexe care completează lucrările la înălțime.
            </h2>
            <div className="mt-5 space-y-3">
              {supportSites.map((site) => (
                <a
                  key={site.href}
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-start justify-between gap-4 rounded-[1.6rem] border border-slate-200 bg-white px-5 py-4 transition hover:border-[#0063f7]/30 hover:shadow-lg hover:shadow-[#0063f7]/8"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-950">{site.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{site.description}</p>
                  </div>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-[#0063f7]" />
                </a>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              Linkurile sunt integrate concis, ca recomandări contextuale pentru utilizatorii care
              au nevoie și de servicii complementare.
            </p>
          </div>
        </div>
      </section>

      <section id="judete" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-950/5 sm:p-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0063f7]">
                  Acoperire națională
                </p>
                <h2 className="font-display mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Harta te duce direct către județul și zona care te interesează.
                </h2>
              </div>
            </div>
            <RomaniaMap counties={counties} />
          </div>

          <div className="space-y-4">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-950/5 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e31e24]">
                Cum funcționează
              </p>
              <div className="mt-5 space-y-3">
                {[
                  "Alegi tipul lucrării și județul direct din formular sau din paginile locale.",
                  "Vezi servicii, firme recomandate și conținut util fără să părăsești homepage-ul.",
                  "Trimiți cererea completă, iar selecția executanților se face intern și local.",
                ].map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-[1.5rem] bg-slate-50 px-4 py-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-7 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[linear-gradient(135deg,#07152e,#0a3c9e_65%,#0063f7)] p-6 text-white shadow-lg shadow-[#0063f7]/12 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-100/84">
                Ce contează pentru conversie
              </p>
              <div className="mt-5 space-y-3 text-sm leading-7 text-white/88">
                {[
                  "Cererea principală rămâne mereu aproape de partea de sus a paginii.",
                  "Meniul mobil deschide rapid toate secțiunile și acțiunea principală.",
                  "Designul folosește accente de albastru și roșu, inspirate din logica vizuală eMAG.",
                ].map((item) => (
                  <p key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-sky-200" />
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicii" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0063f7]">
              Servicii populare
            </p>
            <h2 className="font-display mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Începe de la serviciul care te interesează
            </h2>
          </div>
          <Link href="/firme" className="text-sm font-semibold text-[#0063f7]">
            Vezi toate firmele
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              count={service._count.companies}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0063f7]">
              Judete populare
            </p>
            <h2 className="font-display mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Navigare locală pentru căutări rapide în Google
            </h2>
          </div>
          <Link href="/judete" className="text-sm font-semibold text-[#0063f7]">
            Vezi toate judetele
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {counties.map((county) => (
            <CountyCard
              key={county.id}
              county={county}
              count={county.companyCount ?? county._count.companies}
            />
          ))}
        </div>
      </section>

      <section id="firme" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0063f7]">
              Firme recomandate
            </p>
            <h2 className="font-display mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Profiluri gata să primească solicitări
            </h2>
          </div>
          <Link href="/contact" className="text-sm font-semibold text-[#0063f7]">
            Trimite o cerere unică
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              De ce funcționează bine
            </p>
            <h2 className="font-display mt-3 text-3xl font-black tracking-tight">
              Structură gândită pentru conversie și SEO local.
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
              {[
                "Căutare rapidă după județ, oraș și serviciu.",
                "Formular unic de lead salvat intern, fără trimitere automată.",
                "Pagini dedicate pentru județe, localități, servicii și firme.",
                "Conținut editorial care susține căutările locale relevante.",
              ].map((item) => (
                <p key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-sky-300" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0063f7]">
              Pentru firme
            </p>
            <h2 className="font-display mt-3 text-3xl font-black tracking-tight text-slate-950">
              Un profil clar, local și ușor de ales de către clienți.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Site-ul este gândit să aducă lead-uri din căutări locale precum
              “alpinism utilitar București” sau “spălare geamuri la înălțime Brașov”.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/cere-oferta">
                <Button size="lg">Solicită listare</Button>
              </Link>
              <Link href="/despre-noi">
                <Button variant="secondary" size="lg">
                  Vezi cum funcționează
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        <SeoLinkCloud eyebrow="Județe" title="Navigare locală pentru România" links={countyLinks} />
        <SeoLinkCloud eyebrow="Servicii" title="Verticale SEO principale" links={serviceLinks} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <SeoLinkCloud
          eyebrow="Căutări populare"
          title="Combinații locale cu intenție comercială mare"
          description="Aceste pagini sunt gândite pentru interogări de tip «serviciu + județ», foarte utile pentru lead-uri locale."
          links={localDemandLinks}
        />
      </section>

      <section id="ghiduri" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0063f7]">
              Articole
            </p>
            <h2 className="font-display mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Conținut util pentru căutări orientate pe servicii
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-[#0063f7]">
            Vezi toate articolele
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section id="cerere" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 rounded-[2.4rem] border border-slate-200 bg-[linear-gradient(135deg,#ffffff,#edf5ff)] p-6 shadow-sm shadow-slate-950/5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e31e24]">
              Cerere finală
            </p>
            <h2 className="font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Completează lucrarea o singură dată și continuăm noi filtrarea.
            </h2>
            <p className="text-base leading-8 text-slate-600">
              Formularul mare rămâne punctul principal de conversie. L-am păstrat și în partea de
              jos pentru utilizatorii care vor să parcurgă mai întâi serviciile, județele și
              firmele.
            </p>
            <div className="grid gap-3">
              {[
                "Câmpuri simple și clar ordonate pentru mobil.",
                "Ancoră internă directă din hero și din meniu.",
                "Flux coerent cu selecție manuală și fără pași inutili.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700"
                >
                  <span className="flex items-start gap-3">
                    <Building2 className="mt-0.5 size-4 shrink-0 text-[#0063f7]" />
                    <span>{item}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <LeadForm
            sourcePage="/"
            selectableCompanies={featuredCompanies.map((company) => ({
              id: company.id,
              label: `${company.name} · ${company.city?.name ?? "Localitate neprecizată"}, ${company.county?.name ?? "Județ neprecizat"}`,
            }))}
            counties={options.counties.map((county) => ({
              id: county.id,
              label: county.name,
            }))}
            services={options.services.map((service) => ({
              id: service.id,
              label: service.name,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
