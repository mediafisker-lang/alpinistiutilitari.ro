import type { Metadata } from "next";

import { JoinConversionPanel } from "@/components/join-conversion-panel";
import { JoinForm } from "@/components/join-form";
import { SectionHeading } from "@/components/section-heading";
import { getHomepageStats } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Inregistrare | Cortina North Pipera Ilfov",
  description:
    "Completeaza formularul de inregistrare pentru acces rapid la comunitate, sesizari, vot si actualizari.",
  path: "/inregistrare",
  keywords: [
    "inregistrare Cortina North",
    "cont comunitate Cortina North",
    "acces sesizari vot Cortina North",
  ],
});

export default async function InregistrarePage() {
  const stats = await getHomepageStats();

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
