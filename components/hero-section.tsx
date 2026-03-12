import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_55%,#f8fafc_100%)]">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Inițiativă pentru proprietarii Cortina North
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Fii la curent cu ce se întâmplă în complex
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Înscrie-te în interfața complexului ca să primești actualizări clare, să poți trimite sesizări, să ai acces la informații utile pentru clădirea ta și să participi mai ușor la consultări și voturi privind propunerile discutate în cadrul inițiativei sau al asociației.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#inscriere">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Vezi stadiul actual
                </Button>
              </a>
              <a href="#inscriere">
                <Button size="lg" className="w-full sm:w-auto">
                  Vreau să mă înscriu
                  <ArrowRight className="size-4" />
                </Button>
              </a>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Informații centralizate, comunicare mai clară și acces mai ușor la noutățile importante pentru comunitate.
            </p>
          </div>

          <Card className="rounded-[2rem] p-5 sm:p-6">
            <CardTitle>Pe scurt</CardTitle>
            <CardDescription className="mt-3 text-sm leading-7 sm:text-base">
              Documentația este pregătită. Etapa actuală este una de organizare practică:
              contactarea proprietarilor, completarea bazei de date și strângerea
              semnăturilor pentru constituire.
            </CardDescription>
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-slate-950">Transparență publică</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Stadiul și actualizările sunt vizibile clar, fără explicații confuze.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-slate-950">Implicare simplă</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Te înscrii repede, iar sesizările ajung într-un singur loc.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <ShieldCheck className="mt-0.5 size-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-slate-950">Colectare minimă de date</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Datele cerute sunt strict cele necesare pentru comunicare și organizare.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
