"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useVoteSession } from "@/components/use-vote-session";
import type { HomepageStats } from "@/types/database";

function formatCount(value: number) {
  return new Intl.NumberFormat("ro-RO").format(value);
}

export function HeroSection({ stats }: { stats: HomepageStats }) {
  const { isLoggedIn } = useVoteSession();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0b0806_0%,#120e09_42%,#0f0b07_100%)]">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(241,204,120,0.22),_transparent_58%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-5">
            <span className="inline-flex rounded-lg border border-[#c79b4b] bg-[rgba(32,24,14,0.84)] px-4 py-2 text-xs font-semibold tracking-[0.08em] text-[#f1cb79]">
              Cortina North - B-dul Pipera, Ilfov
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-[#f7e7bf] sm:text-5xl">
                Primesti acces la grupuri, vot, sesizari si actualizari intr-un minut
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#d9c598] sm:text-lg">
                Portalul comunitatii Cortina North din Bucuresti si Ilfov este gandit ca sa intri rapid in comunitate, sa vezi ce se intampla si sa actionezi imediat atunci cand apare ceva important.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {!isLoggedIn ? (
                <a href="#inscriere" className="hidden sm:block">
                  <Button size="lg" className="w-full sm:w-auto">
                    Vreau sa ma inscriu
                    <ArrowRight className="size-4" />
                  </Button>
                </a>
              ) : null}
              <Link href="/stadiu-asociatie">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {isLoggedIn ? "Vezi noutatile si stadiul" : "Vezi stadiul actual"}
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="surface-3d rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d8c49a]">
                  Membri inscrisi
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[#e31e24]">
                  {formatCount(stats.residentsCount)}
                </p>
              </div>
              <div className="surface-3d rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d8c49a]">
                  Sesizari trimise
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[#ff8c6f]">
                  {formatCount(stats.issuesCount)}
                </p>
              </div>
              <div className="surface-3d rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d8c49a]">
                  Voturi inregistrate
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[#f6ebd3]">
                  {formatCount(stats.votesCount)}
                </p>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden rounded-2xl border border-[#8a6424] p-0">
            <div className="bg-[linear-gradient(110deg,#9f7427_0%,#f0c46e_45%,#8a6424_100%)] px-6 py-4 text-[#22170a]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#503913]">
                Pachet comunitate
              </p>
              <CardTitle className="mt-2 text-2xl font-extrabold text-[#1f1408]">Pe scurt</CardTitle>
            </div>
            <div className="p-6">
              <CardDescription className="text-sm leading-7 sm:text-base">
                Documentatia este pregatita. Etapa actuala este contactarea proprietarilor, completarea bazei de date si strangerea semnaturilor pentru constituire.
              </CardDescription>
              <div className="mt-5 space-y-3">
                <div className="surface-3d flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 size-5 text-[#f1cb79]" />
                  <div>
                    <p className="font-semibold text-slate-950">Transparenta publica</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Stadiul si actualizarile sunt vizibile clar, fara explicatii confuze.
                    </p>
                  </div>
                </div>
                <div className="surface-3d flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 size-5 text-[#f1cb79]" />
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
