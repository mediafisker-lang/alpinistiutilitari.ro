import { PrismaClient, CompanySourceType, ImportRunStatus } from "@prisma/client";
import { buildImportQueries, getPlaceDetails, searchPlacesByText } from "@/lib/integrations/google-places";
import { buildCitySeoCopy, normalizeCitySlugCandidate, normalizeCountySlugCandidate, shouldAutoCreateCity } from "@/lib/normalizers/location";
import { slugify } from "@/lib/utils";

type RunPlacesImportInput = {
  county?: string;
  city?: string;
  query?: string;
  prismaClient?: PrismaClient;
  minimumRating?: number;
};

const strictPortfolioKeywords = [
  "alpinism utilitar",
  "alpin utilitar",
  "alpinisti utilitari",
  "lucrari la inaltime",
  "interventii la inaltime",
  "spalare geamuri",
  "spalare fatade",
  "reparatii fatade",
  "reparatii acoperis",
  "curatare jgheaburi",
  "taiere copaci",
  "toaletare copaci",
  "arborist",
  "doborare controlata",
  "paratrasnet",
  "montaj antene",
  "catarge",
  "piloni",
  "turnuri",
  "cosuri industriale",
];

const weakHeightKeywords = [
  "alpin",
  "utilitar",
  "inaltime",
  "fatade",
  "geamuri",
  "acoperis",
  "jgheaburi",
  "copaci",
  "arbori",
  "arborist",
  "paratrasnet",
  "antene",
  "catarge",
  "piloni",
];

const importNegativeKeywords = [
  "agentie",
  "productie publicitara",
  "print",
  "tipografie",
  "restaurant",
  "hotel",
  "bar",
  "cafe",
  "salon",
  "farmacie",
  "service auto",
  "termopane",
];

function normalize(value?: string | null) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function countMatches(text: string, keywords: string[]) {
  return keywords.reduce((total, keyword) => total + (text.includes(keyword) ? 1 : 0), 0);
}

function buildDescriptionShort(name: string, city: string, county: string) {
  return `${name} este listată pentru ${city}, județul ${county}, cu activitate relevantă pentru lucrări la înălțime și servicii conexe.`;
}

function buildDescriptionLong(name: string, city: string, county: string, services: string[]) {
  const serviceText = services.length ? services.join(", ") : "lucrări la înălțime";
  return `${name} apare în surse externe sincronizate prin Google Places API pentru ${city}, județul ${county}. Profilul include date de localizare, contact public și servicii estimate ca relevante pentru ${serviceText}. Informațiile pot fi completate și verificate ulterior din admin.`;
}

async function resolveLocation(prisma: PrismaClient, params: { county?: string; city?: string }) {
  const county = params.county
    ? await prisma.county.findFirst({
        where: { OR: [{ slug: params.county }, { name: { equals: params.county, mode: "insensitive" } }] },
      })
    : null;

  const city = params.city
    ? await prisma.city.findFirst({
        where: { OR: [{ slug: params.city }, { name: { equals: params.city, mode: "insensitive" } }] },
        include: { county: true },
      })
    : null;

  return { county, city };
}

function matchAddressComponent(details: Awaited<ReturnType<typeof getPlaceDetails>>, type: string) {
  return details.addressComponents?.find((component) => component.types?.includes(type))?.longText;
}

