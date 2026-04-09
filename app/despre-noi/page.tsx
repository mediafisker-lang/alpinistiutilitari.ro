import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Despre noi - AlpinistiUtilitari.ro",
  description:
    "Află cum funcționează platforma națională pentru firme de alpinism utilitar și de ce este construită pentru căutări locale reale din România.",
  path: "/despre-noi",
});

export default function AboutUsPage() {
  const flowSteps = [
    "Completezi formularul în mai puțin de 1 minut: județ, tip lucrare, detalii și poze.",
    "Cererea ta ajunge la firme de alpinism utilitar verificate din zona ta sau din țară.",
    "Primești oferte comparative rapid (orientativ 15 minute pentru primul răspuns).",
    "Compari preț, termen și experiență, apoi alegi varianta potrivită pentru tine.",
  ];

  const benefits = [
    "Economisești timp și efort. Nu mai cauți manual firme pe Google, Facebook sau OLX.",
    "Primești mai multe oferte dintr-o singură cerere și poți compara real prețuri și servicii.",
    "Ai acces la firme locale și naționale, în funcție de costul de deplasare sau experiență.",
    "Ai transparență: firmele au profil cu servicii, acoperire și informații utile.",
    "Serviciul este gratuit și fără obligații. Primești oferte și decizi tu dacă accepți.",
    "Ai siguranță, cu echipe specializate în lucru la înălțime și echipamente certificate.",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Despre noi" }]} />

      <section className="mt-6 rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#ffffff,#f8fbff)] p-8 shadow-sm shadow-slate-950/5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Despre AlpinistiUtilitari.ro
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-slate-950">
          Prima platformă dedicată exclusiv din România pentru cereri rapide de alpinism utilitar
        </h1>
        <p className="mt-5 max-w-4xl text-base leading-8 text-slate-700">
          AlpinistiUtilitari.ro conectează rapid clienții cu firme specializate în lucru la înălțime
          cu tehnici de acces pe coardă.
        </p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
          Indiferent dacă ești proprietar de bloc, administrator, firmă de publicitate, antreprenor
          sau ai o locuință cu nevoie de intervenție la înălțime, poți obține multiple oferte
          personalizate fără să pierzi timp căutând sau sunând zeci de firme.
        </p>
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm shadow-slate-950/5">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">Cum funcționează platforma</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {flowSteps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                Pasul {index + 1}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm shadow-slate-950/5">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">
          Principalele beneficii pentru tine
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit} className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
              <p className="text-sm leading-7 text-emerald-950">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm shadow-slate-950/5">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">
          De ce să alegi alpinism utilitar
        </h2>
        <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-6">
          <p className="text-base leading-8 text-sky-950">
            Alpinismul utilitar este soluția modernă, rapidă și sigură pentru intervenții în zone greu
            accesibile: fațade înalte, geamuri la etaje superioare, structuri industriale, bannere,
            acoperișuri sau copaci periculoși.
          </p>
          <p className="mt-4 text-base leading-8 text-sky-950">
            Față de schele costisitoare, nacele sau macarale, accesul pe coardă reduce semnificativ
            timpul și costurile lucrării. În platformă ai la dispoziție o rețea națională de profesioniști,
            organizați pe județe, pentru a găsi rapid soluția potrivită proiectului tău.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-sm shadow-slate-950/20">
        <h2 className="text-3xl font-black tracking-tight">Vrei să începi?</h2>
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-200">
          Completează formularul de pe prima pagină sau contactează-ne direct. Lucrarea ta la
          înălțime merită cea mai bună ofertă.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Completeaza formularul
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/60"
          >
            Contacteaza-ne
          </Link>
        </div>
      </section>
    </div>
  );
}
