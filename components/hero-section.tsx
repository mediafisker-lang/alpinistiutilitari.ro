import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { HomepageStats } from "@/types/database";

function formatCount(value: number) {
  return new Intl.NumberFormat("ro-RO").format(value);
}

export function HeroSection({ stats }: { stats: HomepageStats }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#edf4ff_0%,#ffffff_40%,#f5f7fb_100%)]">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(0,94,184,0.14),_transparent_58%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-5">
            <span className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#005eb8]">
              Oferta completa pentru proprietarii Cortina North
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                Primesti acces la grupuri, vot, sesizari si actualizari intr-un minut
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Totul este gandit ca sa intri rapid in comunitate, sa vezi ce se intampla si sa actionezi imediat atunci cand apare ceva important.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#inscriere">
                <Button size="lg" className="w-full sm:w-auto">
                  Vreau sa ma inscriu
                  <ArrowRight className="size-4" />
                </Button>
              </a>
              <a href="#stadiu">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Vezi stadiul actual
                </Button>
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="surface-3d rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Membri inscrisi
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[#005eb8]">
                  {formatCount(stats.residentsCount)}
                </p>
              </div>
              <div className="surface-3d rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Sesizari trimise
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[#e31e24]">
                  {formatCount(stats.issuesCount)}
                </p>
              </div>
              <div className="surface-3d rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Voturi inregistrate
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  {formatCount(stats.votesCount)}
                </p>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden rounded-2xl border border-blue-100 p-0">
            <div className="bg-[linear-gradient(90deg,#005eb8_0%,#2b7de9_100%)] px-6 py-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                Pachet comunitate
              </p>
              <CardTitle className="mt-2 text-2xl font-extrabold text-white">Pe scurt</CardTitle>
            </div>
            <div className="p-6">
              <CardDescription className="text-sm leading-7 sm:text-base">
                Documentatia este pregatita. Etapa actuala este contactarea proprietarilor, completarea bazei de date si strangerea semnaturilor pentru constituire.
              </CardDescription>
              <div className="mt-5 space-y-3">
                <div className="surface-3d flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 size-5 text-[#005eb8]" />
                  <div>
                    <p className="font-semibold text-slate-950">Transparenta publica</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Stadiul si actualizarile sunt vizibile clar, fara explicatii confuze.
                    </p>
                  </div>
                </div>
                <div className="surface-3d flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 size-5 text-[#005eb8]" />
                  <div>
                    <p className="font-semibold text-slate-950">Implicare simpla</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Te inscrii repede, iar sesizarile ajung intr-un singur loc.
                    </p>
                  </div>
                </div>
                <div className="surface-3d flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <ShieldCheck className="mt-0.5 size-5 text-[#e31e24]" />
                  <div>
                    <p className="font-semibold text-slate-950">Colectare minima de date</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Datele cerute sunt strict cele necesare pentru comunicare si organizare.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
