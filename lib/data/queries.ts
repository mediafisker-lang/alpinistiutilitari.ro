import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  filterCompaniesWithUtilityPortfolio,
  getCompanyServiceMatchScore,
  sortCompaniesForSeo,
  sortCompaniesForService,
} from "@/lib/company-ranking";
import {
  getFallbackArticle,
  getFallbackArticles,
  getFallbackCity,
  getFallbackCompanies,
  getFallbackCompany,
  getFallbackCounties,
  getFallbackCounty,
  getFallbackHomepageData,
  getFallbackService,
  getFallbackServices,
} from "@/lib/data/fallback";
import type {
  AdminDashboardData,
  ArticleCardData,
  CityDetail,
  CompanyCardData,
  CompanyDetail,
  CountyDetail,
  CountyWithStats,
  HomepageData,
  LeadRequestDetail,
  QuickSearchOptions,
  ServiceDetail,
  ServiceWithStats,
} from "@/lib/data/types";

const companyInclude = {
  county: true,
  city: true,
  coverage: { include: { county: true, city: true } },
  services: { include: { service: true } },
} satisfies Prisma.CompanyInclude;

const companyPortfolioSelect = {
  id: true,
  name: true,
  slug: true,
  descriptionShort: true,
  descriptionLong: true,
  sourceType: true,
  isFeatured: true,
  isVerified: true,
  ratingValue: true,
  ratingCount: true,
  website: true,
  phone: true,
  countyId: true,
  cityId: true,
  coverage: { select: { countyId: true, cityId: true } },
  services: {
    select: {
      service: {
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          shortName: true,
        },
      },
    },
  },
} satisfies Prisma.CompanySelect;

const syntheticLocalities: Record<
  string,
  { name: string; countySlug: string; intro: string }
> = {
  "sector-1": {
    name: "Sector 1",
    countySlug: "bucuresti",
    intro:
      "Sector 1 include cladiri office, hoteluri, clinici si ansambluri premium unde lucrarile la inaltime sunt solicitate frecvent.",
  },
  "sector-2": {
    name: "Sector 2",
    countySlug: "bucuresti",
    intro:
      "Sector 2 are mix rezidential-comercial, cu cereri constante pentru geamuri la inaltime, fatade si interventii punctuale.",
  },
  "sector-3": {
    name: "Sector 3",
    countySlug: "bucuresti",
    intro:
      "Sector 3 concentreaza blocuri noi, showroom-uri si zone cu trafic ridicat unde lucrarile la inaltime apar constant.",
  },
  "sector-4": {
    name: "Sector 4",
    countySlug: "bucuresti",
    intro:
      "Sector 4 are ansambluri rezidentiale dense si cladiri comerciale care necesita mentenanta periodica la inaltime.",
  },
  "sector-5": {
    name: "Sector 5",
    countySlug: "bucuresti",
    intro:
      "Sector 5 include imobile mixte, institutii si sedii operationale unde cererile pentru interventii la inaltime sunt recurente.",
  },
  "sector-6": {
    name: "Sector 6",
    countySlug: "bucuresti",
    intro:
      "Sector 6 are dezvoltare rezidentiala si retail extins, cu multe solicitari pentru geamuri la inaltime si lucrari pe fatade.",
  },
  tunari: {
    name: "Tunari",
    countySlug: "ilfov",
    intro:
      "Tunari este o localitate in dezvoltare unde apar frecvent lucrari la inaltime pentru vile, ansambluri noi si cladiri comerciale.",
  },
};

async function attachCountyCompanyCounts<
  T extends {
    id: string;
    _count?: { companies: number; leadRequests: number };
  },