async function resolveCountyAndCity(
  prisma: PrismaClient,
  details: Awaited<ReturnType<typeof getPlaceDetails>>,
  fallback?: { countyId?: string; cityId?: string },
) {
  if (fallback?.countyId && fallback?.cityId) {
    const [county, city] = await Promise.all([
      prisma.county.findUnique({ where: { id: fallback.countyId } }),
      prisma.city.findUnique({ where: { id: fallback.cityId } }),
    ]);
    if (county && city) return { county, city };
  }

  const countyName = matchAddressComponent(details, "administrative_area_level_1");
  const cityName =
    matchAddressComponent(details, "locality") ??
    matchAddressComponent(details, "administrative_area_level_2") ??
    matchAddressComponent(details, "postal_town") ??
    matchAddressComponent(details, "sublocality_level_1");

  if (!countyName || !cityName) return { county: null, city: null };

  const countySlugCandidate = normalizeCountySlugCandidate(countyName);
  const county = await prisma.county.findFirst({
    where: countySlugCandidate
      ? {
          OR: [{ name: { equals: countyName, mode: "insensitive" } }, { slug: countySlugCandidate }],
        }
      : { name: { equals: countyName, mode: "insensitive" } },
  });

  if (!county) return { county: null, city: null };

  const citySlugCandidate = normalizeCitySlugCandidate(cityName, county.slug);
  let city = await prisma.city.findFirst({
    where: {
      countyId: county.id,
      OR: [
        { name: { equals: cityName, mode: "insensitive" } },
        ...(citySlugCandidate ? [{ slug: citySlugCandidate }] : []),
      ],
    },
  });

  if (!city && citySlugCandidate && shouldAutoCreateCity(citySlugCandidate, county.slug)) {
    const inferredName =
      cityName
        .replace(/^Oraș\s+/i, "")
        .replace(/^Oras\s+/i, "")
        .replace(/^Comuna\s+/i, "")
        .replace(/^Municipiul\s+/i, "")
        .trim() || cityName;

    city = await prisma.city.create({
      data: {
        countyId: county.id,
        name: inferredName,
        slug: citySlugCandidate,
        ...buildCitySeoCopy(inferredName, county.name),
      },
    });
  }

  return { county, city };
}

async function mapServices(
  prisma: PrismaClient,
  details: Awaited<ReturnType<typeof getPlaceDetails>>,
  query: string,
) {
  const mappings = await prisma.googlePlaceCategoryMap.findMany({
    include: { service: true },
  });

  const matchedByType = mappings.filter((mapping) => details.types?.includes(mapping.placeType));
  const matched = new Map<string, { id: string; name: string }>();

  matchedByType.forEach((mapping) => {
    matched.set(mapping.serviceId, { id: mapping.service.id, name: mapping.service.name });
  });

  const text = `${details.displayName?.text ?? ""} ${query}`.toLowerCase();
  const services = await prisma.service.findMany();
  for (const service of services) {
    const keywords = [
      service.name,
      service.shortName ?? "",
      service.category ?? "",
      ...(service.slug.split("-") ?? []),
    ]
      .join(" ")
      .toLowerCase();

    if (
      text.includes("alpin") ||
      text.includes("inaltime") ||
      keywords.split(" ").some((token) => token && text.includes(token))
    ) {
      matched.set(service.id, { id: service.id, name: service.name });
    }
  }

  return [...matched.values()];
}

function hasImportPortfolioSignals(
  details: Awaited<ReturnType<typeof getPlaceDetails>>,
  query: string,
  services: { id: string; name: string }[],
) {
  const text = normalize(
    [
      details.displayName?.text,
      details.formattedAddress,
      query,
      ...services.map((service) => service.name),
    ].join(" "),
  );

  const strongMatches = countMatches(text, strictPortfolioKeywords);
  const weakMatches = countMatches(text, weakHeightKeywords);
  const negativeMatches = countMatches(text, importNegativeKeywords);

  if (negativeMatches >= 2) return false;
  if (strongMatches >= 1) return true;
  if (weakMatches >= 3 && services.length >= 1) return true;

  return false;
}

