import CountyPage from "@/app/judet/[countySlug]/page";
import CityPage from "@/app/judet/[countySlug]/oras/[citySlug]/page";
import { notFound } from "next/navigation";
import { getCityBySlug, getCounty } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo";
import { canIndexCityPage, canIndexCountyPage } from "@/lib/seo-rules";
import {
  getCountySeoOverride,
  isPriorityCountySlug,
  isPriorityLocalitySlug,
} from "@/lib/content/local-commercial";

type Props = {
  params: Promise<{ countySlug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { countySlug } = await params;
  const [county, city] = await Promise.all([getCounty(countySlug), getCityBySlug(countySlug)]);
  const countyOverride = getCountySeoOverride(countySlug);

  if (county && county.isActive) {
    const hasEnoughContent = canIndexCountyPage({
      companyCount: county.companies.length,
      hasIntro: Boolean(county.introText ?? county.intro),
    });
    const shouldForceIndex = isPriorityCountySlug(countySlug);

    return buildMetadata({
      title: countyOverride?.title ?? `Firme de alpinism utilitar in ${county.name}`,
      description:
        countyOverride?.description ??
        county.seoDescription ??
        county.introText ??
        county.intro ??
        `Gasesti firme de alpinism utilitar din ${county.name}, servicii populare si orase importante din judet.`,
      path: `/${county.slug}`,
      noIndex: !hasEnoughContent && !shouldForceIndex,
    });
  }

  if (city) {
    const hasEnoughContent = canIndexCityPage({
      companyCount: city.companies.length,
      hasIntro: Boolean(city.introText ?? city.intro),
    });
    const shouldForceIndex = isPriorityLocalitySlug(city.slug);

    return buildMetadata({
      title: `Alpinism utilitar in ${city.name}, ${city.county.name} | Firme locale`,
      description:
        city.seoDescription ??
        city.introText ??
        city.intro ??
        `Gasesti firme din ${city.name}, ${city.county.name}, compari servicii locale si trimiti rapid cererea pentru lucrarea la inaltime.`,
      path: `/${city.slug}`,
      noIndex: !hasEnoughContent && !shouldForceIndex,
    });
  }

  return buildMetadata({
    title: "Judet indisponibil",
    description: "Judetul cautat nu exista sau nu are continut suficient.",
    noIndex: true,
  });
}

export default async function CanonicalCountyPage({ params }: Props) {
  const { countySlug } = await params;
  const [county, city] = await Promise.all([getCounty(countySlug), getCityBySlug(countySlug)]);

  if (county && county.isActive) {
    return CountyPage({ params: Promise.resolve({ countySlug }) });
  }

  if (city) {
    return CityPage({
      params: Promise.resolve({ countySlug: city.county.slug, citySlug: city.slug }),
    });
  }

  notFound();
}
