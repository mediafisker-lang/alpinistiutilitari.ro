import type { Metadata } from "next";

import { InregistrarePageContent } from "@/components/inregistrare-page-content";
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

  return <InregistrarePageContent stats={stats} />;
}