>(counties: T[]) {
  if (!counties.length) return counties;

  const countyIds = new Set(counties.map((county) => county.id));
  const companies = await prisma.company.findMany({
    where: {
      isPublished: true,
      isActive: true,
      verificationStatus: { not: "hidden" },
      OR: [
        { countyId: { in: [...countyIds] } },
        { coverage: { some: { countyId: { in: [...countyIds] } } } },
      ],
    },
    select: companyPortfolioSelect,
  });
  const eligibleCompanies = filterCompaniesWithUtilityPortfolio(companies);

  const countMap = new Map<string, Set<string>>();
  counties.forEach((county) => countMap.set(county.id, new Set<string>()));

  for (const company of eligibleCompanies) {
    if (company.countyId && countyIds.has(company.countyId)) {
      countMap.get(company.countyId)?.add(company.id);
    }

    for (const coverage of company.coverage) {
      if (coverage.countyId && countyIds.has(coverage.countyId)) {
        countMap.get(coverage.countyId)?.add(company.id);
      }
    }
  }

  return counties.map((county) => {
    const companyCount = countMap.get(county.id)?.size ?? county._count?.companies ?? 0;
    return {
      ...county,
      companyCount,
      _count: county._count
        ? { ...county._count, companies: companyCount }
        : undefined,
    };
  });
}

function getUnifiedCountyCompanyCount(county: {
  _count?: { companies: number };
  companyCount?: number;
}) {
  return county.companyCount ?? county._count?.companies ?? 0;
}

function dedupeCompanies<T extends { id: string }>(companies: T[]) {
  const unique = new Map<string, T>();
  for (const company of companies) {
    if (!unique.has(company.id)) {
      unique.set(company.id, company);
    }
  }
  return [...unique.values()];
}

function getFallbackCityBySlug(citySlug: string) {
  const fallbackCounties = getFallbackCounties();

  for (const county of fallbackCounties) {
    const city = (county.cities ?? []).find((item) => item.slug === citySlug);
    if (city) {
      return {
        id: city.id,
        name: city.name,
        slug: city.slug,
        countyId: city.countyId,
        county: {
          id: county.id,
          name: county.name,
          slug: county.slug,
        },
      };
    }
  }

  return null;
}

function normalizeFallbackService(serviceSlug: string) {
  const fallbackService = getFallbackService(serviceSlug);
  if (!fallbackService) return null;

  return {
    id: fallbackService.id,
    name: fallbackService.name,
    slug: fallbackService.slug,
    category: fallbackService.category,
    shortName: fallbackService.shortName,
    updatedAt: fallbackService.updatedAt,
  };
}

function getCompanyLocalityBoost(
  company: Prisma.CompanyGetPayload<{ include: typeof companyInclude }>,
  input: { countyId: string; cityId?: string },
) {
  let score = 0;

  if (input.cityId) {
    if (company.cityId === input.cityId) score += 120;
    if ((company.coverage ?? []).some((coverage) => coverage.cityId === input.cityId)) score += 90;
  }

  if (company.countyId === input.countyId) score += 50;
  if ((company.coverage ?? []).some((coverage) => coverage.countyId === input.countyId)) score += 35;

  return score;
}

function rankLocalServiceCompanies(
  companies: Prisma.CompanyGetPayload<{ include: typeof companyInclude }>[],
  service: { id: string; slug: string; name: string; category?: string | null; shortName?: string | null },
  input: { countyId: string; cityId?: string; minInferredScore?: number },
) {
  const explicitMatches = companies.filter((company) =>
    company.services.some((item) => item.serviceId === service.id),
  ).length;
  const dynamicThreshold =
    companies.length >= 120
      ? 74
      : companies.length >= 80
        ? 66
        : companies.length >= 45
          ? 58
          : companies.length >= 25
            ? 50
            : input.minInferredScore ?? 48;
  const minInferredScore = explicitMatches >= 6 ? dynamicThreshold : Math.max(dynamicThreshold - 6, 42);

  const filtered = companies.filter((company) => {
    const serviceScore = getCompanyServiceMatchScore(company, service);
    const hasExplicitService = company.services.some((item) => item.serviceId === service.id);
    return hasExplicitService || serviceScore >= minInferredScore;
  });

  return [...filtered]
    .map((company) => ({
      company,
      localityBoost: getCompanyLocalityBoost(company, input),
      serviceScore: getCompanyServiceMatchScore(company, service),
    }))
    .sort((left, right) => {
      const totalRight = right.serviceScore + right.localityBoost;
      const totalLeft = left.serviceScore + left.localityBoost;
      if (totalRight !== totalLeft) return totalRight - totalLeft;

      const [serviceSortedLeft, serviceSortedRight] = sortCompaniesForService(
        [left.company, right.company],
        service,
      );
      if (serviceSortedLeft.id !== serviceSortedRight.id) {
        return serviceSortedLeft.id === left.company.id ? -1 : 1;
      }

      return 0;
    })
    .map((item) => item.company);
}

