import { ClipboardList, MessagesSquare, MessageCircleMore, Vote } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    icon: ClipboardList,
    title: "Actualizari clare",
    description:
      "Primesti informatii centralizate, comunicate clar, fara zvonuri si fara sa depinzi de mesaje imprastiate in mai multe grupuri.",
  },
  {
    icon: MessagesSquare,
    title: "Sesizari si urmarire",
    description:
      "Poti trimite sesizari legate de complex si poti urmari mai usor ce se intampla cu ele.",
  },
  {
    icon: MessageCircleMore,
    title: "Acces in grupul de WhatsApp",
    description:
      "Dupa confirmarea inscrierii, poti primi acces in grupul de WhatsApp al comunitatii si ramai conectat mai usor la discutiile importante.",
  },
  {
    icon: Vote,
    title: "Consultari si voturi",
    description:
      "Poti participa la consultari si voturi privind propunerile, schimbarile si deciziile discutate in cadrul initiativei sau al asociatiei.",
  },
];

export function BenefitsSection() {
  return (
    <section id="beneficii" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Beneficii"
          title="Ce primesti daca te inscrii in interfata complexului"
          description="Inscrierea iti ofera acces rapid la informatii utile, actualizari importante si posibilitatea de a semnala problemele care conteaza pentru cladirea ta."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="rounded-[2rem] p-5 sm:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                <benefit.icon className="size-6 text-emerald-600" />
              </div>
              <CardTitle className="mt-5">{benefit.title}</CardTitle>
              <CardDescription className="mt-3">{benefit.description}</CardDescription>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-start gap-3">
          <a href="#inscriere">
            <Button size="lg">Ma inscriu acum</Button>
          </a>
          <p className="text-sm leading-6 text-slate-600">
            Inscrierea dureaza putin si te ajuta sa ramai conectat la informatiile importante pentru cladirea ta.
          </p>
        </div>
      </div>
    </section>
  );
}
