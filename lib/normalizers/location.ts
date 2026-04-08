import { slugify } from "@/lib/utils";

function normalizeRaw(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const COUNTY_ALIASES: Record<string, string> = {
  bucuresti: "bucuresti",
  bucharest: "bucuresti",
  "municipiul bucuresti": "bucuresti",
  "judetul bucuresti": "bucuresti",
  "județul bucurești": "bucuresti",
  "1": "bucuresti",
  "2": "bucuresti",
  "3": "bucuresti",
  "4": "bucuresti",
  "5": "bucuresti",
  "6": "bucuresti",
  ilfov: "ilfov",
  "judetul ilfov": "ilfov",
  if: "ilfov",
};

const CITY_ALIASES: Record<string, string> = {
  bucuresti: "bucuresti",
  bucharest: "bucuresti",
  "municipiul bucuresti": "bucuresti",
  "sectorul 1": "bucuresti",
  "sectorul 2": "bucuresti",
  "sectorul 3": "bucuresti",
  "sectorul 4": "bucuresti",
  "sectorul 5": "bucuresti",
  "sectorul 6": "bucuresti",
  voluntari: "voluntari",
  otopeni: "otopeni",
  pantelimon: "pantelimon",
  bragadiru: "bragadiru",
  chiajna: "chiajna",
  magurele: "magurele",
  "magurele ilfov": "magurele",
  "dobroesti": "dobroiesti",
  "dobroiesti": "dobroiesti",
  "stefanestii de jos": "stefanestii-de-jos",
  "stefanestii-de-jos": "stefanestii-de-jos",
  "popesti leordeni": "popesti-leordeni",
  "popesti-leordeni": "popesti-leordeni",
  "caldararu": "caldararu",
};

export function normalizeCountySlugCandidate(value?: string | null) {
  const normalized = normalizeRaw(value);
  if (!normalized) return null;

  const stripped = normalized
    .replace(/^judetul\s+/, "")
    .replace(/^judet\s+/, "")
    .replace(/^municipiul\s+/, "")
    .trim();

  return COUNTY_ALIASES[normalized] ?? COUNTY_ALIASES[stripped] ?? slugify(stripped);
}

export function normalizeCitySlugCandidate(value?: string | null, countySlug?: string | null) {
  const normalized = normalizeRaw(value);
  if (!normalized) return null;

  const stripped = normalized
    .replace(/^orasul\s+/, "")
    .replace(/^oras\s+/, "")
    .replace(/^comuna\s+/, "")
    .replace(/^municipiul\s+/, "")
    .replace(/^municipiu\s+/, "")
    .trim();

  if (countySlug === "bucuresti" && stripped.startsWith("sectorul ")) {
    return "bucuresti";
  }

  return CITY_ALIASES[normalized] ?? CITY_ALIASES[stripped] ?? slugify(stripped);
}

export function shouldAutoCreateCity(citySlug: string, countySlug: string) {
  if (!citySlug) return false;
  if (countySlug === "bucuresti" && citySlug === "bucuresti") return true;
  if (citySlug.startsWith("sectorul-")) return false;
  if (citySlug.includes("municipiul-bucuresti")) return false;
  return true;
}

export function buildCitySeoCopy(cityName: string, countyName: string) {
  return {
    intro: `Pagina locala pentru ${cityName} si servicii de alpinism utilitar, lucrari la inaltime si interventii comerciale din ${countyName}.`,
    seoTitle: `Alpinism utilitar ${cityName}`,
    seoDescription: `Firme de alpinism utilitar din ${cityName}, ${countyName}, pentru lucrari la inaltime, fatade, geamuri si interventii rapide.`,
  };
}