export async function getHomepageData(): Promise<HomepageData> {
  try {
    const [featuredCompaniesRaw, counties, services, articles, statsRaw] = await Promise.all([
      prisma.company.findMany({
        where: { isPublished: true, isActive: true, verificationStatus: { not: "hidden" } },
        include: companyInclude,
        orderBy: [{ isFeatured: "desc" }, { ratingValue: "desc" }, { createdAt: "desc" }],
        take: 24,
      }),
      prisma.county.findMany({
        include: {
          cities: { where: { isActive: true } },
          _count: { select: { companies: true, leadRequests: true } },
        },
        orderBy: { companies: { _count: "desc" } },
      }),
      prisma.service.findMany({
        where: { isActive: true },
        include: { _count: { select: { companies: true, leadRequests: true } } },
        orderBy: { companies: { _count: "desc" } },
        take: 8,
      }),
      prisma.article.findMany({
        where: { isPublished: true },
        include: { services: { include: { service: true } } },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      Promise.all([
        prisma.company.findMany({
          where: { isPublished: true, isActive: true, verificationStatus: { not: "hidden" } },
          include: companyInclude,
        }),
        prisma.leadRequest.count(),
        prisma.county.count(),
        prisma.city.count(),
        prisma.service.count(),
      ]),
    ]);
    const countiesWithCounts = await attachCountyCompanyCounts(counties);
    const featuredCompanies = filterCompaniesWithUtilityPortfolio(featuredCompaniesRaw).slice(0, 6);
    const visibleCompanyCount = filterCompaniesWithUtilityPortfolio(statsRaw[0]).length;

    const fallbackCounties = getFallbackCounties();
    const mergedCounties = [
      ...countiesWithCounts,
      ...fallbackCounties.filter(
        (fallbackCounty) => !countiesWithCounts.some((county) => county.slug === fallbackCounty.slug),
      ),
    ].sort((left, right) => {
      const countDelta = getUnifiedCountyCompanyCount(right) - getUnifiedCountyCompanyCount(left);
      if (countDelta !== 0) return countDelta;
      return left.name.localeCompare(right.name, "ro");
    });

    return {
      featuredCompanies: sortCompaniesForSeo(featuredCompanies),
      counties: mergedCounties as CountyWithStats[],
      services,
      articles,
      stats: {
        companies: visibleCompanyCount,
        leads: statsRaw[1],
        counties: statsRaw[2],
        cities: statsRaw[3],
        services: statsRaw[4],
      },
    };
  } catch {
    return getFallbackHomepageData() as HomepageData;
  }
}

export async function getQuickSearchOptions(): Promise<QuickSearchOptions> {
  try {
    const [counties, cities, services] = await Promise.all([
      prisma.county.findMany({ where: { isActive: true }, select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } }),
      prisma.city.findMany({
        where: { isActive: true, county: { isActive: true } },
        select: { id: true, name: true, slug: true, countyId: true },
        orderBy: [{ name: "asc" }],
      }),
      prisma.service.findMany({ where: { isActive: true }, select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } }),
    ]);

    const fallbackCounties = getFallbackCounties();
    const mergedCounties = [
      ...counties,
      ...fallbackCounties
        .filter((fallbackCounty) => !counties.some((county) => county.slug === fallbackCounty.slug))
        .map((county) => ({ id: county.id, name: county.name, slug: county.slug })),
    ].sort((left, right) => left.name.localeCompare(right.name, "ro"));

    const mergedCities = [
      ...cities,
      ...fallbackCounties.flatMap((county) =>
        (county.cities ?? [])
          .filter((fallbackCity) => !cities.some((city) => city.slug === fallbackCity.slug))
          .map((city) => ({
            id: city.id,
            name: city.name,
            slug: city.slug,
            countyId: city.countyId,
          })),
      ),
    ].sort((left, right) => left.name.localeCompare(right.name, "ro"));

    const fallbackServices = getFallbackServices();
    const mergedServices = [
      ...services,
      ...fallbackServices
        .filter((fallbackService) => !services.some((service) => service.slug === fallbackService.slug))
        .map((service) => ({ id: service.id, name: service.name, slug: service.slug })),
    ].sort((left, right) => left.name.localeCompare(right.name, "ro"));

    return { counties: mergedCounties, cities: mergedCities, services: mergedServices };
  } catch {
    const counties = getFallbackCounties();
    const services = getFallbackServices();
    return {
      counties: counties.map((county) => ({ id: county.id, name: county.name, slug: county.slug })),
      cities: counties.flatMap((county) =>
        (county.cities ?? []).map((city) => ({
          id: city.id,
          name: city.name,
          slug: city.slug,
          countyId: county.id,
        })),
      ),
      services: services.map((service) => ({ id: service.id, name: service.name, slug: service.slug })),
    };
  }
}

