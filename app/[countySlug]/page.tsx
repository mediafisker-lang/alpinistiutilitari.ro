import CountyPage from "@/app/judet/[countySlug]/page";
import { getCounty } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo";
import { canIndexCountyPage } from "@/lib/seo-rules";

type Props = {
  params: Promise<{ countySlug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { countySlug } = await params;
  const county = await getCounty(countySlug);

  if (
    !county ||
    !county.isActive ||
    !canIndexCountyPage({
      companyCount: county.companies.length,
      hasIntro: Boolean(county.introText ?? county.intro),
    })
  ) {
    return buildMetadata({
      title: "Judet indisponibil",
      description: "Judetul cautat nu exista sau nu are continut suficient.",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `Firme de alpinism utilitar in ${county.name}`,
    description:
      county.seoDescription ??
      county.introText ??
      county.intro ??
      `Gasesti firme de alpinism utilitar din ${county.name}, servicii populare si orase importante din judet.`,
    path: `/${county.slug}`,
  });
}

export default async function CanonicalCountyPage({ params }: Props) {
  const { countySlug } = await params;
  return CountyPage({ params: Promise.resolve({ countySlug }) });
}
