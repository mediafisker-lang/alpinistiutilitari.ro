import type { Metadata } from "next";

import { VoteazaSchimbarileSection } from "@/components/voteaza-schimbarile-section";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Voteaza Propuneri",
  description:
    "Voteaza propunerile active pentru comunitatea Cortina North si vezi rapid rezultatele pentru si impotriva.",
  path: "/voteaza",
  keywords: [
    "voteaza propuneri Cortina North",
    "vot comunitate Cortina North",
    "propuneri asociatie",
  ],
});

export default function VoteazaPage() {
  return <VoteazaSchimbarileSection />;
}
