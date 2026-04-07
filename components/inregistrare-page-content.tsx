"use client";

import Image from "next/image";
import Link from "next/link";

import { JoinConversionPanel } from "@/components/join-conversion-panel";
import { JoinForm } from "@/components/join-form";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useVoteSession } from "@/components/use-vote-session";
import type { HomepageStats } from "@/types/database";

function formatDisplayName(email?: string) {
  if (!email) {
    return "vecin";
  }

  const raw = email.includes("@") ? email.split("@")[0] : email;
  const cleaned = raw.replace(/[._-]+/g, " ").trim();
  if (!cleaned) {
    return raw;
  }

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function InregistrarePageContent({ stats }: { stats: HomepageStats }) {
  const { currentIp, isLoggedIn, session } = useVoteSession();

  if (!currentIp) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Card className="rounded-[2rem] p-6">
            <p className="text-sm text-slate-600">Se incarca zona de inregistrare...</p>
          </Card>
        </div>
      </section>
    );
  }

  if (isLoggedIn) {
    const displayName = formatDisplayName(session?.email);

    return (
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading
            eyebrow="Cont activ"
            title={`Multumim, ${displayName}! Esti conectat in portal.`}
            description="Din acest moment ai acces la sesizari, voturi active, canalele comunitatii si stadiul asociatiei."
            className="max-w-5xl"
          />

          <Card className="mt-8 overflow-hidden rounded-[2rem] p-0">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-6 sm:p-8">
                <p className="text-sm leading-7 text-slate-600">
                  Bun venit in zona ta privata. Iti multumim pentru implicare. Mai jos ai acces
                  direct la cele mai importante sectiuni din platforma.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    Trimite rapid sesizari si urmareste istoricul.
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                    Voteaza propunerile active si lasa comentarii.
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Acceseaza grupurile comunitatii (WhatsApp/Facebook).
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
                    Vezi stadiul asociatiei si actualizarile publice.
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link href="/sesizari">
                    <Button size="lg" className="w-full">
                      Trimite o sesizare
                    </Button>
                  </Link>
                  <Link href="/voteaza">
                    <Button size="lg" variant="secondary" className="w-full">
                      Mergi la vot
                    </Button>
                  </Link>
                  <Link href="/#comunitate">
                    <Button size="lg" variant="outline" className="w-full">
                      Deschide Comunitate
                    </Button>
                  </Link>
                  <Link href="/stadiu-asociatie">
                    <Button size="lg" variant="outline" className="w-full">
                      Vezi Stadiu Asociatie
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[260px] lg:min-h-full">
                <Image
                  src="/images/cortina/cortina-north-comunitate-08.webp"
                  alt="Cortina North Pipera - vedere comunitate"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent" />
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow="Actiune"
          title="Alege rapid ce vrei sa faci"
          description="Te inscrii daca vrei sa fii tinut la curent. Trimiti o sesizare daca vrei sa semnalezi o problema concreta."
          className="max-w-4xl"
          descriptionClassName="lg:whitespace-nowrap"
        />
        <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
          <JoinForm />
          <JoinConversionPanel stats={stats} />
        </div>
      </div>
    </section>
  );
}
