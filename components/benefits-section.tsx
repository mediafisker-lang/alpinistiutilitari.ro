import { ClipboardList, MessagesSquare, MessageCircleMore, Vote, } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    icon: ClipboardList,
    title: "Actualizări clare",
    description:
      "Primești informații centralizate, comunicate clar, fără zvonuri și fără să depinzi de mesaje împrăștiate în mai multe grupuri.",
  },
  {
    icon: MessagesSquare,
    title: "Sesizări și urmărire",
    description:
      "Poți trimite sesizări legate de complex și poți urmări mai ușor ce se întâmplă cu ele.",
  },
  {
    icon: MessageCircleMore,
    title: "Acces în grupul de WhatsApp",
    description:
      "După confirmarea înscrierii, poți primi acces în grupul de WhatsApp al comunității și rămâi conectat mai ușor la discuțiile importante.",
  },
  {
    icon: Vote,
    title: "Consultări și voturi",
    description:
      "Poți participa la consultări și voturi privind propunerile, schimbările și deciziile discutate în cadrul inițiativei sau al asociației, conform etapelor și regulilor aplicabile.",
  },
];

export function BenefitsSection() {
  return (
    <section id="beneficii" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Beneficii"
          title="Ce primești dacă te înscrii în interfața complexului"
          description="Înscrierea îți oferă acces rapid la informații utile, actualizări importante și posibilitatea de a semnala problemele care contează pentru clădirea ta."
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
            <Button size="lg">Vreau să mă înscriu</Button>
          </a>
          <p className="text-sm leading-6 text-slate-600">
            Înscrierea durează puțin și te ajută să rămâi conectat la informațiile importante pentru clădirea ta.
          </p>
        </div>
      </div>
    </section>
  );
}
