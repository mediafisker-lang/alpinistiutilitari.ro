import type { Metadata } from "next";
import Image from "next/image";

import { IssueForm } from "@/components/issue-form";
import { PublicIssuesList } from "@/components/public-issues-list";
import { SectionHeading } from "@/components/section-heading";
import { getPublicIssues } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sesizari si Istoric",
  description:
    "Trimite sesizari pentru comunitatea Cortina North si vezi istoricul sesizarilor publice si stadiul lor actual.",
  path: "/sesizari",
  keywords: [
    "sesizari Cortina North",
    "istoric sesizari Cortina North",
    "formular sesizari comunitate",
  ],
});

export default async function SesizariPage() {
  const issues = await getPublicIssues();

  return (
    <section id="sesizari" className="scroll-mt-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <SectionHeading
          eyebrow="Sesizari"
          title="Trimite sesizari si urmareste istoricul"
          description="Ai formularul de sesizari si lista cu stadiul sesizarilor publice, intr-o pagina dedicata."
          className="max-w-4xl"
        />
        <div className="mt-6 hidden gap-4 md:grid md:grid-cols-2">
          <div className="relative h-48 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <Image
              src="/images/cortina/cortina-north-comunitate-09.webp"
              alt="Cortina North - zona comuna pentru sesizari"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
          </div>
          <div className="relative h-48 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <Image
              src="/images/cortina/cortina-north-comunitate-10.webp"
              alt="Comunitatea Cortina North - acces si comunicare"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
          </div>
        </div>
        <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="space-y-5">
            <IssueForm />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-1 md:hidden">
              <div className="grid h-72 grid-cols-2 grid-rows-2 gap-1">
                <div className="relative col-span-2 overflow-hidden rounded-xl">
                  <Image
                    src="/images/cortina/cortina-north-comunitate-10.webp"
                    alt="Cortina North - perspectiva comunitate pentru sesizari"
                    fill
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/15 to-transparent" />
                </div>
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src="/images/cortina/cortina-north-comunitate-09.webp"
                    alt="Cortina North - zona rezidentiala pentru sesizari"
                    fill
                    className="object-cover object-center"
                    sizes="50vw"
                  />
                </div>
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src="/images/cortina/cortina-north-comunitate-11.webp"
                    alt="Cortina North - imagine suport comunitate"
                    fill
                    className="object-cover object-center"
                    sizes="50vw"
                  />
                </div>
              </div>
            </div>
          </div>
          <PublicIssuesList issues={issues} />
        </div>
      </div>
    </section>
  );
}
