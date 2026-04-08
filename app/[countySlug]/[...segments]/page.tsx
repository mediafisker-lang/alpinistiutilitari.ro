import { notFound } from "next/navigation";
import CityPage from "@/app/judet/[countySlug]/oras/[citySlug]/page";
import { getCity, getCounty, getService, resolveLocalLanding } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo";
import { LocalLandingPageContent } from "@/components/pages/local-landing-page";
import { canIndexCityPage, canIndexCityServicePage, canIndexCountyServicePage } from "@/lib/seo-rules";

type Props = {
  params: Promise<{ countySlug: string; segments: string[] }>;
};

export async function generateMetadata({ params }: Props) {
  const { countySlug, segments } = await params;

  if (segments.length === 1) {
    const [city, service] = await Promise.all([getCity(countySlug, segments[0]), getService(segments[0])]);

    if (
      city &&
      canIndexCityPage({
        companyCount: city.companies.length,
        hasIntro: Boolean(city.introText ?? city.intro),
      })
    ) {
      return buildMetadata({
        title: `Firme de alpinism utilitar in ${city.name}, ${city.county.name}`,
        description:
          city.seoDescription ??
          city.introText ??
          city.intro ??
          `Vezi firme active din ${city.name}, judetul ${city.county.name}, si trimite rapid o cerere de oferta.`,
        path: `/${city.county.slug}/${city.slug}`,
      });
    }

    if (service) {
      const county = await getCounty(countySlug);
      if (!county || !canIndexCountyServicePage(county.companies.length)) {
        return buildMetadata({
          title: "Pagină locală indisponibilă",
          description: "Combinația locală solicitată nu există.",
          noIndex: true,
        });
      }

      return buildMetadata({
        title: `${service.name} in ${county.name}`,
        description: `Compară firme din ${county.name} pentru ${service.name.toLowerCase()} si trimite o cerere unica de oferta.`,
        path: `/${county.slug}/${service.slug}`,
      });
    }
  }

  if (segments.length === 2) {
    const [city, data] = await Promise.all([
      getCity(countySlug, segments[0]),
      resolveLocalLanding(segments[0], segments[1]),
    ]);

    if (
      city &&
      data &&
      data.type === "city" &&
      data.city.slug === city.slug &&
      data.county.slug === countySlug &&
      canIndexCityServicePage(data.companies.length)
    ) {
      return buildMetadata({
        title: `${data.service.name} in ${city.name}, ${city.county.name}`,
        description: `Găsește ${data.service.name.toLowerCase()} în ${city.name}, compară firmele locale și trimite rapid o cerere de ofertă.`,
        path: `/${city.county.slug}/${city.slug}/${data.service.slug}`,
      });
    }
  }

  return buildMetadata({
    title: "Pagină indisponibilă",
    description: "Combinația locală solicitată nu există sau nu are suficient conținut util.",
    noIndex: true,
  });
}

export default async function CountySegmentsPage({ params }: Props) {
  const { countySlug, segments } = await params;

  if (segments.length === 1) {
    const [city, service] = await Promise.all([getCity(countySlug, segments[0]), getService(segments[0])]);

    if (
      city &&
      canIndexCityPage({
        companyCount: city.companies.length,
        hasIntro: Boolean(city.introText ?? city.intro),
      })
    ) {
      return CityPage({ params: Promise.resolve({ countySlug, citySlug: segments[0] }) });
    }

    if (service) {
      const county = await getCounty(countySlug);
      if (!county || !canIndexCountyServicePage(county.companies.length)) notFound();
      return LocalLandingPageContent({ locationSlug: countySlug, serviceSlug: segments[0] });
    }
  }

  if (segments.length === 2) {
    const city = await getCity(countySlug, segments[0]);
    const data = await resolveLocalLanding(segments[0], segments[1]);

    if (
      city &&
      data &&
      data.type === "city" &&
      data.city.slug === city.slug &&
      data.county.slug === countySlug &&
      canIndexCityServicePage(data.companies.length)
    ) {
      return LocalLandingPageContent({
        locationSlug: segments[0],
        serviceSlug: segments[1],
        sourcePage: `/${countySlug}/${segments[0]}/${segments[1]}`,
      });
    }
  }

  notFound();
}
