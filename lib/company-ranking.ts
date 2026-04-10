type RankedService = {
  service?: {
    id?: string | null;
    name?: string | null;
    slug?: string | null;
    category?: string | null;
    shortName?: string | null;
  } | null;
};

type RankedLocation = {
  id?: string | null;
  slug?: string | null;
  name?: string | null;
};

type RankedCoverage = {
  countyId?: string | null;
  cityId?: string | null;
  county?: RankedLocation | null;
  city?: RankedLocation | null;
};

type RankedCompany = {
  id: string;
  name: string;
  slug?: string | null;
  descriptionShort?: string | null;
  descriptionLong?: string | null;
  sourceType?: string | null;
  isFeatured?: boolean | null;
  isVerified?: boolean | null;
  ratingValue?: number | null;
  ratingCount?: number | null;
  website?: string | null;
  phone?: string | null;
  countyId?: string | null;
  cityId?: string | null;
  county?: RankedLocation | null;
  city?: RankedLocation | null;
  coverage?: RankedCoverage[] | null;
  services?: RankedService[] | null;
};

type RankedServiceTarget = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  category?: string | null;
  shortName?: string | null;
};

const strongPositiveKeywords = [
  "alpin",
  "alpinism",
  "utilitar",
  "fatade",
  "fatada",
  "geamuri",
  "geam",
  "acoperis",
  "banner",
  "mesh",
  "publicitar",
  "publicitara",
  "arbor",
  "copac",
  "jgheab",
  "inaltime",
  "interventii",
  "etansari",
  "reparatii",
  "decopertari",
  "decopertare",
  "siguranta fatade",
  "fatade degradate",
  "desprinderi tencuiala",
  "anten",
  "plase",
  "vopsitorii",
];

const weakPositiveKeywords = [
  "curatare",
  "montaj",
  "curatenie",
  "construct",
  "vertical",
  "alp",
  "publicitate",
  "arboristica",
];

const negativeKeywords = [
  "restaurant",
  "lounge",
  "bar",
  "bistro",
  "cafenea",
  "cafe",
  "hotel",
  "pensiune",
  "resort",
  "club",
  "pizza",
  "burger",
  "salon",
  "clinica",
  "farmacie",
  "apartament",
  "hostel",
  "agentie",
  "agencie",
  "print",
  "tipografie",
  "productie publicitara",
  "productie publicitate",
  "inscriptionari",
  "colantari",
  "decoratiuni",
  "cadouri",
  "termopane",
  "tamplarie",
  "transport",
  "service auto",
  "auto",
  "adventure",
  "escalada",
  "climbing",
  "paintball",
  "airsoft",
  "aquapark",
  "recycling",
  "solar",
  "fotovoltaic",
  "curatenie",
  "cleaning",
  "spalatorie",
  "curatatorie",
  "covoare",
  "detailing",
  "haine",
  "spalatorie covoare",
  "curatatorie haine",
  "laundry",
  "detailing auto",
  "spalatorie auto",
  "car wash",
  "vulcanizare",
  "tractari",
  "rent a car",
];

const strictIdentityKeywords = [
  "alpinism utilitar",
  "alpin utilitar",
  "alpinisti utilitari",
  "alpinist utilitar",
  "alpinism industrial",
  "rope access",
  "rope acces",
  "irata",
  "abseil",
  "acces pe coarda",
  "vertical access",
  "vertical acces",
  "alpin",
  "utilitar",
];

const directPortfolioKeywords = [
  "alpinism utilitar",
  "alpin utilitar",
  "alpinisti utilitari",
  "lucrari la inaltime",
  "interventii la inaltime",
  "geamuri la inaltime",
  "spalare geamuri",
  "spalare fatade",
  "curatare fatade",
  "reparatii fatade",
  "decopertari tencuiala",
  "punere in siguranta fatade",
  "reparatii acoperis",
  "curatare jgheaburi",
  "montaj bannere",
  "montaj mesh",
  "vopsitorii la inaltime",
  "toaletare copaci",
  "taiere copaci",
  "arborist",
  "doborare controlata",
  "paratrasnet",
  "montaj antene",
  "piloni",
  "catarge",
  "turnuri",
  "cosuri industriale",
  "taluzuri",
  "stanci",
];

const altitudeContextKeywords = [
  "alpin",
  "alpinism",
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
  "turnuri",
  "cosuri",
  "taluzuri",
  "stanci",
];

const genericOnlyKeywords = [
  "constructii",
  "amenajari",
  "reclame",
  "publicitate",
  "curatenie",
  "special works",
  "lucrari speciale",
  "fatade ventilate",
  "termoizolatii",
];

