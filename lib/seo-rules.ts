export const SEO_INDEX_THRESHOLDS = {
  countyMinCompanies: 3,
  cityMinCompanies: 2,
  countyServiceMinCompanies: 4,
  cityServiceMinCompanies: 3,
} as const;

export function canIndexCountyPage(input: {
  companyCount: number;
  hasIntro?: boolean;
}) {
  return input.companyCount >= SEO_INDEX_THRESHOLDS.countyMinCompanies && Boolean(input.hasIntro);
}

export function canIndexCityPage(input: {
  companyCount: number;
  hasIntro?: boolean;
}) {
  return input.companyCount >= SEO_INDEX_THRESHOLDS.cityMinCompanies && Boolean(input.hasIntro);
}

export function canIndexCountyServicePage(companyCount: number) {
  return companyCount >= SEO_INDEX_THRESHOLDS.countyServiceMinCompanies;
}

export function canIndexCityServicePage(companyCount: number) {
  return companyCount >= SEO_INDEX_THRESHOLDS.cityServiceMinCompanies;
}
