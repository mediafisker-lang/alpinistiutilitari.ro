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
    include: companyInclude,
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

    return { counties: mergedCounties, cities: mergedCities, services };
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
    if (!city) return null;
    return {
      ...city,
      companies: sortCompaniesForSeo(filterCompaniesWithUtilityPortfolio(city.companies)),
    };
  } catch {
    return getFallbackCity(countySlug, citySlug) as CityDetail | null;
  }
}

export async function getServices(): Promise<ServiceWithStats[]> {
  try {
    return await prisma.service.findMany({
      where: { isActive: true },
      include: { _count: { select: { companies: true, leadRequests: true } } },
      orderBy: { name: "asc" },
    });
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
    if (!service) return null;
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
  const [county, city, service] = await Promise.all([
    prisma.county.findUnique({ where: { slug: locationSlug }, include: { cities: true } }).catch(() => null),
    prisma.city.findUnique({ where: { slug: locationSlug }, include: { county: true } }).catch(() => null),
    prisma.service.findUnique({ where: { slug: serviceSlug } }).catch(() => null),
  ]);

  if (!service) return null;

  if (city) {
    const candidates = await prisma.company.findMany({
      where: {
        isPublished: true,
        isActive: true,
        verificationStatus: { not: "hidden" },
        OR: [
          { cityId: city.id },
          { coverage: { some: { cityId: city.id } } },
          { countyId: city.countyId },
          { coverage: { some: { countyId: city.countyId } } },
        ],
      },
      include: companyInclude,
      orderBy: [{ isFeatured: "desc" }, { ratingValue: "desc" }, { name: "asc" }],
    });
    const companies = rankLocalServiceCompanies(
      filterCompaniesWithUtilityPortfolio(dedupeCompanies(candidates)),
      service,
      {
      countyId: city.countyId,
      cityId: city.id,
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
        OR: [{ countyId: county.id }, { coverage: { some: { countyId: county.id } } }],
      },
      include: companyInclude,
      orderBy: [{ isFeatured: "desc" }, { ratingValue: "desc" }, { name: "asc" }],
    });
    const companies = rankLocalServiceCompanies(
      filterCompaniesWithUtilityPortfolio(dedupeCompanies(candidates)),
      service,
      {
      countyId: county.id,
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