async function ensureUniqueSlug(prisma: PrismaClient, baseSlug: string, existingId?: string) {
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.company.findUnique({ where: { slug } });
    if (!existing || existing.id === existingId) return slug;
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

async function findExistingCompany(
  prisma: PrismaClient,
  details: Awaited<ReturnType<typeof getPlaceDetails>>,
  cityId?: string | null,
) {
  if (details.id) {
    const byExternalId = await prisma.company.findUnique({ where: { externalPlaceId: details.id } });
    if (byExternalId) return byExternalId;
  }

  if (details.websiteUri) {
    const byWebsite = await prisma.company.findFirst({ where: { website: details.websiteUri } });
    if (byWebsite) return byWebsite;
  }

  if (details.nationalPhoneNumber) {
    const byPhone = await prisma.company.findFirst({ where: { phone: details.nationalPhoneNumber } });
    if (byPhone) return byPhone;
  }

  if (details.displayName?.text && cityId) {
    return prisma.company.findFirst({
      where: { name: details.displayName.text, cityId },
    });
  }

  return null;
}

async function upsertPlace(
  prisma: PrismaClient,
  details: Awaited<ReturnType<typeof getPlaceDetails>>,
  query: string,
  importRunId: string,
  fallback?: { countyId?: string; cityId?: string },
  minimumRating = 4,
) {
  const ratingValue = details.rating ?? null;
  if (ratingValue === null || ratingValue < minimumRating) {
    await prisma.companyImportEvent.create({
      data: {
        importRunId,
        externalId: details.id,
        status: "skipped_low_rating",
        payloadJson: {
          query,
          rating: details.rating ?? null,
          minimumRating,
          displayName: details.displayName?.text,
          formattedAddress: details.formattedAddress,
        },
      },
    });
    return "skipped" as const;
  }

  const { county, city } = await resolveCountyAndCity(prisma, details, fallback);
  if (fallback?.countyId && county && county.id !== fallback.countyId) {
    await prisma.companyImportEvent.create({
      data: {
        importRunId,
        externalId: details.id,
        status: "skipped_outside_target_county",
        payloadJson: {
          query,
          targetCountyId: fallback.countyId,
          resolvedCounty: county.name,
          formattedAddress: details.formattedAddress,
          displayName: details.displayName?.text,
        },
      },
    });
    return "skipped" as const;
  }

  if (!county || !city) {
    await prisma.companyImportEvent.create({
      data: {
        importRunId,
        externalId: details.id,
        status: "skipped_missing_location",
        payloadJson: details,
      },
    });
    return "skipped" as const;
  }

  const services = await mapServices(prisma, details, query);
  if (!hasImportPortfolioSignals(details, query, services)) {
    await prisma.companyImportEvent.create({
      data: {
        importRunId,
        externalId: details.id,
        status: "skipped_irrelevant_portfolio",
        payloadJson: {
          query,
          displayName: details.displayName?.text,
          formattedAddress: details.formattedAddress,
          services,
        },
      },
    });
    return "skipped" as const;
  }
  const existing = await findExistingCompany(prisma, details, city.id);
  const slug = await ensureUniqueSlug(prisma, slugify(details.displayName?.text ?? "firma-alpinism"), existing?.id);
  const descriptionShort = buildDescriptionShort(details.displayName?.text ?? "Firma", city.name, county.name);
  const descriptionLong = buildDescriptionLong(
    details.displayName?.text ?? "Firma",
    city.name,
    county.name,
    services.map((service) => service.name),
  );

  const company = existing
    ? await prisma.company.update({
        where: { id: existing.id },
        data: {
          name: details.displayName?.text ?? existing.name,
          slug,
          countyId: county.id,
          cityId: city.id,
          address: details.formattedAddress ?? existing.address,
          phone: details.nationalPhoneNumber ?? existing.phone,
          website: details.websiteUri ?? existing.website,
          googleMapsUrl: details.googleMapsUri ?? existing.googleMapsUrl,
          externalPlaceId: details.id ?? existing.externalPlaceId,
          latitude: details.location?.latitude ?? existing.latitude,
          longitude: details.location?.longitude ?? existing.longitude,
          ratingValue: details.rating ?? existing.ratingValue,
          ratingCount: details.userRatingCount ?? existing.ratingCount,
          openingHoursJson:
            details.regularOpeningHours?.weekdayDescriptions ??
            (existing.openingHoursJson ?? undefined),
          sourceType: CompanySourceType.google_places,
          lastSyncedAt: new Date(),
          descriptionShort: existing.descriptionShort || descriptionShort,
          descriptionLong: existing.descriptionLong || descriptionLong,
        },
      })
    : await prisma.company.create({
        data: {
          name: details.displayName?.text ?? "Firmă importată",
          slug,
          countyId: county.id,
          cityId: city.id,
          descriptionShort,
          descriptionLong,
          address: details.formattedAddress,
          phone: details.nationalPhoneNumber,
          website: details.websiteUri,
          googleMapsUrl: details.googleMapsUri,
          externalPlaceId: details.id,
          latitude: details.location?.latitude,
          longitude: details.location?.longitude,
          ratingValue: details.rating,
          ratingCount: details.userRatingCount,
          openingHoursJson: details.regularOpeningHours?.weekdayDescriptions ?? undefined,
          sourceType: CompanySourceType.google_places,
          verificationStatus: "pending",
          isPublished: true,
          lastSyncedAt: new Date(),
        },
      });

  if (services.length) {
    await prisma.companyService.deleteMany({ where: { companyId: company.id } });
    await prisma.companyService.createMany({
      data: services.map((service) => ({
        companyId: company.id,
        serviceId: service.id,
      })),
      skipDuplicates: true,
    });
  }

  await prisma.companyImportEvent.create({
    data: {
      importRunId,
      companyId: company.id,
      externalId: details.id,
      status: existing ? "updated" : "inserted",
      payloadJson: details,
    },
  });

  return existing ? "updated" as const : "inserted" as const;
}

export async function runPlacesImport({
  county,
  city,
  query,
  prismaClient,
  minimumRating = 4,
}: RunPlacesImportInput) {
  const localPrisma = prismaClient ?? new PrismaClient();
  const source = "google_places";
  const location = await resolveLocation(localPrisma, { county, city });
  const queries = buildImportQueries({
    countyName: location.county?.name,
    cityName: location.city?.name,
    customQuery: query,
  });

  const run = await localPrisma.companyImportRun.create({
    data: {
      source,
      query: query ?? queries.join(" | "),
      countyId: location.county?.id,
      cityId: location.city?.id,
      status: ImportRunStatus.running,
      startedAt: new Date(),
    },
  });

  let totalFound = 0;
  let totalImported = 0;
  let totalUpdated = 0;
  const seen = new Set<string>();

  try {
    for (const queryString of queries) {
      let searchResults: Awaited<ReturnType<typeof searchPlacesByText>> = [];
      try {
        searchResults = await searchPlacesByText(queryString);
        totalFound += searchResults.length;
      } catch (error) {
        await localPrisma.companyImportEvent.create({
          data: {
            importRunId: run.id,
            status: "failed",
            payloadJson: {
              query: queryString,
              stage: "searchText",
              error: error instanceof Error ? error.message : "Eroare necunoscută la Text Search",
            },
          },
        });
        continue;
      }

      for (const item of searchResults) {
        const placeId = item.id;
        if (!placeId || seen.has(placeId)) continue;
        seen.add(placeId);

        try {
          const details = await getPlaceDetails(placeId);
          const result = await upsertPlace(localPrisma, details, queryString, run.id, {
            countyId: location.county?.id,
            cityId: location.city?.id,
          }, minimumRating);

          if (result === "inserted") totalImported += 1;
          if (result === "updated") totalUpdated += 1;
        } catch (error) {
          await localPrisma.companyImportEvent.create({
            data: {
              importRunId: run.id,
              externalId: placeId,
              status: "failed",
              payloadJson: {
                query: queryString,
                error: error instanceof Error ? error.message : "Eroare necunoscută la Place Details",
              },
            },
          });
        }
      }
    }

    const updatedRun = await localPrisma.companyImportRun.update({
      where: { id: run.id },
      data: {
        totalFound,
        totalImported,
        totalUpdated,
        status: ImportRunStatus.completed,
        finishedAt: new Date(),
      },
      include: { county: true, city: true },
    });

    return updatedRun;
  } catch (error) {
    await localPrisma.companyImportRun.update({
      where: { id: run.id },
      data: {
        status: ImportRunStatus.failed,
        finishedAt: new Date(),
        logJson: { error: error instanceof Error ? error.message : "Eroare necunoscută" },
      },
    });
    throw error;
  } finally {
    if (!prismaClient) {
      await localPrisma.$disconnect();
    }
  }
}