export async function getCompanies(filters?: {
  q?: string;
  countySlug?: string;
  citySlug?: string;
  serviceSlug?: string;
}): Promise<CompanyCardData[]> {
  try {
    const q = filters?.q?.trim();
    const companies = await prisma.company.findMany({
      where: {
        isPublished: true,
        isActive: true,
        verificationStatus: { not: "hidden" },
        OR:
          filters?.countySlug || filters?.citySlug
            ? [
                filters?.citySlug
                  ? {
                      city: { slug: filters.citySlug },
                    }
                  : undefined,
                filters?.citySlug
                  ? {
                      coverage: {
                        some: {
                          city: { slug: filters.citySlug },
                        },
                      },
                    }
                  : undefined,
                filters?.countySlug
                  ? {
                      county: { slug: filters.countySlug },
                    }
                  : undefined,
                filters?.countySlug
                  ? {
                      coverage: {
                        some: {
                          county: { slug: filters.countySlug },
                        },
                      },
                    }
                  : undefined,
              ].filter(Boolean) as Prisma.CompanyWhereInput[]
            : undefined,
        services: filters?.serviceSlug ? { some: { service: { slug: filters.serviceSlug } } } : undefined,
        AND: q
          ? [
              {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { descriptionShort: { contains: q, mode: "insensitive" } },
                  { descriptionLong: { contains: q, mode: "insensitive" } },
                  { county: { name: { contains: q, mode: "insensitive" } } },
                  { city: { name: { contains: q, mode: "insensitive" } } },
                  { services: { some: { service: { name: { contains: q, mode: "insensitive" } } } } },
                ],
              },
            ]
          : undefined,
      },
      include: companyInclude,
      orderBy: [{ isFeatured: "desc" }, { verificationStatus: "asc" }, { name: "asc" }],
    });
    return sortCompaniesForSeo(filterCompaniesWithUtilityPortfolio(companies));
  } catch {
    return getFallbackCompanies() as CompanyCardData[];
  }
}

export async function getCounties(): Promise<CountyWithStats[]> {
  try {
    const counties = await prisma.county.findMany({
      where: { isActive: true },
      include: {
        cities: { where: { isActive: true } },
        _count: { select: { companies: true, leadRequests: true } },
      },
      orderBy: { name: "asc" },
    });
    const countiesWithCounts = await attachCountyCompanyCounts(counties);

    const fallbackCounties = getFallbackCounties();
    const missingCounties = fallbackCounties.filter(
      (fallbackCounty) => !countiesWithCounts.some((county) => county.slug === fallbackCounty.slug),
    );

    return [...countiesWithCounts, ...missingCounties].sort((left, right) =>
      left.name.localeCompare(right.name, "ro"),
    ) as CountyWithStats[];
  } catch {
    return getFallbackCounties() as CountyWithStats[];
  }
}

