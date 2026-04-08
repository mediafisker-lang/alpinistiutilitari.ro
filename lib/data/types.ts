import type { Prisma } from "@prisma/client";

export type CompanyCardData = Prisma.CompanyGetPayload<{
  include: {
    county: true;
    city: true;
    coverage: { include: { county: true; city: true } };
    services: { include: { service: true } };
  };
}>;

export type CountyWithStats = Prisma.CountyGetPayload<{
  include: {
    cities: true;
    _count: { select: { companies: true; leadRequests: true } };
  };
}> & {
  companyCount?: number;
};

export type CityWithStats = Prisma.CityGetPayload<{
  include: {
    county: true;
    _count: { select: { companies: true; leadRequests: true } };
  };
}>;

export type ServiceWithStats = Prisma.ServiceGetPayload<{
  include: {
    _count: { select: { companies: true; leadRequests: true } };
  };
}>;

export type ServiceDetail = Prisma.ServiceGetPayload<{
  include: {
    companies: {
      include: {
        company: {
          include: {
            county: true;
            city: true;
            coverage: { include: { county: true; city: true } };
            services: { include: { service: true } };
          };
        };
      };
    };
    articles: { include: { article: true } };
    faqs: true;
  };
}>;

export type ArticleCardData = Prisma.ArticleGetPayload<{
  include: { services: { include: { service: true } } };
}>;

export type CountyDetail = Prisma.CountyGetPayload<{
  include: {
    cities: true;
    companies: {
      include: {
        city: true;
        county: true;
        coverage: { include: { county: true; city: true } };
        services: { include: { service: true } };
      };
    };
    faqs: true;
    _count: { select: { companies: true; leadRequests: true } };
  };
}>;

export type CityDetail = Prisma.CityGetPayload<{
  include: {
    county: true;
    companies: {
      include: {
        county: true;
        city: true;
        coverage: { include: { county: true; city: true } };
        services: { include: { service: true } };
      };
    };
    faqs: true;
    _count: { select: { companies: true; leadRequests: true } };
  };
}>;

export type CompanyDetail = Prisma.CompanyGetPayload<{
  include: {
    county: true;
    city: true;
    services: { include: { service: true } };
    coverage: { include: { county: true; city: true } };
    leadRequests: { take: 5; orderBy: { createdAt: "desc" } };
  };
}>;

export type LeadRequestDetail = Prisma.LeadRequestGetPayload<{
  include: {
    company: true;
    selections: { include: { company: true } };
    county: true;
    city: true;
    service: true;
    images: true;
    notes: { include: { adminUser: true } };
    events: true;
  };
}>;

export type HomepageData = {
  featuredCompanies: CompanyCardData[];
  counties: CountyWithStats[];
  services: ServiceWithStats[];
  articles: ArticleCardData[];
  stats: {
    companies: number;
    leads: number;
    counties: number;
    cities: number;
    services: number;
  };
};

export type QuickSearchOptions = {
  counties: Array<{ id: string; name: string; slug: string }>;
  cities: Array<{ id: string; name: string; slug: string; countyId: string }>;
  services: Array<{ id: string; name: string; slug: string }>;
};

export type AdminDashboardData = {
  stats: {
    companies: number;
    activeCompanies: number;
    leads: number;
    articles: number;
    counties: number;
  };
  latestLeads: LeadRequestDetail[];
  recentImports: Prisma.CompanyImportRunGetPayload<{ include: { county: true; city: true } }>[];
};
