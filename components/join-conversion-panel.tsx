"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, BellRing, MessagesSquare, Vote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useVoteSession } from "@/components/use-vote-session";
import type { HomepageStats } from "@/types/database";

function formatCount(value: number) {
  return new Intl.NumberFormat("ro-RO").format(value);
}

const reasons = [
  {
    icon: BellRing,
    title: "Afli repede ce se schimba",
    description: "Primesti actualizari clare si nu mai depinzi de mesaje imprastiate in mai multe locuri.",
  },
  {
    icon: MessagesSquare,
    title: "Intri in comunitate",
    description: "Ai acces mai usor la grupurile interne si poti interactiona direct cu ceilalti membri.",
  },
  {
    icon: Vote,
    title: "Poti actiona imediat",
    description: "Votezi, trimiti sesizari si urmaresti public ce se intampla mai departe.",
  },
];

export function JoinConversionPanel({ stats }: { stats: HomepageStats }) {
  const { isLoggedIn, session } = useVoteSession();

  if (isLoggedIn) {
    return (
      <Card className="rounded-[2rem] border border-emerald-200 bg-[linear-gradient(180deg,#f5fff9_0%,#ffffff_100%)] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Cont activ
        </p>
        <CardTitle className="mt-3 text-2xl">Esti deja logat in comunitate</CardTitle>
        <CardDescription className="mt-3 text-sm leading-7 sm:text-base">
          Esti conectat cu {session?.email}. Poti merge direct catre sesizari, vot sau actualizarile publice, fara sa mai vezi formularul de inscriere.
        </CardDescription>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link href="/sesizari" className="block">
            <Button size="lg" className="w-full">
              Trimite o sesizare
            </Button>
          </Link>
          <Link href="/voteaza" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Mergi la vot
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="rounded-[2rem] border border-blue-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#005eb8]">
            <BadgeCheck className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#005eb8]">
              Dovada sociala
            </p>
            <CardTitle className="mt-1">Comunitatea este deja activa</CardTitle>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <div className="surface-3d rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Membri inscrisi
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#005eb8]">{formatCount(stats.residentsCount)}</p>
          </div>
          <div className="surface-3d rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Sesizari trimise
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#e31e24]">{formatCount(stats.issuesCount)}</p>
          </div>
          <div className="surface-3d rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Voturi inregistrate
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">{formatCount(stats.votesCount)}</p>
          </div>
        </div>
      </Card>

      <Card className="rounded-[2rem] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#005eb8]">
          De ce merita sa te inscrii acum
        </p>
        <CardTitle className="mt-3 text-2xl">Beneficii imediate, nu doar promisiuni</CardTitle>
        <CardDescription className="mt-3 text-sm leading-7 sm:text-base">
          Dupa inscriere, stii unde sa intri, cui sa scrii si ce se intampla mai departe. Exact asta ii face pe oameni sa revina.
        </CardDescription>

        <div className="mt-5 space-y-3">
          {reasons.map((reason) => (
            <div key={reason.title} className="surface-3d rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#005eb8]">
                  <reason.icon className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">{reason.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{reason.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <a href="#inscriere">
            <Button size="lg" className="w-full">
              Inscrie-ma acum
              <ArrowRight className="size-4" />
            </Button>
          </a>
        </div>
      </Card>
    </div>
  );
}