export async function getCounty(slug: string): Promise<CountyDetail | null> {
  try {
    const county = await prisma.county.findUnique({
      where: { slug },
      include: {
        cities: { where: { isActive: true }, orderBy: { name: "asc" } },
        companies: {
          where: {
            isPublished: true,
            isActive: true,
            OR: [{ county: { slug } }, { coverage: { some: { county: { slug } } } }],
          },
          include: companyInclude,
          orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
        },
        faqs: true,
        _count: { select: { companies: true, leadRequests: true } },
      },
    });
    if (!county) {
      return getFallbackCounty(slug) as CountyDetail | null;
    }
    return {
      ...county,
      companies: sortCompaniesForSeo(filterCompaniesWithUtilityPortfolio(county.companies)),
    };
  } catch {
    return getFallbackCounty(slug) as CountyDetail | null;
  }
}

export async function getCity(countySlug: string, citySlug: string): Promise<CityDetail | null> {
  try {
    const city = await prisma.city.findFirst({
      where: { slug: citySlug, county: { slug: countySlug }, isActive: true },
      include: {
        county: true,
        companies: {
          where: {
            isPublished: true,
            isActive: true,
            OR: [{ city: { slug: citySlug } }, { coverage: { some: { city: { slug: citySlug } } } }],
          },
          include: companyInclude,
          orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
        },
        faqs: true,
        _count: { select: { companies: true, leadRequests: true } },
      },
    });
    if (!city) {
      return getSyntheticCity(countySlug, citySlug);
    }
    return {
      ...city,
      companies: sortCompaniesForSeo(filterCompaniesWithUtilityPortfolio(city.companies)),
    };
  } catch {
    const fallback = getFallbackCity(countySlug, citySlug) as CityDetail | null;
    if (fallback) return fallback;
    return getSyntheticCity(countySlug, citySlug);
  }
}

export async function getCityBySlug(citySlug: string): Promise<CityDetail | null> {
  try {
    const city = await prisma.city.findUnique({
      where: { slug: citySlug },
      select: {
        slug: true,
        county: { select: { slug: true } },
      },
    });

    if (city?.county?.slug) {
      return getCity(city.county.slug, citySlug);
    }
  } catch {
    // fallback below
  }

  const fallbackCounties = getFallbackCounties();
  for (const county of fallbackCounties) {
    const found = (county.cities ?? []).find((city) => city.slug === citySlug);
    if (found) {
      return getFallbackCity(county.slug, citySlug) as CityDetail | null;
    }
  }

  const synthetic = syntheticLocalities[citySlug];
  if (synthetic) {
    return getCity(synthetic.countySlug, citySlug);
  }

  return null;
}

async function getSyntheticCity(countySlug: string, citySlug: string): Promise<CityDetail | null> {
  const synthetic = syntheticLocalities[citySlug];
  if (!synthetic || synthetic.countySlug !== countySlug) return null;

  const [countyDb, companies] = await Promise.all([
    prisma.county.findUnique({ where: { slug: countySlug } }).catch(() => null),
    prisma.company
      .findMany({
        where: {
          isPublished: true,
          isActive: true,
          verificationStatus: { not: "hidden" },
          OR: [
            { city: { slug: citySlug } },
            { coverage: { some: { city: { slug: citySlug } } } },
            { county: { slug: countySlug } },
            { coverage: { some: { county: { slug: countySlug } } } },
          ],
        },
        include: companyInclude,
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      })
      .catch(() => []),
  ]);

  const fallbackCounty = countyDb ? null : (getFallbackCounty(countySlug) as CountyDetail | null);
  const county = countyDb ?? fallbackCounty;
  if (!county) return null;

  const sortedCompanies = sortCompaniesForSeo(
    filterCompaniesWithUtilityPortfolio(dedupeCompanies(companies)),
  );

  const now = new Date();

  return {
    id: `synthetic-city-${citySlug}`,
    countyId: county.id,
    name: synthetic.name,
    slug: citySlug,
    intro: synthetic.intro,
    introText: synthetic.intro,
    seoTitle: `Alpinism utilitar in ${synthetic.name}, ${county.name}`,
    seoDescription:
      `Gasesti firme pentru lucrari la inaltime in ${synthetic.name}, ${county.name}. ` +
      "Compari servicii locale si trimiti rapid cererea pentru executanti potriviti.",
    population: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    county: county as CityDetail["county"],
    companies: sortedCompanies,
    faqs: [],
    _count: {
      companies: sortedCompanies.length,
      leadRequests: 0,
    },
  } as CityDetail;
}

