import { filterCompaniesWithUtilityPortfolio } from "@/lib/company-ranking";
import { prisma } from "@/lib/db";
import {
  getFallbackArticles,
  getFallbackCompanies,
  getFallbackCounties,
  getFallbackServices,
} from "@/lib/data/fallback";
import {
  canIndexCityPage,
  canIndexCityServicePage,
  canIndexCountyPage,
  canIndexCountyServicePage,
} from "@/lib/seo-rules";
import { absoluteUrl } from "@/lib/utils";

export type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

type SitemapCounty = {
  id: string;
  slug: string;
  intro: string | null;
  introText: string | null;
  updatedAt: Date;
};

type SitemapCity = {
  id: string;
  slug: string;
  countyId: string;
  countySlug: string;
  intro: string | null;
  introText: string | null;
  updatedAt: Date;
};

type SitemapService = {
  id: string;
  slug: string;
  updatedAt: Date;
};

type SitemapCompany = {
  id: string;
  slug: string;
  name: string;
  descriptionShort: string | null;
  descriptionLong: string | null;
  sourceType: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  ratingValue: number | null;
  ratingCount: number | null;
  website: string | null;
  phone: string | null;
  countyId: string;
  cityId: string;
  updatedAt: Date;
  coverage: Array<{
    countyId: string | null;
    cityId: string | null;
  }>;
  services: Array<{
    service: {
      id: string;
      slug: string;
      name: string;
      category: string | null;
      shortName: string | null;
      isActive: boolean;
      updatedAt: Date;
    };
  }>;
};

type SitemapDataset = {
  counties: SitemapCounty[];
  cities: SitemapCity[];
  services: SitemapService[];
  companies: SitemapCompany[];
};

type CountAccumulator = {
  companyIds: Set<string>;
  latest: Date;
};

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderUrlSet(entries: SitemapEntry[]) {
  const body = entries
    .map(
      (entry) =>
        `<url><loc>${xmlEscape(entry.loc)}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}</url>`,
    )
    .join("");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`
  );
}

export function renderSitemapIndex(entries: SitemapEntry[]) {
  const body = entries
    .map(
      (entry) =>
        `<sitemap><loc>${xmlEscape(entry.loc)}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}</sitemap>`,
    )
    .join("");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`
  );
}

function toEntry(path: string, lastModified?: Date | string | null): SitemapEntry {
  return {
    loc: absoluteUrl(path),
    lastmod: lastModified ? new Date(lastModified).toISOString() : undefined,
  };
}

function pickLatest(...dates: Array<Date | null | undefined>) {
  return dates.reduce<Date | undefined>((latest, current) => {
    if (!current) return latest;
    if (!latest) return current;
    return latest > current ? latest : current;
  }, undefined);
}

function addCompanyToCountMap(
  map: Map<string, CountAccumulator>,
  key: string,
  companyId: string,
  companyUpdatedAt: Date,
) {
  const current = map.get(key);
  if (!current) {
    map.set(key, {
      companyIds: new Set([companyId]),
      latest: companyUpdatedAt,
    });
    return;
  }

  current.companyIds.add(companyId);
  if (companyUpdatedAt > current.latest) {
    current.latest = companyUpdatedAt;
  }
}

async function getSitemapDataset(): Promise<SitemapDataset> {
  try {
    return await getDatabaseSitemapDataset();
  } catch {
    return getFallbackSitemapDataset();
  }
}

