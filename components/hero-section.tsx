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
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(11, 19, 36, 0.78) 0%, rgba(15, 26, 49, 0.82) 42%, rgba(10, 18, 33, 0.86) 100%), url('/hero-label-bg.jpg')",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_58%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-5">
            <span className="inline-flex rounded-lg border border-white/45 bg-slate-900/45 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-white shadow-[0_8px_20px_rgba(15,23,42,0.35)] backdrop-blur-[1px]">
              CORTINA NORTH - Pipera, Ilfov.
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Conectează-te! Informează-te! Fii parte din comunitate!
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                Interfata Cortina North Pipera - Ilfov este gandita sa intri rapid in comunitate, sa fii informat si daca consideri sa participi activ la schimbari.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {!isLoggedIn ? (
                <Link href="/inregistrare" className="hidden sm:block">
                  <Button size="lg" className="w-full sm:w-auto">
                    Vreau sa ma inscriu
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              ) : null}
              <Link href="/stadiu-asociatie">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {isLoggedIn ? "Vezi noutatile si stadiul" : "Vezi stadiul actual"}
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="surface-3d rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Membri inscrisi
                </p>
                <p className="mt-2 text-2xl font-extrabold text-[#e31e24]">
                  {formatCount(stats.residentsCount)}
                </p>
              </div>
              <div className="surface-3d rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Sesizari trimise
                </p>
                <p className="mt-2 text-2xl font-extrabold text-orange-600">
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

          <Card className="overflow-hidden rounded-2xl border border-slate-200 p-0">
            <div className="bg-[linear-gradient(110deg,#0f6ad8_0%,#38bdf8_55%,#0b63ce_100%)] px-6 py-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">
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
                  <CheckCircle2 className="mt-0.5 size-5 text-[#0b63ce]" />
                  <div>
                    <p className="font-semibold text-slate-950">Transparenta publica</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Stadiul si actualizarile sunt vizibile clar, fara explicatii confuze.
                    </p>
                  </div>
                </div>
                <div className="surface-3d flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 size-5 text-[#0b63ce]" />
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