export async function getServices(): Promise<ServiceWithStats[]> {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      include: { _count: { select: { companies: true, leadRequests: true } } },
      orderBy: { name: "asc" },
    });

    const fallbackServices = getFallbackServices();
    const mergedServices = [
      ...services,
      ...fallbackServices.filter(
        (fallbackService) => !services.some((service) => service.slug === fallbackService.slug),
      ),
    ].sort((left, right) => left.name.localeCompare(right.name, "ro"));

    return mergedServices as ServiceWithStats[];
  } catch {
    return getFallbackServices() as ServiceWithStats[];
  }
}

export async function getService(slug: string): Promise<ServiceDetail | null> {
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        companies: {
          include: {
            company: {
              include: companyInclude,
            },
          },
        },
        articles: {
          include: {
            article: {
              include: { services: { include: { service: true } } },
            },
          },
        },
        faqs: true,
      },
    });
    if (!service) {
      return getFallbackService(slug) as ServiceDetail | null;
    }
    return {
      ...service,
      companies: sortCompaniesForSeo(
        filterCompaniesWithUtilityPortfolio(service.companies.map((item) => item.company)),
      ).map((company) => {
        const original = service.companies.find((item) => item.company.id === company.id);
        return original!;
      }),
    };
  } catch {
    return getFallbackService(slug) as ServiceDetail | null;
  }
}

export async function getCompany(slug: string): Promise<CompanyDetail | null> {
  try {
    const company = await prisma.company.findUnique({
      where: { slug, isPublished: true, isActive: true },
      include: {
        county: true,
        city: true,
        services: { include: { service: true } },
        coverage: { include: { county: true, city: true } },
        leadRequests: { take: 5, orderBy: { createdAt: "desc" } },
      },
    });
    if (!company || !filterCompaniesWithUtilityPortfolio([company]).length) return null;
    return company;
  } catch {
    return getFallbackCompany(slug) as CompanyDetail | null;
  }
}

