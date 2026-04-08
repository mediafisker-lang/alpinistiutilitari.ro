import type {
  AdminRole,
  Article,
  ArticleService,
  City,
  Company,
  CompanyService,
  County,
  Service,
  VerificationStatus,
} from "@prisma/client";
import {
  buildCityIntro,
  buildCountyIntro,
  buildCountySeoDescription,
  romanianCounties,
} from "@/lib/data/romanian-counties";

type DemoCompany = Company & {
  county: County;
  city: City;
  coverage?: Array<{
    id: string;
    companyId: string;
    countyId: string | null;
    cityId: string | null;
    isPrimary: boolean;
    createdAt: Date;
    county: County | null;
    city: City | null;
  }>;
  services: (CompanyService & { service: Service })[];
};

type DemoArticle = Article & {
  services: (ArticleService & { service: Service })[];
};

type DemoCounty = County & {
  cities?: City[];
  _count?: { companies: number };
  faqs?: Array<{ question: string; answer: string }>;
};

const now = new Date();

const counties: DemoCounty[] = romanianCounties.map((county) => ({
  id: `county-${county.shortCode.toLowerCase()}`,
  name: county.name,
  slug: county.slug,
  shortCode: county.shortCode,
  intro: buildCountyIntro(county.name),
  introText: buildCountyIntro(county.name),
  seoTitle: `Firme de alpinism utilitar ${county.name}`,
  seoDescription: buildCountySeoDescription(county.name),
  faqJson: [],
  isActive: true,
  createdAt: now,
  updatedAt: now,
}));

const cities: City[] = romanianCounties.flatMap((county) => {
  const parentCounty = counties.find((item) => item.slug === county.slug)!;
  const allCities = [county.countySeat, ...(county.extraCities ?? [])];

  return allCities.map((city) => ({
    id: `city-${parentCounty.shortCode?.toLowerCase()}-${city
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`,
    countyId: parentCounty.id,
    name: city,
    slug: city
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    intro: buildCityIntro(city, county.name),
    introText: buildCityIntro(city, county.name),
    seoTitle: `Alpinism utilitar ${city}`,
    seoDescription: `Firme de alpinism utilitar din ${city}, județul ${county.name}, pentru lucrări la înălțime și intervenții comerciale.`,
    population: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }));
});

