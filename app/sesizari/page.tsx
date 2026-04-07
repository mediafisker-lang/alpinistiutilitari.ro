import type { Metadata } from "next";

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
        <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <IssueForm />
          <PublicIssuesList issues={issues} />
        </div>
      </div>
    </section>
  );
}
