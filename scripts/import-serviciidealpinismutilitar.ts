import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";
import { slugify } from "../lib/utils";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

const SOURCE_BASE = "https://serviciidealpinismutilitar.ro";
const SOURCE_HOST = new URL(SOURCE_BASE).host;
const NON_COMPANY_EXTERNAL_DOMAINS = new Set([
  "gmpg.org",
  "schema.org",
  "api.w.org",
  "w3.org",
  "s.w.org",
  "googletagmanager.com",
  "gravatar.com",
  "facebook.com",
  "instagram.com",
  "youtube.com",
]);
const BLOCKED_INTERNAL_PATH_PREFIXES = [
  "/judet",
  "/judete",
  "/servicii",
  "/blog",
  "/contact",
  "/author",
  "/shop-default-page",
  "/wp-",
];
const BLOCKED_INTERNAL_PATHS = new Set([
  "/",
  "/feed/",
  "/comments/feed/",
  "/xmlrpc.php",
  "/judete/",
  "/judete-romania/",
  "/servicii/",
  "/blog/",
  "/contact/",
]);

type SourceCompany = {
  sourcePageUrl: string;
  companyPageUrl: string;
  name: string;
  description: string;
  phone?: string;
  email?: string;
  website?: string;
};

type RegionItem = {
  id: string;
  title: string;
  status: string;
  link: string;
};

function decodeHtml(value: string) {
  return value
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ");
}

function normalizePhone(raw?: string | null) {
  if (!raw) return undefined;
  const decoded = decodeURIComponent(raw).replace(/\s+/g, " ").trim();
  const hasPlus = decoded.startsWith("+");
  const digits = decoded.replace(/\D+/g, "");
  if (!digits) return undefined;

  if (hasPlus && digits.startsWith("40")) {
    return `+${digits}`;
  }
  if (digits.startsWith("40")) {
    return `+${digits}`;
  }
  if (digits.length === 10 && digits.startsWith("0")) {
    return `+40${digits.slice(1)}`;
  }
  return digits.length >= 9 ? digits : undefined;
}

function normalizeEmail(raw?: string | null) {
  if (!raw) return undefined;
  const decoded = decodeURIComponent(raw).trim().toLowerCase();
  return decoded || undefined;
}

function normalizeWebsite(raw?: string | null) {
  if (!raw) return undefined;
  try {
    const parsed = new URL(raw);
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/+$/, "/");
  } catch {
    return undefined;
  }
}

function extractMetaDescription(html: string) {
  const meta = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1];
  return meta ? decodeHtml(meta).trim() : "";
}

function extractTitle(html: string) {
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  return title ? decodeHtml(title).trim() : "";
}

function extractTextContent(html: string) {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  const text = withoutScripts
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return decodeHtml(text);
}

function chooseNameFromTitle(title: string) {
  const cleaned = title.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const [left] = cleaned.split(" - Servicii de alpinism utilitar");
  return left.trim();
}

function getDomainFromUrl(value?: string) {
  if (!value) return "";
  try {
    const host = new URL(value).host.toLowerCase();
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return "";
  }
}

