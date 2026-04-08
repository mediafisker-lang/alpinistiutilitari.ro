import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FileText,
  MapPinned,
  MessageSquareMore,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type BlueprintLink = {
  href: string;
  label: string;
};

type HomepageBlueprintProps = {
  countyLinks: BlueprintLink[];
  serviceLinks: BlueprintLink[];
};

const structureBlocks = [
  {
    title: "1. Hero comercial",
    description:
      "Mesaj clar, formular rapid și căutare imediată după județ, oraș și tipul lucrării.",
    icon: Search,
  },
  {
    title: "2. Hartă pe județe",
    description:
      "Județe clickabile, număr de firme și acces rapid către paginile locale cu intenție comercială.",
    icon: MapPinned,
  },
  {
    title: "3. Servicii populare",
    description:
      "Blocuri SEO pentru lucrările cele mai frecvente: geamuri, fațade, bannere, acoperișuri și arbori.",
    icon: Building2,
  },
  {
    title: "4. Firme + formular unic",
    description:
      "Clientul compară firmele și trimite o singură cerere către una sau mai multe companii selectate.",
    icon: MessageSquareMore,
  },
  {
    title: "5. Articole și FAQ",
    description:
      "Conținut util pentru căutări informaționale și comerciale, cu linking intern către paginile care convertesc.",
    icon: FileText,
  },
  {
    title: "6. Footer SEO",
    description:
      "Linkuri către județe, orașe, servicii și pagini comerciale pentru o structură națională clară.",
    icon: ShieldCheck,
  },
];

const seoRules = [
  "Homepage orientat pe conversie și căutări comerciale naționale",
  "Pagini de județ cu firme, servicii populare, FAQ și formular precompletat",
  "Pagini de oraș doar acolo unde există conținut util și firme reale",
  "Pagini serviciu + județ pentru interogări de tip «spălare geamuri București»",
  "Profiluri de firmă cu servicii, județ, oraș, arie de acoperire și CTA vizibil",
];

const clientJourney = [
  "Intră din Google pe o pagină locală sau pe o pagină de serviciu.",
  "Vede firmele relevante din județul sau orașul lui.",
  "Compară 3-5 firme după servicii, zonă și profil.",
  "Completează formularul unic cu datele lucrării.",
  "Cererea se înregistrează intern și este procesată manual.",
  "Clientul primește soluția potrivită și alege ușor executantul.",
];

export function HomepageBlueprint({
  countyLinks,
  serviceLinks,
}: HomepageBlueprintProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                Simulare grafică homepage
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Cum ar trebui să fie gândit vizual alpinistiutilitari.ro pentru
                clientul final.
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Schema de mai jos folosește structura existentă și o duce într-o
                direcție clară: trafic organic din România, pagini locale utile și
                cerere de ofertă foarte rapidă.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {structureBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <Card
                    key={block.title}
                    className="rounded-[1.5rem] border-slate-200 p-5 shadow-sm shadow-slate-950/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-950">
                        {block.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {block.description}
                    </p>
                  </Card>
                );
              })}
            </div>

            <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-300">
                <ShieldCheck className="size-4" />
                Arhitectură SEO recomandată
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {seoRules.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[1.75rem] border-slate-200 p-6 shadow-sm shadow-slate-950/5">
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
                <Users className="size-4" />
                Traseu client
              </div>
              <div className="mt-5 space-y-3">
                {clientJourney.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-3 rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[1.75rem] border-slate-200 p-6 shadow-sm shadow-slate-950/5">
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
                <Star className="size-4" />
                Linkuri SEO cheie
              </div>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Județe importante
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {countyLinks.slice(0, 6).map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Servicii cu volum mare
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {serviceLinks.slice(0, 6).map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-[1.75rem] bg-gradient-to-br from-sky-600 via-blue-600 to-slate-950 p-6 text-white shadow-lg shadow-sky-500/10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-100/80">
                Ce trebuie să iasă în evidență
              </p>
              <div className="mt-5 space-y-3 text-sm leading-7 text-sky-50/90">
                <p>
                  Clientul nu caută o “platformă”, ci o rezolvare rapidă pentru
                  o lucrare la înălțime.
                </p>
                <p>
                  Formularul, județul și tipul lucrării trebuie să fie vizibile
                  din primul ecran.
                </p>
                <p>
                  Site-ul trebuie să inspire încredere și să arate clar că există
                  firme reale, acoperire locală și un flux simplu de ofertare.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/cere-oferta">
                  <Button className="bg-white text-slate-950 hover:bg-slate-100">
                    Vezi formularul principal
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/firme">
                  <Button
                    variant="ghost"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/15"
                  >
                    Vezi firmele listate
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
