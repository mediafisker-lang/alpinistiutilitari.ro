import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const steps = [
  {
    title: "1. Te înscrii în mai puțin de un minut",
    description:
      "Completezi datele de bază și îți exprimi acordul pentru prelucrarea lor.",
  },
  {
    title: "2. Trimiți sesizări când apare o problemă",
    description:
      "Poți lăsa rapid o problemă legată de bloc, scară, curățenie sau administrare.",
  },
  {
    title: "3. Urmărești public stadiul și noutățile",
    description:
      "Vezi unde s-a ajuns și ce urmează, fără să cauți informația prin mai multe canale.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="cum-functioneaza" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Cum funcționează"
        title="Trei pași simpli, fără cont și fără complicații."
        description="Totul este gândit pentru mobil și pentru completare rapidă."
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.title} className="rounded-[2rem] border-slate-200 bg-white">
            <CardTitle>{step.title}</CardTitle>
            <CardDescription className="mt-3">{step.description}</CardDescription>
          </Card>
        ))}
      </div>
    </section>
  );
}