async function fetchText(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

async function fetchRegions() {
  const response = await fetch(`${SOURCE_BASE}/wp-json/mapsvg/v1/regions/regions_2?perpage=1000`);
  if (!response.ok) {
    throw new Error(`Nu pot citi regiunile din sursa: HTTP ${response.status}`);
  }
  const payload = (await response.json()) as { items: RegionItem[] };
  return payload.items ?? [];
}

function extractCompanyLinksFromCountyHtml(html: string) {
  const links = [...html.matchAll(/href="([^"]+)"/gi)]
    .map((match) => match[1])
    .map((raw) => decodeHtml(raw))
    .map((raw) => {
      try {
        const url = new URL(raw, SOURCE_BASE);
        url.hash = "";
        return url;
      } catch {
        return null;
      }
    })
    .filter((item): item is URL => Boolean(item));

  return links.filter((url) => {
    if (url.host !== SOURCE_HOST) return false;
    if (BLOCKED_INTERNAL_PATHS.has(url.pathname)) return false;
    if (BLOCKED_INTERNAL_PATH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return false;
    if (url.pathname.length <= 2) return false;
    if (url.search) return false;
    return true;
  });
}

async function discoverSourceCompanies() {
  const regions = await fetchRegions();
  const countyPages = regions
    .map((region) => region.link)
    .filter((url) => {
      try {
        return new URL(url).host === SOURCE_HOST;
      } catch {
        return false;
      }
    });

  const candidateMap = new Map<string, { companyPageUrl: string; sourcePageUrl: string }>();
  for (const countyPageUrl of countyPages) {
    try {
      const html = await fetchText(countyPageUrl);
      const links = extractCompanyLinksFromCountyHtml(html);
      for (const link of links) {
        const companyPageUrl = link.toString();
        if (!candidateMap.has(companyPageUrl)) {
          candidateMap.set(companyPageUrl, { companyPageUrl, sourcePageUrl: countyPageUrl });
        }
      }
    } catch (error) {
      console.warn(`Nu pot procesa pagina de județ ${countyPageUrl}:`, String(error));
    }
  }

  const sourceCompanies: SourceCompany[] = [];

  for (const candidate of candidateMap.values()) {
    try {
      const html = await fetchText(candidate.companyPageUrl);
      const title = extractTitle(html);
      const name = chooseNameFromTitle(title);

      if (!name) continue;
      if (/^jude.tul/i.test(name)) continue;
      if (/^servicii de alpinism utilitar$/i.test(name)) continue;

      const telValues = [...html.matchAll(/href="tel:([^"]+)"/gi)]
        .map((match) => normalizePhone(match[1]))
        .filter((value): value is string => Boolean(value));
      const emailValues = [...html.matchAll(/href="mailto:([^"]+)"/gi)]
        .map((match) => normalizeEmail(match[1]))
        .filter((value): value is string => Boolean(value));

      const externalWebsite = [...html.matchAll(/href="(https?:\/\/[^"]+)"/gi)]
        .map((match) => decodeHtml(match[1]))
        .map((value) => normalizeWebsite(value))
        .filter((value): value is string => Boolean(value))
        .find((value) => {
          const domain = getDomainFromUrl(value);
          if (!domain) return false;
          if (domain === SOURCE_HOST) return false;
          if (NON_COMPANY_EXTERNAL_DOMAINS.has(domain)) return false;
          return true;
        });

      const description =
        extractMetaDescription(html) ||
        extractTextContent(html).slice(0, 280) ||
        `${name} este listată în directorul serviciidealpinismutilitar.ro pentru lucrări de alpinism utilitar.`;

      sourceCompanies.push({
        sourcePageUrl: candidate.sourcePageUrl,
        companyPageUrl: candidate.companyPageUrl,
        name,
        description,
        phone: telValues[0],
        email: emailValues[0],
        website: externalWebsite,
      });
    } catch (error) {
      console.warn(`Nu pot procesa pagina companiei ${candidate.companyPageUrl}:`, String(error));
    }
  }

  const deduped = new Map<string, SourceCompany>();
  for (const item of sourceCompanies) {
    const key = item.website ? `website:${getDomainFromUrl(item.website)}` : `name:${slugify(item.name)}`;
    if (!deduped.has(key)) deduped.set(key, item);
  }

  return [...deduped.values()];
}

async function ensureUniqueSlug(baseSlug: string, existingId?: string) {
  let slug = baseSlug;
  let counter = 2;
  while (true) {
    const existing = await prisma.company.findUnique({ where: { slug } });
    if (!existing || existing.id === existingId) return slug;
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

async function findExistingCompany(item: SourceCompany) {
  const domain = getDomainFromUrl(item.website);
  if (domain) {
    const byWebsite = await prisma.company.findFirst({
      where: {
        website: { contains: domain, mode: "insensitive" },
      },
    });
    if (byWebsite) return byWebsite;
  }

  if (item.phone) {
    const tail = item.phone.replace(/\D+/g, "").slice(-9);
    if (tail.length >= 8) {
      const candidates = await prisma.company.findMany({
        where: {
          phone: { not: null },
        },
      });
      const byPhone = candidates.find((candidate) =>
        (candidate.phone ?? "").replace(/\D+/g, "").includes(tail),
      );
      if (byPhone) return byPhone;
    }
  }

  return prisma.company.findFirst({
    where: { name: { equals: item.name, mode: "insensitive" } },
  });
}

async function importCompanies(sourceCompanies: SourceCompany[]) {
  const service =
    (await prisma.service.findUnique({
      where: { slug: "alpinism-utilitar" },
    })) ??
    (await prisma.service.create({
      data: {
        name: "Alpinism utilitar",
        slug: "alpinism-utilitar",
        shortDescription:
          "Interventii profesionale la inaltime prin tehnici de acces pe coarda pentru cladiri si structuri dificile.",
        longDescription:
          "Serviciul de alpinism utilitar acopera lucrari tehnice la inaltime: inspectii, mentenanta, reparatii, montaj si interventii rapide pe cladiri sau structuri unde accesul clasic este dificil.",
        seoTitle: "Alpinism utilitar in Romania",
        seoDescription:
          "Gaseste firme de alpinism utilitar pentru lucrari la inaltime, interventii rapide si solutii profesionale cu acces pe coarda.",
        seoIntro:
          "Compara echipe specializate in alpinism utilitar si trimite rapid cererea pentru lucrari la inaltime.",
        category: "alpinism utilitar",
        shortName: "Alpinism utilitar",
        isActive: true,
      },
    }));

  const counties = await prisma.county.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  const bucuresti = counties.find((county) => county.slug === "bucuresti") ?? counties[0];
  if (!bucuresti) {
    throw new Error("Nu există județe active în baza de date.");
  }

  const fallbackCity =
    (await prisma.city.findFirst({
      where: { countyId: bucuresti.id, isActive: true, slug: "bucuresti" },
    })) ??
    (await prisma.city.findFirst({
      where: { countyId: bucuresti.id, isActive: true },
      orderBy: { name: "asc" },
    })) ??
    (await prisma.city.findFirst({
      where: { isActive: true },
      orderBy: [{ county: { name: "asc" } }, { name: "asc" }],
    }));

  if (!fallbackCity) {
    throw new Error("Nu există niciun oraș activ pentru setarea profilurilor.");
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of sourceCompanies) {
    const existing = await findExistingCompany(item);
    const baseSlug = slugify(item.name) || `firma-${Date.now()}`;
    const finalSlug = await ensureUniqueSlug(baseSlug, existing?.id);

    const payload = {
      name: item.name,
      descriptionShort: item.description.slice(0, 260),
      descriptionLong: `${item.description}\n\nSursă director: ${item.companyPageUrl}`,
      website: item.website ?? null,
      email: item.email ?? null,
      phone: item.phone ?? null,
      source: "serviciidealpinismutilitar.ro",
      sourceType: "manual" as const,
      isActive: true,
      isPublished: true,
      verificationStatus: "pending" as const,
      manuallyEditedAt: new Date(),
      countyId: existing?.countyId ?? bucuresti.id,
      cityId: existing?.cityId ?? fallbackCity.id,
    };

    const company = existing
      ? await prisma.company.update({
          where: { id: existing.id },
          data: {
            ...payload,
            slug: existing.slug || finalSlug,
          },
        })
      : await prisma.company.create({
          data: {
            ...payload,
            slug: finalSlug,
          },
        });

    if (!company) {
      skipped += 1;
      continue;
    }

    if (existing) updated += 1;
    else created += 1;

    await prisma.companyService.deleteMany({
      where: { companyId: company.id },
    });

    await prisma.companyService.create({
      data: {
        companyId: company.id,
        serviceId: service.id,
      },
    });

    const existingCoverage = await prisma.companyCoverage.findMany({
      where: { companyId: company.id },
      select: { countyId: true },
    });
    const existingCountyCoverage = new Set(
      existingCoverage
        .map((coverage) => coverage.countyId)
        .filter((countyId): countyId is string => Boolean(countyId)),
    );

    const missingCoverage = counties
      .filter((county) => !existingCountyCoverage.has(county.id))
      .map((county) => ({
        companyId: company.id,
        countyId: county.id,
        isPrimary: county.id === company.countyId,
      }));

    if (missingCoverage.length) {
      await prisma.companyCoverage.createMany({
        data: missingCoverage,
        skipDuplicates: true,
      });
    }
  }

  return { created, updated, skipped };
}

async function main() {
  const sourceCompanies = await discoverSourceCompanies();

  console.log(`Sursă: ${SOURCE_BASE}`);
  console.log(`Firme detectate pentru import: ${sourceCompanies.length}`);
  sourceCompanies.forEach((item) => {
    console.log(`- ${item.name} | ${item.website ?? "-"} | ${item.phone ?? "-"}`);
  });

  if (!sourceCompanies.length) {
    console.log("Nu am găsit firme valide în sursa indicată.");
    return;
  }

  const result = await importCompanies(sourceCompanies);
  console.log("\nImport finalizat:");
  console.log(`- create: ${result.created}`);
  console.log(`- actualizate: ${result.updated}`);
  console.log(`- omise: ${result.skipped}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
