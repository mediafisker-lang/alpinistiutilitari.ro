import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const steps = [
  {
    step: "1",
    title: "1. Te inscrii in mai putin de un minut",
    description:
      "Completezi datele de baza si iti exprimi acordul pentru prelucrarea lor.",
    className:
      "border-blue-200 bg-[linear-gradient(180deg,#eef5ff_0%,#ffffff_55%)] shadow-[0_18px_40px_rgba(0,94,184,0.10)]",
    badgeClassName: "bg-blue-600 text-white",
  },
  {
    step: "2",
    title: "2. Ai acces in comunitate Whatsapp, Facebook (grup)",
    description:
      "Poti posta anunturi si poti discuta cu ceilalti membri din comunitatea Cortina North.",
    className:
      "border-amber-200 bg-[linear-gradient(180deg,#fff7e8_0%,#ffffff_55%)] shadow-[0_18px_40px_rgba(185,120,20,0.12)]",
    badgeClassName: "bg-amber-500 text-slate-950",
  },
  {
    step: "3",
    title: "3. Urmaresti public stadiul si noutatile",
    description:
      "Vezi unde s-a ajuns si ce urmeaza, fara sa cauti informatia prin mai multe canale.",
    className:
      "border-emerald-200 bg-[linear-gradient(180deg,#edfdf5_0%,#ffffff_55%)] shadow-[0_18px_40px_rgba(16,185,129,0.12)]",
    badgeClassName: "bg-emerald-500 text-white",
  },
  {
    step: "4",
    title: "4. Trimiti sesizari cand apare o problema",
    description:
      "Poti lasa rapid o problema legata de bloc, scara, curatenie sau administrare.",
    className:
      "border-rose-200 bg-[linear-gradient(180deg,#fff1f2_0%,#ffffff_55%)] shadow-[0_18px_40px_rgba(225,29,72,0.10)]",
    badgeClassName: "bg-rose-500 text-white",
  },
];

export function HowItWorksSection() {
  return (
    <section id="cum-functioneaza" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="Cum functioneaza"
        title="Patru pasi simpli, fara cont si fara complicatii."
        description="Totul este gandit pentru mobil si pentru completare rapida."
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        {steps.map((step) => (
          <Card
            key={step.title}
            className={`rounded-[1.75rem] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.12)] sm:p-6 ${step.className}`}
          >
            <div
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-extrabold shadow-sm ${step.badgeClassName}`}
            >
              {step.step}
            </div>
            <CardTitle className="mt-4 text-[1.02rem] leading-8 sm:text-[1.05rem] sm:leading-9">{step.title.replace(`${step.step}. `, "")}</CardTitle>
            <CardDescription className="mt-2 text-[0.92rem] leading-7 sm:text-[0.95rem] sm:leading-8">
              {step.description}
            </CardDescription>
          </Card>
        ))}
      </div>
    </section>
  );
}