async function getDatabaseSitemapDataset(): Promise<SitemapDataset> {
  const [counties, cities, services, companiesRaw] = await Promise.all([
    prisma.county.findMany({
      where: { isActive: true },
      select: {
        id: true,
        slug: true,
        intro: true,
        introText: true,
        updatedAt: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.city.findMany({
      where: { isActive: true, county: { isActive: true } },
      select: {
        id: true,
        slug: true,
        countyId: true,
        county: { select: { slug: true } },
        intro: true,
        introText: true,
        updatedAt: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.company.findMany({
      where: {
        isPublished: true,
        isActive: true,
        verificationStatus: { not: "hidden" },
        county: { isActive: true },
        city: { isActive: true, county: { isActive: true } },
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
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
        updatedAt: true,
        coverage: {
          select: {
            countyId: true,
            cityId: true,
          },
        },
        services: {
          select: {
            service: {
              select: {
                id: true,
                slug: true,
                name: true,
                category: true,
                shortName: true,
                isActive: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const companies = filterCompaniesWithUtilityPortfolio(companiesRaw).map((company) => ({
    ...company,
    services: company.services.filter((item) => item.service.isActive),
  }));

  return {
    counties,
    cities: cities.map((city) => ({
      id: city.id,
      slug: city.slug,
      countyId: city.countyId,
      countySlug: city.county.slug,
      intro: city.intro,
      introText: city.introText,
      updatedAt: city.updatedAt,
    })),
    services,
    companies,
  };
}

function getFallbackSitemapDataset(): SitemapDataset {
  const fallbackCounties = getFallbackCounties()
    .filter((county) => county.isActive)
    .map((county) => ({
      id: county.id,
      slug: county.slug,
      intro: county.intro ?? null,
      introText: county.introText ?? null,
      updatedAt: county.updatedAt,
      cities: (county.cities ?? []).filter((city) => city.isActive),
    }));

  const services = getFallbackServices()
    .filter((service) => service.isActive)
    .map((service) => ({
      id: service.id,
      slug: service.slug,
      updatedAt: service.updatedAt,
    }));

  const companiesRaw = getFallbackCompanies().filter(
    (company) =>
      company.isPublished &&
      company.isActive &&
      company.verificationStatus !== "hidden",
  );

  const companies = filterCompaniesWithUtilityPortfolio(companiesRaw).map((company) => ({
    id: company.id,
    slug: company.slug,
    name: company.name,
    descriptionShort: company.descriptionShort ?? null,
    descriptionLong: company.descriptionLong ?? null,
    sourceType: company.sourceType ?? null,
    isFeatured: company.isFeatured,
    isVerified: company.isVerified,
    ratingValue: company.ratingValue ?? null,
    ratingCount: company.ratingCount ?? null,
    website: company.website ?? null,
    phone: company.phone ?? null,
    countyId: company.countyId,
    cityId: company.cityId,
    updatedAt: company.updatedAt,
    coverage: (company.coverage ?? []).map((coverage) => ({
      countyId: coverage.countyId,
      cityId: coverage.cityId,
    })),
    services: company.services
      .filter((item) => item.service.isActive)
      .map((item) => ({
        service: {
          id: item.service.id,
          slug: item.service.slug,
          name: item.service.name,
          category: item.service.category ?? null,
          shortName: item.service.shortName ?? null,
          isActive: item.service.isActive,
          updatedAt: item.service.updatedAt,
        },
      })),
  }));

  return {
    counties: fallbackCounties.map((county) => ({
      id: county.id,
      slug: county.slug,
      intro: county.intro,
      introText: county.introText,
      updatedAt: county.updatedAt,
    })),
    cities: fallbackCounties.flatMap((county) =>
      county.cities.map((city) => ({
        id: city.id,
        slug: city.slug,
        countyId: city.countyId,
        countySlug: county.slug,
        intro: city.intro ?? null,
        introText: city.introText ?? null,
        updatedAt: city.updatedAt,
      })),
    ),
    services,
    companies,
  };
}

export function getSitemapIndexEntries() {
  const now = new Date().toISOString();

  return [
    toEntry("/sitemap-main.xml", now),
    toEntry("/sitemap-counties.xml", now),
    toEntry("/sitemap-cities.xml", now),
    toEntry("/sitemap-services.xml", now),
    toEntry("/sitemap-county-service.xml", now),
    toEntry("/sitemap-companies.xml", now),
    toEntry("/sitemap-blog.xml", now),
  ];
}

export async function getMainSitemapEntries(): Promise<SitemapEntry[]> {
  return [
    toEntry("/"),
    toEntry("/judete"),
    toEntry("/servicii"),
    toEntry("/firme"),
    toEntry("/blog"),
    toEntry("/cere-oferta"),
    toEntry("/despre-noi"),
    toEntry("/contact"),
    toEntry("/cum-functioneaza"),
    toEntry("/pentru-firme"),
    toEntry("/intrebari-frecvente"),
  ];
}

export async function getCountySitemapEntries(): Promise<SitemapEntry[]> {
  const dataset = await getSitemapDataset();
  const countiesById = new Map(dataset.counties.map((county) => [county.id, county]));
  const countyCounts = new Map<string, CountAccumulator>();

  for (const company of dataset.companies) {
    const countyIds = new Set<string>();
    if (countiesById.has(company.countyId)) {
      countyIds.add(company.countyId);
    }

    for (const coverage of company.coverage) {
      if (coverage.countyId && countiesById.has(coverage.countyId)) {
        countyIds.add(coverage.countyId);
      }
    }

    for (const countyId of countyIds) {
      addCompanyToCountMap(countyCounts, countyId, company.id, company.updatedAt);
    }
  }

  return dataset.counties
    .filter((county) =>
      canIndexCountyPage({
        companyCount: countyCounts.get(county.id)?.companyIds.size ?? 0,
        hasIntro: Boolean(county.introText ?? county.intro),
      }),
    )
    .map((county) => {
      const stats = countyCounts.get(county.id);
      return toEntry(`/${county.slug}`, pickLatest(county.updatedAt, stats?.latest));
    });
}

export async function getCitySitemapEntries(): Promise<SitemapEntry[]> {
  const dataset = await getSitemapDataset();
  const citiesById = new Map(dataset.cities.map((city) => [city.id, city]));
  const cityCounts = new Map<string, CountAccumulator>();

  for (const company of dataset.companies) {
    const cityIds = new Set<string>();
    if (citiesById.has(company.cityId)) {
      cityIds.add(company.cityId);
    }

    for (const coverage of company.coverage) {
      if (coverage.cityId && citiesById.has(coverage.cityId)) {
        cityIds.add(coverage.cityId);
      }
    }

    for (const cityId of cityIds) {
      addCompanyToCountMap(cityCounts, cityId, company.id, company.updatedAt);
    }
  }

  return dataset.cities
    .filter((city) =>
      canIndexCityPage({
        companyCount: cityCounts.get(city.id)?.companyIds.size ?? 0,
        hasIntro: Boolean(city.introText ?? city.intro),
      }),
    )
    .map((city) => {
      const stats = cityCounts.get(city.id);
      return toEntry(
        `/${city.countySlug}/${city.slug}`,
        pickLatest(city.updatedAt, stats?.latest),
      );
    });
}

export async function getServiceSitemapEntries(): Promise<SitemapEntry[]> {
  const dataset = await getSitemapDataset();
  return dataset.services.map((service) => toEntry(`/servicii/${service.slug}`, service.updatedAt));
}

export async function getCountyServiceSitemapEntries(): Promise<SitemapEntry[]> {
  const dataset = await getSitemapDataset();
  const countiesById = new Map(dataset.counties.map((county) => [county.id, county]));
  const citiesById = new Map(dataset.cities.map((city) => [city.id, city]));
  const servicesById = new Map(dataset.services.map((service) => [service.id, service]));
  const countyServiceCounts = new Map<string, CountAccumulator>();
  const cityServiceCounts = new Map<string, CountAccumulator>();

  for (const company of dataset.companies) {
    const countyTargets = new Map<string, SitemapCounty>();
    const directCounty = countiesById.get(company.countyId);
    if (directCounty) {
      countyTargets.set(directCounty.id, directCounty);
    }

    for (const coverage of company.coverage) {
      if (!coverage.countyId) continue;
      const county = countiesById.get(coverage.countyId);
      if (county) {
        countyTargets.set(county.id, county);
      }
    }

    const cityTargets = new Map<string, SitemapCity>();
    const directCity = citiesById.get(company.cityId);
    if (directCity) {
      cityTargets.set(directCity.id, directCity);
    }

    for (const coverage of company.coverage) {
      if (!coverage.cityId) continue;
      const city = citiesById.get(coverage.cityId);
      if (city) {
        cityTargets.set(city.id, city);
      }
    }

    const serviceTargets = new Map<string, SitemapService>();
    for (const item of company.services) {
      const service = servicesById.get(item.service.id);
      if (service) {
        serviceTargets.set(service.id, service);
      }
    }

    for (const county of countyTargets.values()) {
      for (const service of serviceTargets.values()) {
        const key = `${county.id}::${service.id}`;
        addCompanyToCountMap(countyServiceCounts, key, company.id, company.updatedAt);
      }
    }

    for (const city of cityTargets.values()) {
      for (const service of serviceTargets.values()) {
        const key = `${city.id}::${service.id}`;
        addCompanyToCountMap(cityServiceCounts, key, company.id, company.updatedAt);
      }
    }
  }

  const entries: SitemapEntry[] = [];
  for (const [key, stats] of countyServiceCounts.entries()) {
    if (!canIndexCountyServicePage(stats.companyIds.size)) {
      continue;
    }

    const [countyId, serviceId] = key.split("::");
    const county = countiesById.get(countyId);
    const service = servicesById.get(serviceId);
    if (!county || !service) {
      continue;
    }

    entries.push(
      toEntry(
        `/${county.slug}/${service.slug}`,
        pickLatest(county.updatedAt, service.updatedAt, stats.latest),
      ),
    );
  }

  for (const [key, stats] of cityServiceCounts.entries()) {
    if (!canIndexCityServicePage(stats.companyIds.size)) {
      continue;
    }

    const [cityId, serviceId] = key.split("::");
    const city = citiesById.get(cityId);
    const service = servicesById.get(serviceId);
    if (!city || !service) {
      continue;
    }

    entries.push(
      toEntry(
        `/${city.countySlug}/${city.slug}/${service.slug}`,
        pickLatest(city.updatedAt, service.updatedAt, stats.latest),
      ),
    );
  }

  return entries.sort((left, right) => left.loc.localeCompare(right.loc, "ro"));
}

export async function getCompanySitemapEntries(): Promise<SitemapEntry[]> {
  const dataset = await getSitemapDataset();
  return dataset.companies
    .map((company) => toEntry(`/firme/${company.slug}`, company.updatedAt))
    .sort((left, right) => left.loc.localeCompare(right.loc, "ro"));
}

export async function getBlogSitemapEntries(): Promise<SitemapEntry[]> {
  try {
    const posts = await prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    return posts.map((post) => toEntry(`/blog/${post.slug}`, post.updatedAt ?? post.publishedAt));
  } catch {
    return getFallbackArticles().map((article) => toEntry(`/blog/${article.slug}`, article.updatedAt));
  }
}