const corePortfolioServiceSlugs = new Set([
  "alpinism-utilitar",
  "spalare-geamuri-la-inaltime",
  "spalare-fatade",
  "reparatii-fatade",
  "reparatii-acoperisuri",
  "curatare-jgheaburi",
  "vopsitorii-la-inaltime",
  "montaj-antene",
  "interventii-urgente-la-inaltime",
  "taiere-copaci",
  "toaletare-copaci",
  "indepartare-tencuiala-degradata",
  "decopertari-tencuiala",
  "punere-in-siguranta-fatade",
  "etansari-si-infiltratii",
  "montaj-plase-protectie",
]);

const serviceKeywordCatalog: Record<
  string,
  { strong: string[]; weak?: string[]; negative?: string[] }
> = {
  "alpinism-utilitar": {
    strong: [
      "alpinism utilitar",
      "alpin utilitar",
      "lucrari la inaltime",
      "interventii la inaltime",
      "rope access",
      "irata",
    ],
    weak: ["fatade", "acoperisuri", "alpinisti utilitari"],
  },
  "spalare-geamuri-la-inaltime": {
    strong: [
      "spalare geamuri",
      "geamuri la inaltime",
      "geamuri",
      "fatade vitrate",
      "pereti cortina",
    ],
    weak: ["curatare geamuri", "vitrine", "alpin utilitar"],
  },
  "spalare-fatade": {
    strong: ["spalare fatade", "curatare fatade", "fatade", "fatada"],
    weak: ["exterior cladiri", "depuneri", "spalare cladiri"],
  },
  "reparatii-fatade": {
    strong: ["reparatii fatade", "fatade", "fatada", "fisuri", "tencuiala"],
    weak: ["etansare", "reparatii exterioare", "refacere fatada"],
  },
  "reparatii-acoperisuri": {
    strong: ["reparatii acoperis", "acoperisuri", "acoperis", "tigla", "invelitoare"],
    weak: ["burlane", "jgheaburi", "hidroizolatii"],
  },
  "montaj-bannere": {
    strong: ["montaj bannere", "banner", "bannere", "mesh", "publicitar"],
    weak: ["reclame", "casete luminoase", "panouri publicitare"],
  },
  "montaj-mesh": {
    strong: ["mesh", "montaj mesh", "banner", "publicitar"],
    weak: ["mash", "reclame", "panouri"],
  },
  "montaj-litere-volumetrice": {
    strong: ["litere volumetrice", "firme luminoase", "reclame luminoase"],
    weak: ["casete", "publicitar", "totem"],
  },
  "curatare-jgheaburi": {
    strong: ["jgheaburi", "curatare jgheaburi", "burlane"],
    weak: ["acoperis", "decolmatare", "desfundare"],
  },
  "montaj-plase-protectie": {
    strong: ["plase protectie", "plase de protectie", "plase anti", "protectie"],
    weak: ["taluzuri", "versanti", "stanci"],
  },
  "vopsitorii-la-inaltime": {
    strong: ["vopsitorii", "vopsire fatade", "zugraveli", "vopsire"],
    weak: ["fatade", "finisaje exterioare"],
  },
  "montaj-antene": {
    strong: ["antene", "montaj antene", "telecomunicatii", "piloni", "catarge"],
    weak: ["cablu", "paratrasnet", "echipamente tehnice"],
  },
  "interventii-urgente-la-inaltime": {
    strong: ["interventii urgente", "urgente", "interventii la inaltime", "interventii"],
    weak: ["rapid", "24/7", "avarie"],
  },
  "taiere-copaci": {
    strong: ["taiere copaci", "copaci", "arbori", "doborare", "toaletare"],
    weak: ["arborist", "defrisare", "vegetatie"],
    negative: ["mobila", "atelier"],
  },
  "toaletare-copaci": {
    strong: ["toaletare copaci", "toaletare arbori", "copaci", "arbori"],
    weak: ["arborist", "vegetatie", "crengi"],
  },
  "indepartare-tencuiala-degradata": {
    strong: ["tencuiala degradata", "tencuiala", "fatade", "desprinderi"],
    weak: ["fatada", "reparatii", "consolidare"],
  },
  "etansari-si-infiltratii": {
    strong: ["etansari", "infiltratii", "rosturi", "fisuri"],
    weak: ["hidroizolatii", "fatade", "terase"],
  },
  "decopertari-tencuiala": {
    strong: ["decopertari tencuiala", "tencuiala desprinsa", "fatade degradate", "desprinderi"],
    weak: ["punere in siguranta", "fatade", "interventie urgenta"],
  },
  "punere-in-siguranta-fatade": {
    strong: ["punere in siguranta fatade", "fatade periculoase", "elemente instabile", "fatade degradate"],
    weak: ["decopertari", "interventii urgente", "protejare perimetru"],
  },
};

function normalize(value?: string | null) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function countMatches(text: string, keywords: string[]) {
  return keywords.reduce((total, keyword) => total + (text.includes(keyword) ? 1 : 0), 0);
}