export async function getArticles(): Promise<ArticleCardData[]> {
  try {
    return await prisma.article.findMany({
      where: { isPublished: true },
      include: { services: { include: { service: true } } },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return getFallbackArticles() as ArticleCardData[];
  }
}

export async function getArticle(slug: string): Promise<ArticleCardData | null> {
  try {
    return await prisma.article.findUnique({
      where: { slug },
      include: { services: { include: { service: true } } },
    });
  } catch {
    return getFallbackArticle(slug) as ArticleCardData | null;
  }
}

export async function getRelatedArticles(serviceIds: string[], excludeSlug?: string): Promise<ArticleCardData[]> {
  try {
    return await prisma.article.findMany({
      where: {
        isPublished: true,
        slug: excludeSlug ? { not: excludeSlug } : undefined,
        services: serviceIds.length ? { some: { serviceId: { in: serviceIds } } } : undefined,
      },
      include: { services: { include: { service: true } } },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
  } catch {
    return [];
  }
}

export async function resolveLocalLanding(locationSlug: string, serviceSlug: string) {
  const [countyDb, cityDb, serviceDb] = await Promise.all([
    prisma.county.findUnique({ where: { slug: locationSlug }, include: { cities: true } }).catch(() => null),
    prisma.city.findUnique({ where: { slug: locationSlug }, include: { county: true } }).catch(() => null),
    prisma.service.findUnique({ where: { slug: serviceSlug } }).catch(() => null),
  ]);

  const fallbackCity = cityDb ? null : getFallbackCityBySlug(locationSlug);
  const county =
    countyDb ??
    (fallbackCity
      ? {
          id: fallbackCity.county.id,
          name: fallbackCity.county.name,
          slug: fallbackCity.county.slug,
          cities: [],
        }
      : null);
  const city = cityDb ?? fallbackCity;
  const service = serviceDb ?? normalizeFallbackService(serviceSlug);

  if (!service) return null;

  if (city) {
    const candidates = await prisma.company.findMany({
      where: {
        isPublished: true,
        isActive: true,
        verificationStatus: { not: "hidden" },
        OR: [
          { city: { slug: city.slug } },
          { coverage: { some: { city: { slug: city.slug } } } },
          { county: { slug: city.county.slug } },
          { coverage: { some: { county: { slug: city.county.slug } } } },
        ],
      },
      include: companyInclude,
      orderBy: [{ isFeatured: "desc" }, { ratingValue: "desc" }, { name: "asc" }],
    });
    const countyIdForBoost =
      candidates.find((company) => company.county.slug === city.county.slug)?.countyId ?? city.countyId;
    const cityIdForBoost =
      candidates.find((company) => company.city.slug === city.slug)?.cityId ?? city.id;
    const companies = rankLocalServiceCompanies(
      filterCompaniesWithUtilityPortfolio(dedupeCompanies(candidates)),
      service,
      {
        countyId: countyIdForBoost,
        cityId: cityIdForBoost,
        minInferredScore: 44,
      },
    );

    return { type: "city" as const, city, county: city.county, service, companies };
  }

  if (county) {
    const candidates = await prisma.company.findMany({
      where: {
        isPublished: true,
        isActive: true,
        verificationStatus: { not: "hidden" },
        OR: [{ county: { slug: county.slug } }, { coverage: { some: { county: { slug: county.slug } } } }],
      },
      include: companyInclude,
      orderBy: [{ isFeatured: "desc" }, { ratingValue: "desc" }, { name: "asc" }],
    });
    const countyIdForBoost =
      candidates.find((company) => company.county.slug === county.slug)?.countyId ?? county.id;
    const companies = rankLocalServiceCompanies(
      filterCompaniesWithUtilityPortfolio(dedupeCompanies(candidates)),
      service,
      {
        countyId: countyIdForBoost,
        minInferredScore: 46,
      },
    );

    return { type: "county" as const, county, city: null, service, companies };
  }

  return null;
}

export async function getLeadRequests(filters?: {
  status?: string;
  countyId?: string;
  cityId?: string;
  serviceId?: string;
}): Promise<LeadRequestDetail[]> {
  return prisma.leadRequest.findMany({
    where: {
      status: filters?.status as Prisma.EnumLeadRequestStatusFilter | undefined,
      countyId: filters?.countyId,
      cityId: filters?.cityId,
      serviceId: filters?.serviceId,
    },
    include: {
      company: true,
      selections: { include: { company: true } },
      county: true,
      city: true,
      service: true,
      images: true,
      notes: { include: { adminUser: true } },
      events: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLeadRequest(id: string): Promise<LeadRequestDetail | null> {
  return prisma.leadRequest.findUnique({
    where: { id },
    include: {
      company: true,
      selections: { include: { company: true } },
      county: true,
      city: true,
      service: true,
      images: true,
      notes: { include: { adminUser: true }, orderBy: { createdAt: "desc" } },
      events: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [stats, latestLeads, recentImports] = await Promise.all([
    Promise.all([
      prisma.company.count(),
      prisma.company.count({ where: { isPublished: true } }),
      prisma.leadRequest.count(),
      prisma.article.count(),
      prisma.county.count(),
    ]),
    prisma.leadRequest.findMany({
      include: {
        company: true,
        selections: { include: { company: true } },
        county: true,
        city: true,
        service: true,
        images: true,
        notes: { include: { adminUser: true } },
        events: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.companyImportRun.findMany({
      include: { county: true, city: true },
      orderBy: { startedAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    stats: {
      companies: stats[0],
      activeCompanies: stats[1],
      leads: stats[2],
      articles: stats[3],
      counties: stats[4],
    },
    latestLeads,
    recentImports,
  };
}
