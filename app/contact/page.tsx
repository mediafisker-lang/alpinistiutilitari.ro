import { Building2, CheckCircle2, MessageCircleMore, Phone } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getQuickSearchOptions } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { SupportContactStrip } from "@/components/site/support-contact-strip";

export const metadata = buildMetadata({
  title: "Trimite o cerere pentru servicii de alpinism utilitar",
  description:
    "Completeaza formularul si foloseste platforma pentru a trimite o cerere clara catre firme relevante din Romania.",
  path: "/contact",
});

export default function ContactPage() {
  const optionsPromise = getQuickSearchOptions();

  return <ContactContent optionsPromise={optionsPromise} />;
}

async function ContactContent({
  optionsPromise,
}: {
  optionsPromise: ReturnType<typeof getQuickSearchOptions>;
}) {
  const options = await optionsPromise;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Contact" }]} />
      <section className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Secțiune CLIENȚI
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            Spune ce lucrare ai si primesti raspuns mai rapid.
          </h1>
          <div className="mt-6 space-y-4 text-base leading-8 text-slate-600">
            <p>
              Formularul este gandit pentru proiecte comerciale, rezidentiale si
              institutionale care necesita lucrari la inaltime.
            </p>
            <p>
              Include cat mai clar localitatea, tipul serviciului si intervalul in care
              vrei sa fie facuta interventia.
            </p>
          </div>
        </div>
        <LeadForm
          sourcePage="/contact"
          counties={options.counties.map((county) => ({ id: county.id, label: county.name }))}
          services={options.services.map((service) => ({ id: service.id, label: service.name }))}
        />
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-[#DCE4E9] bg-white shadow-[0_16px_42px_rgba(16,42,67,0.09)]">
        <div className="grid lg:grid-cols-[0.38fr_0.62fr]">
          <div className="bg-[linear-gradient(145deg,#102A43,#176B87)] p-6 text-white sm:p-8">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Building2 className="size-7 text-[#7FE1B5]" />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-sky-200">
              Secțiune ÎNSCRIERE FIRME
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white">
              Înscriere firme
            </h2>
            <p className="mt-4 text-sm leading-7 text-sky-50/85">
              Înscrie-ți firma și primește solicitări relevante pentru zonele și serviciile în care activezi.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
              <p>
                Ai o firmă autorizată de alpinism utilitar sau prestezi servicii de lucru la înălțime?
                Trimite-ne datele firmei prin WhatsApp sau contactează-ne telefonic pentru a fi listat
                pe <strong className="text-[#102A43]">AlpinistiUtilitari.ro</strong>.
              </p>
              <p>
                Listarea este gratuită în primele 12 luni și îți oferă posibilitatea de a primi
                solicitări pentru lucrări din județul în care activezi sau, în funcție de
                disponibilitatea echipei, de la nivel național.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-[#DCE4E9] bg-[#F5F7F9] p-5">
              <h3 className="text-lg font-black text-[#102A43]">Pentru înscriere sunt necesare:</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  "denumirea firmei și datele de contact",
                  "județele sau localitățile în care lucrezi",
                  "serviciile oferite",
                  "datele care confirmă că firma este autorizată",
                  "câteva fotografii reprezentative din lucrările realizate",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
              După perioada gratuită de 12 luni, menținerea profilului activ va costa
              <strong> 50 lei pe lună</strong>, sub forma unui abonament. Continuarea abonamentului
              este opțională. Dacă nu dorești prelungirea, profilul firmei va fi dezactivat fără
              alte obligații.
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-black text-[#102A43]">Înscrie-ți firma</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Trimite datele prin WhatsApp sau sună-ne la 0799 102 030 pentru verificare și
                publicarea profilului.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a
                  href="https://wa.me/40799102030"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_26px_rgba(16,185,129,0.24)] transition hover:bg-emerald-600"
                >
                  <MessageCircleMore className="size-5" />
                  Trimite datele pe WhatsApp
                </a>
                <a
                  href="tel:+40799102030"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-[#176B87]/25 bg-white px-5 py-3 text-sm font-bold text-[#102A43] transition hover:bg-[#E8F0F3]"
                >
                  <Phone className="size-5 text-[#176B87]" />
                  Sună 0799 102 030
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SupportContactStrip />
    </div>
  );
}