function isUnverifiedGooglePlace(company: RankedCompany) {
  return company.sourceType === "google_places" && !company.isVerified;
}

function buildCompanyIdentityText(company: RankedCompany) {
  return normalize(
    [
      company.name,
      company.slug,
      company.website,
      ...(company.services ?? []).flatMap((item) =>
        item.service
          ? [item.service.name, item.service.slug, item.service.category, item.service.shortName]
          : [],
      ),
    ].join(" "),
  );
}

function buildCompanyBrandText(company: RankedCompany) {
  return normalize([company.name, company.slug, company.website].filter(Boolean).join(" "));
}

function buildCompanyPortfolioText(company: RankedCompany) {
  if (isUnverifiedGooglePlace(company)) {
    // Avoid self-reinforcing inferred service/description signals for raw imports.
    return buildCompanyBrandText(company);
  }

  return buildCompanyIdentityText(company);
}

function buildCompanyText(company: RankedCompany) {
  return normalize(
    [
      buildCompanyIdentityText(company),
      company.descriptionShort,
      company.descriptionLong,
    ].join(" "),
  );
}

function buildServiceText(service?: RankedServiceTarget | null) {
  return normalize(
    [service?.name, service?.slug, service?.category, service?.shortName]
      .filter(Boolean)
      .join(" "),
  );
}

function getDynamicServiceKeywords(service?: RankedServiceTarget | null) {
  const serviceText = buildServiceText(service);
  if (!serviceText) {
    return { strong: [] as string[], weak: [] as string[], negative: [] as string[] };
  }

  const tokens = serviceText
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length >= 4 && !["pentru", "servicii", "inaltime"].includes(token));

  return {
    strong: [...new Set(tokens)],
    weak: ["alpin", "alpinism", "utilitar", "inaltime"],
    negative: [],
  };
}

function getServiceKeywordSet(service?: RankedServiceTarget | null) {
  const slug = service?.slug ?? "";
  const catalogEntry = slug ? serviceKeywordCatalog[slug] : undefined;
  const dynamicEntry = getDynamicServiceKeywords(service);

  return {
    strong: [...new Set([...(catalogEntry?.strong ?? []), ...dynamicEntry.strong])],
    weak: [...new Set([...(catalogEntry?.weak ?? []), ...dynamicEntry.weak])],
    negative: [...new Set([...(catalogEntry?.negative ?? []), ...dynamicEntry.negative])],
  };
}

export function getCompanySeoScore(company: RankedCompany) {
  const text = buildCompanyText(company);

  let score = 0;

  score += countMatches(text, strongPositiveKeywords) * 24;
  score += countMatches(text, weakPositiveKeywords) * 8;
  score -= countMatches(text, negativeKeywords) * 40;

  if (company.isFeatured) score += 40;
  if (company.isVerified) score += 35;
  if (company.sourceType === "manual") score += 25;
  if (company.sourceType === "google_places") score += 8;
  if (company.website) score += 6;
  if (company.phone) score += 6;

  const serviceCount = company.services?.length ?? 0;
  score += Math.min(serviceCount, 6) * 6;

  if (typeof company.ratingValue === "number") {
    score += Math.round(company.ratingValue * 2);
  }
  if (typeof company.ratingCount === "number") {
    score += Math.min(company.ratingCount, 50);
  }

  return score;
}

export function getCompanyServiceMatchScore(company: RankedCompany, service?: RankedServiceTarget | null) {
  if (!service) return 0;

  const text = buildCompanyPortfolioText(company);

  const serviceKeywords = getServiceKeywordSet(service);
  const hasExplicitServiceMatch = (company.services ?? []).some(
    (item) =>
      item.service?.id === service.id ||
      (item.service?.slug && service.slug && item.service.slug === service.slug),
  );

  let score = 0;
  if (hasExplicitServiceMatch) score += 180;

  score += countMatches(text, serviceKeywords.strong) * 28;
  score += countMatches(text, serviceKeywords.weak) * 10;
  score -= countMatches(text, serviceKeywords.negative) * 45;

  if (typeof company.ratingValue === "number") {
    score += Math.round(company.ratingValue * 4);
  }

  if (typeof company.ratingCount === "number") {
    score += Math.min(company.ratingCount, 30);
  }

  return score;
}