const services: Service[] = [
  {
    id: "service-1",
    name: "Alpinism utilitar",
    slug: "alpinism-utilitar",
    category: "Lucrari la inaltime",
    shortName: "Alpinism utilitar",
    shortDescription:
      "Interventii rapide la inaltime pentru lucrari tehnice, montaj, mentenanta si siguranta.",
    longDescription:
      "Interventii rapide la inaltime pentru lucrari tehnice, montaj, mentenanta si siguranta pe cladiri, structuri sau instalatii.",
    seoTitle: "Firme de alpinism utilitar in Romania",
    seoDescription:
      "Ghid rapid pentru a gasi firme de alpinism utilitar din Romania dupa judet, oras si tip de lucrare.",
    seoIntro: null,
    icon: "mountain",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "service-2",
    name: "Spalare geamuri la inaltime",
    slug: "spalare-geamuri-la-inaltime",
    category: "Curatare si spalare fatade",
    shortName: "Spalare geamuri",
    shortDescription:
      "Curatare profesionala a geamurilor si fatadelor vitrate pentru birouri si imobile rezidentiale.",
    longDescription:
      "Curatare profesionala a geamurilor si fatadelor vitrate pentru birouri, showroom-uri si imobile rezidentiale.",
    seoTitle: "Spalare geamuri la inaltime",
    seoDescription:
      "Firme pentru spalare geamuri la inaltime, geamuri greu accesibile si pereti cortina.",
    seoIntro: null,
    icon: "sparkles",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "service-3",
    name: "Montaj bannere",
    slug: "montaj-bannere",
    category: "Publicitate la inaltime",
    shortName: "Montaj bannere",
    shortDescription:
      "Montaj si demontaj bannere, mesh-uri si alte sisteme publicitare la inaltime.",
    longDescription:
      "Montaj si demontaj bannere, mesh-uri, firme luminoase si alte sisteme publicitare la inaltime.",
    seoTitle: "Montaj bannere si mesh la inaltime",
    seoDescription:
      "Companii pentru montaj bannere, mesh si reclame publicitare la inaltime.",
    seoIntro: null,
    icon: "flag",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

const fallbackCountyBucuresti = counties.find((item) => item.slug === "bucuresti")!;
const fallbackCountyBrasov = counties.find((item) => item.slug === "brasov")!;
const fallbackCountyIlfov = counties.find((item) => item.slug === "ilfov")!;
const fallbackCityBucuresti = cities.find((item) => item.slug === "bucuresti" && item.countyId === fallbackCountyBucuresti.id)!;
const fallbackCityBrasov = cities.find((item) => item.slug === "brasov" && item.countyId === fallbackCountyBrasov.id)!;
const fallbackCityVoluntari = cities.find((item) => item.slug === "voluntari" && item.countyId === fallbackCountyIlfov.id)!;

function companyBase(
  partial: Omit<DemoCompany, "county" | "city" | "services"> & {
    county: County;
    city: City;
    services: Service[];
  },
): DemoCompany {
  return {
    ...partial,
    county: partial.county,
    city: partial.city,
    coverage: [
      {
        id: `${partial.id}-coverage-primary`,
        companyId: partial.id,
        countyId: partial.county.id,
        cityId: partial.city.id,
        isPrimary: true,
        createdAt: now,
        county: partial.county,
        city: partial.city,
      },
    ],
    services: partial.services.map((service, index) => ({
      id: `${partial.id}-service-${index}`,
      companyId: partial.id,
      serviceId: service.id,
      createdAt: now,
      service,
    })),
  };
}

const demoCompanies: DemoCompany[] = [
  companyBase({
    id: "company-1",
    countyId: "county-b",
    cityId: "city-b",
    name: "Altitudine Utilitara Bucuresti",
    slug: "altitudine-utilitara-bucuresti",
    legalName: "Altitudine Utilitara SRL",
    cui: "RO41234567",
    registrationNumber: "J40/1234/2019",
    descriptionShort:
      "Echipa din Bucuresti pentru alpinism utilitar, bannere, spalare geamuri si reparatii rapide la inaltime.",
    descriptionLong:
      "Altitudine Utilitara Bucuresti executa lucrari la inaltime pentru cladiri de birouri, fatade comerciale si proiecte tehnice. Platforma pune accent pe raspuns rapid, coordonare clara si formular unic de lead trimis catre firma.",
    logoUrl: null,
    coverImageUrl: null,
    website: "https://altitudine-utilitara.ro",
    email: "oferta@altitudine-utilitara.ro",
    phone: "0722000001",
    whatsapp: "40722000001",
    address: "Bulevardul Iuliu Maniu 7, Bucuresti",
    latitude: 44.434,
    longitude: 26.046,
    sourceType: "manual",
    externalPlaceId: null,
    googleMapsUrl: null,
    ratingValue: 4.9,
    ratingCount: 19,
    openingHoursJson: null,
    lastSyncedAt: null,
    manuallyEditedAt: now,
    foundedYear: 2019,
    galleryJson: [],
    source: "fallback",
    isVerified: true,
    verificationStatus: "verified" as VerificationStatus,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
    county: fallbackCountyBucuresti,
    city: fallbackCityBucuresti,
    services: [services[0], services[1], services[2]],
  }),
  companyBase({
    id: "company-2",
    countyId: "county-bv",
    cityId: "city-bv",
    name: "Vertical Fix Brasov",
    slug: "vertical-fix-brasov",
    legalName: "Vertical Fix Expert SRL",
    cui: "RO39876543",
    registrationNumber: "J08/456/2018",
    descriptionShort:
      "Firma din Brasov pentru fatade, etansari, geamuri si interventii de mentenanta la inaltime.",
    descriptionLong:
      "Vertical Fix Brasov lucreaza cu echipe specializate pentru reabilitare exterioara, curatare si reparatii de fatade.",
    logoUrl: null,
    coverImageUrl: null,
    website: "https://verticalfix.ro",
    email: "contact@verticalfix.ro",
    phone: "0733000002",
    whatsapp: null,
    address: "Strada Harmanului 12, Brasov",
    latitude: 45.658,
    longitude: 25.601,
    sourceType: "manual",
    externalPlaceId: null,
    googleMapsUrl: null,
    ratingValue: 4.8,
    ratingCount: 11,
    openingHoursJson: null,
    lastSyncedAt: null,
    manuallyEditedAt: now,
    foundedYear: 2018,
    galleryJson: [],
    source: "fallback",
    isVerified: true,
    verificationStatus: "verified" as VerificationStatus,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
    county: fallbackCountyBrasov,
    city: fallbackCityBrasov,
    services: [services[0], services[2]],
  }),
  companyBase({
    id: "company-3",
    countyId: "county-if",
    cityId: "city-vol",
    name: "Arbori Control Ilfov",
    slug: "arbori-control-ilfov",
    legalName: "Arbori Control Team SRL",
    cui: "RO42765432",
    registrationNumber: "J23/987/2020",
    descriptionShort:
      "Interventii pentru arbori, bannere si lucrari la inaltime in Ilfov, Voluntari, Otopeni si nordul Capitalei.",
    descriptionLong:
      "Arbori Control Ilfov preia solicitari din Ilfov pentru toaletare arbori, montaj bannere si servicii rapide la inaltime.",
    logoUrl: null,
    coverImageUrl: null,
    website: "https://arboricontrol.ro",
    email: "hello@arboricontrol.ro",
    phone: "0744000003",
    whatsapp: null,
    address: "Soseaua Pipera 45, Voluntari",
    latitude: 44.495,
    longitude: 26.117,
    sourceType: "manual",
    externalPlaceId: null,
    googleMapsUrl: null,
    ratingValue: 4.6,
    ratingCount: 7,
    openingHoursJson: null,
    lastSyncedAt: null,
    manuallyEditedAt: now,
    foundedYear: 2020,
    galleryJson: [],
    source: "fallback",
    isVerified: false,
    verificationStatus: "pending" as VerificationStatus,
    isFeatured: false,
    isActive: true,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
    county: fallbackCountyIlfov,
    city: fallbackCityVoluntari,
    services: [services[0], services[2]],
  }),
];

const demoArticles: DemoArticle[] = [
  {
    id: "article-1",
    title: "Cum alegi o firma de alpinism utilitar in Bucuresti",
    slug: "cum-alegi-o-firma-de-alpinism-utilitar-in-bucuresti",
    excerpt:
      "Ghid scurt pentru compararea firmelor dupa servicii, timp de raspuns, zona acoperita si verificare profil.",
    content:
      "Atunci cand cauti o firma de alpinism utilitar in Bucuresti, verifica daca are servicii clare, zone acoperite, mod de contact rapid si un profil complet.",
    coverImageUrl: null,
    seoTitle: "Cum alegi o firma de alpinism utilitar in Bucuresti",
    seoDescription:
      "Sfaturi practice pentru selectarea unei firme de alpinism utilitar in Bucuresti.",
    isPublished: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    services: [
      {
        id: "article-service-1",
        articleId: "article-1",
        serviceId: "service-1",
        service: services[0],
      },
    ],
  },
];

export function getFallbackHomepageData() {
  return {
    featuredCompanies: demoCompanies,
    counties: counties.map((county) => ({
      ...county,
      _count: {
        companies: demoCompanies.filter((company) => company.county.slug === county.slug).length,
        leadRequests: 0,
      },
    })),
    services: services.map((service) => ({
      ...service,
      _count: {
        companies: demoCompanies.filter((company) =>
          company.services.some((item) => item.service.slug === service.slug),
        ).length,
        leadRequests: 0,
      },
    })),
    articles: demoArticles,
    stats: {
      companies: demoCompanies.length,
      leads: 2,
      counties: counties.length,
      cities: cities.length,
      services: services.length,
    },
  };
}

export function getFallbackCompanies() {
  return demoCompanies;
}

export function getFallbackCounties() {
  return counties.map((county) => ({
    ...county,
    cities: cities.filter((city) => city.countyId === county.id),
    _count: {
      companies: demoCompanies.filter((company) => company.countyId === county.id).length,
      leadRequests: 0,
    },
  }));
}

export function getFallbackCounty(slug: string) {
  const county = counties.find((item) => item.slug === slug);
  if (!county) return null;

  return {
    ...county,
    cities: cities.filter((city) => city.countyId === county.id),
    companies: demoCompanies.filter((company) => company.countyId === county.id),
    faqs: [],
    _count: {
      companies: demoCompanies.filter((company) => company.countyId === county.id).length,
      leadRequests: 0,
    },
  };
}

export function getFallbackCity(countySlug: string, citySlug: string) {
  const county = counties.find((item) => item.slug === countySlug);
  const city = cities.find((item) => item.slug === citySlug);
  if (!county || !city || city.countyId !== county.id) return null;

  return {
    ...city,
    county,
    companies: demoCompanies.filter((company) => company.cityId === city.id),
    faqs: [],
    _count: {
      companies: demoCompanies.filter((company) => company.cityId === city.id).length,
      leadRequests: 0,
    },
  };
}

export function getFallbackServices() {
  return services.map((service) => ({
    ...service,
    _count: {
      companies: demoCompanies.filter((company) =>
        company.services.some((item) => item.service.slug === service.slug),
      ).length,
      leadRequests: 0,
    },
  }));
}

export function getFallbackService(slug: string) {
  const service = services.find((item) => item.slug === slug);
  if (!service) return null;

  return {
    ...service,
    companies: demoCompanies
      .filter((company) => company.services.some((item) => item.service.slug === slug))
      .map((company) => ({ company })),
    articles: demoArticles
      .filter((article) => article.services.some((item) => item.service.slug === slug))
      .map((article) => ({ article })),
    faqs: [],
  };
}

export function getFallbackCompany(slug: string) {
  return demoCompanies.find((item) => item.slug === slug) ?? null;
}

export function getFallbackArticles() {
  return demoArticles;
}

export function getFallbackArticle(slug: string) {
  return demoArticles.find((item) => item.slug === slug) ?? null;
}

export function getFallbackAdminUser() {
  return {
    id: "admin-demo",
    email: "admin@alpinistiutilitari.ro",
    passwordHash: "demo",
    role: "admin" as AdminRole,
    createdAt: now,
  };
}
