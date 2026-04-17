import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

function formatName(value?: string) {
  const cleanValue = value?.trim();
  if (!cleanValue) {
    return "vecin";
  }

  return cleanValue
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export const metadata: Metadata = buildMetadata({
  title: "Inregistrare finalizata | Cortina North Pipera Ilfov",
  description: "Confirmarea inscrierii in comunitatea Cortina North.",
  path: "/inregistrare/succes",
  noIndex: true,
});

export default async function InregistrareSuccesPage({
  searchParams,
}: {
  searchParams: Promise<{ nume?: string }>;
}) {
  const params = await searchParams;
  const displayName = formatName(params.nume);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <Card className="rounded-[2rem] border border-emerald-200 bg-[linear-gradient(180deg,#f0fff6_0%,#ffffff_100%)] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Inregistrare finalizata
          </p>
          <CardTitle className="mt-3 text-2xl sm:text-3xl">Multumim, {displayName}!</CardTitle>
          <CardDescription className="mt-3 text-base leading-7 text-slate-700">
            Contul tau a fost creat cu succes. Te poti autentifica in comunitate folosind emailul
            si parola alese la inregistrare.
          </CardDescription>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/voteaza" className="block">
              <Button size="lg" className="w-full">
                Mergi la vot
              </Button>
            </Link>
            <Link href="/sesizari" className="block">
              <Button variant="secondary" size="lg" className="w-full">
                Deschide sesizari
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