export function getUtilityPortfolioScore(company: RankedCompany) {
  const text = buildCompanyPortfolioText(company);
  const brandText = buildCompanyBrandText(company);
  const serviceSlugs = new Set(
    (company.services ?? []).flatMap((item) => (item.service?.slug ? [item.service.slug] : [])),
  );

  let score = 0;
  score += countMatches(text, directPortfolioKeywords) * 55;
  score += countMatches(text, altitudeContextKeywords) * 16;
  score += countMatches(brandText, strictIdentityKeywords) * 72;
  score -= countMatches(text, negativeKeywords) * 40;
  score -= countMatches(text, genericOnlyKeywords) * 10;

  if ([...serviceSlugs].some((slug) => corePortfolioServiceSlugs.has(slug))) score += 42;
  if (typeof company.ratingValue === "number") score += Math.round(company.ratingValue * 4);
  if (typeof company.ratingCount === "number") score += Math.min(company.ratingCount, 25);
  if (company.isVerified) score += 18;
  if (company.website) score += 6;

  return score;
}

export function hasUtilityPortfolio(company: RankedCompany) {
  const text = buildCompanyPortfolioText(company);
  const brandText = buildCompanyBrandText(company);
  const identityMatches = countMatches(brandText, strictIdentityKeywords);
  const brandDirectMatches = countMatches(brandText, directPortfolioKeywords);
  const brandAltitudeMatches = countMatches(brandText, altitudeContextKeywords);
  const directMatches = countMatches(text, directPortfolioKeywords);
  const altitudeMatches = countMatches(text, altitudeContextKeywords);
  const negativeMatches = countMatches(text, negativeKeywords);
  const genericMatches = countMatches(text, genericOnlyKeywords);
  const portfolioScore = getUtilityPortfolioScore(company);
  const serviceSlugs = new Set(
    (company.services ?? []).flatMap((item) => (item.service?.slug ? [item.service.slug] : [])),
  );
  const hasCoreService = [...serviceSlugs].some((slug) => corePortfolioServiceSlugs.has(slug));

  if ((company.ratingValue ?? 0) < 4) return false;

  if (isUnverifiedGooglePlace(company)) {
    if (negativeMatches >= 1 && brandDirectMatches === 0) return false;
    if (negativeMatches >= 2) return false;
    if (identityMatches >= 1 && portfolioScore >= 56) return true;
    if (brandDirectMatches >= 1 && negativeMatches === 0 && portfolioScore >= 56) return true;
    if (hasCoreService && brandAltitudeMatches >= 1 && negativeMatches === 0 && portfolioScore >= 64) return true;
    if (hasCoreService && negativeMatches === 0 && (company.ratingCount ?? 0) >= 20 && portfolioScore >= 72)
      return true;
    if (hasCoreService && negativeMatches === 0 && portfolioScore >= 88) return true;
    return false;
  }

  if (negativeMatches >= 1 && identityMatches === 0 && directMatches <= 1) return false;
  if (negativeMatches >= 2) return false;
  if (identityMatches >= 1 && directMatches >= 1 && portfolioScore >= 72) return true;
  if (identityMatches >= 1 && hasCoreService && altitudeMatches >= 1 && portfolioScore >= 64) return true;
  if (hasCoreService && directMatches >= 2 && altitudeMatches >= 2 && genericMatches <= 2 && portfolioScore >= 76)
    return true;
  if (directMatches >= 2 && altitudeMatches >= 3 && genericMatches <= 2 && portfolioScore >= 88) return true;
  if (directMatches >= 1 && hasCoreService && negativeMatches === 0 && portfolioScore >= 98) return true;

  return false;
}

export function filterCompaniesWithUtilityPortfolio<T extends RankedCompany>(companies: T[]) {
  return companies.filter(hasUtilityPortfolio);
}

export function sortCompaniesForService<T extends RankedCompany>(companies: T[], service?: RankedServiceTarget | null) {
  return [...companies].sort((left, right) => {
    const serviceDelta = getCompanyServiceMatchScore(right, service) - getCompanyServiceMatchScore(left, service);
    if (serviceDelta !== 0) return serviceDelta;

    const seoDelta = getCompanySeoScore(right) - getCompanySeoScore(left);
    if (seoDelta !== 0) return seoDelta;

    return left.name.localeCompare(right.name, "ro");
  });
}

export function sortCompaniesForSeo<T extends RankedCompany>(companies: T[]) {
  return [...companies].sort((left, right) => {
    const scoreDelta = getCompanySeoScore(right) - getCompanySeoScore(left);
    if (scoreDelta !== 0) return scoreDelta;

    const ratingCountDelta = (right.ratingCount ?? 0) - (left.ratingCount ?? 0);
    if (ratingCountDelta !== 0) return ratingCountDelta;

    const ratingDelta = (right.ratingValue ?? 0) - (left.ratingValue ?? 0);
    if (ratingDelta !== 0) return ratingDelta;

    return left.name.localeCompare(right.name, "ro");
  });
}

export function getPrimaryCompanies<T extends RankedCompany>(companies: T[], limit = 10) {
  const ranked = sortCompaniesForSeo(companies);
  return ranked.slice(0, Math.min(limit, ranked.length));
}
