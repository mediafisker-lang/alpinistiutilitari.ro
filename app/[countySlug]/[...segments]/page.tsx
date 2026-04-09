import { notFound } from "next/navigation";
import CityPage from "@/app/judet/[countySlug]/oras/[citySlug]/page";
import { getCity, resolveLocalLanding } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo";
import { LocalLandingPageContent } from "@/components/pages/local-landing-page";
import { canIndexCityServicePage, canIndexCountyServicePage } from "@/lib/seo-rules";
import { getLocalLandingContent, isPriorityLandingPath } from "@/lib/content/local-commercial";

type Props = {
  params: Promise<{ countySlug: string; segments: string[] }>;
};

function canRenderLocalLanding(
  data: Awaited<ReturnType<typeof resolveLocalLanding>>,
  locationSlug: string,
  serviceSlug: string,
) {
  if (!data) return false;
  if (isPriorityLandingPath(locationSlug, serviceSlug)) return true;
  return data.type === "city"
    ? canIndexCityServicePage(data.companies.length)
    : canIndexCountyServicePage(data.companies.length);
}

export async function generateMetadata({ params }: Props) {
  const { countySlug, segments } = await params;

  if (segments.length === 1) {
    const [city, landing] = await Promise.all([
      getCity(countySlug, segments[0]),
      resolveLocalLanding(countySlug, segments[0]),
    ]);

    if (city) {
      return buildMetadata({
        title: `Firme de alpinism utilitar in ${city.name}, ${city.county.name}`,
        description:
          city.seoDescription ??
          city.introText ??
          city.intro ??
          `Vezi firme active din ${city.name}, judetul ${city.county.name}, si trimite rapid o cerere de oferta.`,
        path: `/${city.slug}`,
        noIndex: true,
      });
    }

    const isDirectLanding =
      landing &&
      ((landing.type === "county" && landing.county.slug === countySlug) ||
        (landing.type === "city" && landing.city.slug === countySlug));

    if (isDirectLanding && landing) {
      const landingContent = getLocalLandingContent({
        locationSlug: countySlug,
        countySlug: landing.county.slug,
        serviceSlug: segments[0],
        locationName: landing.type === "city" ? landing.city.name : landing.county.name,
        countyName: landing.county.name,
        type: landing.type,
        serviceName: landing.service.name,
      });
      const shouldIndex = canRenderLocalLanding(landing, countySlug, segments[0]);
      return buildMetadata({
        title: landingContent.title,
        description: landingContent.description,
        path: `/${countySlug}/${landing.service.slug}`,
        noIndex: !shouldIndex,
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
      data.county.slug === countySlug
    ) {
      const landingContent = getLocalLandingContent({
        locationSlug: segments[0],
        countySlug: data.county.slug,
        serviceSlug: segments[1],
        locationName: data.city.name,
        countyName: data.county.name,
        type: data.type,
        serviceName: data.service.name,
      });
      const shouldIndex = canRenderLocalLanding(data, segments[0], segments[1]);
      return buildMetadata({
        title: landingContent.title,
        description: landingContent.description,
        path: `/${city.slug}/${data.service.slug}`,
        noIndex: true,
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
    const [city, landing] = await Promise.all([
      getCity(countySlug, segments[0]),
      resolveLocalLanding(countySlug, segments[0]),
    ]);

    if (city) {
      return CityPage({ params: Promise.resolve({ countySlug, citySlug: segments[0] }) });
    }

    const isDirectLanding =
      landing &&
      ((landing.type === "county" && landing.county.slug === countySlug) ||
        (landing.type === "city" && landing.city.slug === countySlug));

    if (isDirectLanding && canRenderLocalLanding(landing, countySlug, segments[0])) {
      return LocalLandingPageContent({
        locationSlug: countySlug,
        serviceSlug: segments[0],
        sourcePage: `/${countySlug}/${segments[0]}`,
      });
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
      canRenderLocalLanding(data, segments[0], segments[1])
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
