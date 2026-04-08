import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";

export const metadata = buildMetadata({
  title: "Cum functioneaza platforma",
  description:
    "Vezi cum trimiți o cerere unică de ofertă, cum sunt selectate firmele și cum este procesată solicitarea în platformă.",
  path: "/cum-functioneaza",
});

export default function HowItWorksPage() {
  const steps = [
    "Clientul intră din Google pe o pagină locală sau de serviciu.",
    "Selectează județul, orașul, serviciul și firmele potrivite.",
    "Trimite o singură cerere care se salvează intern în platformă.",
    "Administratorul analizează cererea și o preia manual.",
    "Se revine către client cu executanții sau soluția potrivită.",
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Cum functioneaza" }]} />
      <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">Cum functioneaza</h1>
        <div className="mt-8 grid gap-4">
          {steps.map((step, index) => (
            <div key={step} className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              <span className="font-semibold text-slate-950">{index + 1}. </span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
