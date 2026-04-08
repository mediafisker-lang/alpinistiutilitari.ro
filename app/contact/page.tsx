import { buildMetadata } from "@/lib/seo";
import { getQuickSearchOptions } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";

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
            Cerere unica
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
    </div>
  );
}
