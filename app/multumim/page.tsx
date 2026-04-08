import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Cererea a fost înregistrată",
  description:
    "Cererea ta de ofertă a fost salvată în platformă și transmisă către firmele relevante în funcție de zonă și tipul lucrării.",
  path: "/multumim",
  noIndex: true,
});

type ThankYouPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: "Mulțumim" }]} />

      <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
        <div className="flex size-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8" />
        </div>

        <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950">
          Cererea ta a fost înregistrată
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Mulțumim. Cererea ta a fost salvată în platformă și trimisă către firmele relevante în funcție
          de zonă și tipul lucrării. Timpul de răspuns estimat este de aproximativ 15 minute.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            1. Cererea este înregistrată și distribuită către firmele selectate.
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            2. Firmele din zona potrivită pot reveni rapid cu răspuns și disponibilitate.
          </div>
          <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            3. Poți compara ofertele și alege varianta cea mai bună pentru lucrarea ta.
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-sky-100 bg-sky-50 p-5 text-sm text-sky-900">
          ID intern cerere: <span className="font-semibold">{params.id ?? "generat automat"}</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/firme">
            <Button>
              Vezi firmele
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <Link href="/judete">
            <Button variant="secondary">Navighează pe județe</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
