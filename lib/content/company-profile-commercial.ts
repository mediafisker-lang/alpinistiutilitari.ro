import type { FaqItem } from "@/lib/content/local-seo";
import type { CompanyDetail } from "@/lib/data/types";
import { isPriorityLandingPath } from "@/lib/content/local-commercial";

type LinkItem = {
  href: string;
  label: string;
};

export type CompanyProfileCommercialContent = {
  metaTitle: string;
  metaDescription: string;
  shouldIndex: boolean;
  lead: string;
  longDescription: string;
  serviceHighlights: string[];
  buildingTypes: string[];
  coveredZones: string[];
  trustSignals: string[];
  faq: FaqItem[];
  localLinks: LinkItem[];
};

const priorityCountySlugs = new Set(["bucuresti", "ilfov"]);

const priorityServiceSlugs = [
  "alpinism-utilitar",
  "spalare-geamuri-la-inaltime",
  "montaj-bannere",
  "reparatii-fatade",
  "interventii-urgente-la-inaltime",
  "taiere-copaci",
];

const serviceBuildingMap: Record<string, string[]> = {
  "alpinism-utilitar": [
    "cladiri de birouri",
    "ansambluri rezidentiale",
    "hale si structuri tehnice",
  ],
  "spalare-geamuri-la-inaltime": [
    "cladiri cu pereti cortina",
    "showroom-uri si retail",
    "blocuri si hoteluri",
  ],
  "montaj-bannere": [
    "fatade comerciale",
    "santiere si mesh publicitar",
    "spatii retail cu trafic mare",
  ],
  "reparatii-fatade": [
    "blocuri vechi si noi",
    "sedii office",
    "imobile administrative",
  ],
  "interventii-urgente-la-inaltime": [
    "cladiri cu risc punctual",
    "acoperisuri si fatade active",
    "zone urbane cu trafic",
  ],
  "taiere-copaci": [
    "curti rezidentiale",
    "parcari si alei comerciale",
    "zone de proximitate pentru cabluri",
  ],
};

const countyHotspots: Record<string, string[]> = {
  bucuresti: [
    "Sector 1",
    "Sector 2",
    "Sector 3",
    "Sector 4",
    "Sector 5",
    "Sector 6",
    "Pipera",
    "Aviatiei",
    "Floreasca",
  ],
  ilfov: ["Voluntari", "Otopeni", "Tunari", "Chiajna", "Popesti-Leordeni", "Buftea"],
};

function dedupe(items: string[]) {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of items) {
    const key = value.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(value.trim());
  }

  return output;
}

function hashText(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickVariant(slug: string, options: string[]) {
  if (!options.length) return "";
  return options[hashText(slug) % options.length]!;
}

function buildCoverageZones(company: CompanyDetail) {
  const baseZones = [
    company.city.name,
    company.county.name,
    ...company.coverage.map((coverage) => coverage.city?.name ?? coverage.county?.name ?? ""),
  ];
  const hotspots = countyHotspots[company.county.slug] ?? [];

  return dedupe([...baseZones, ...hotspots]).slice(0, 10);
}

function buildServiceHighlights(company: CompanyDetail) {
  const topServices = [
    ...company.services
      .map((item) => item.service)
      .sort((left, right) => {
        const leftPriority = priorityServiceSlugs.indexOf(left.slug);
        const rightPriority = priorityServiceSlugs.indexOf(right.slug);
        const normalizedLeft = leftPriority === -1 ? 999 : leftPriority;
        const normalizedRight = rightPriority === -1 ? 999 : rightPriority;
        return normalizedLeft - normalizedRight;
      })
      .slice(0, 4),
  ];

  if (!topServices.length) {
    return [
      `Interventii comerciale si rezidentiale la inaltime in ${company.city.name}.`,
      "Executie cu focus pe acces dificil, siguranta si timp de raspuns bun.",
    ];
  }

  return topServices.map((service) => {
    return `${service.name} in ${company.city.name} si ${company.county.name}, cu planificare clara si ofertare structurata.`;
  });
}

function buildBuildingTypes(company: CompanyDetail) {
  const types = company.services.flatMap((item) => serviceBuildingMap[item.service.slug] ?? []);
  return dedupe(types).slice(0, 9);
}

function buildTrustSignals(company: CompanyDetail) {
  const signals: string[] = [];
  signals.push(
    company.verificationStatus === "verified"
      ? "Profil verificat in platforma"
      : "Profil activ, in proces de validare continua",
  );

  if (typeof company.ratingValue === "number") {
    signals.push(
      `Rating vizibil: ${company.ratingValue.toFixed(1)} / 5${typeof company.ratingCount === "number" ? ` (${company.ratingCount} recenzii)` : ""}`,
    );
  }

  if (company.foundedYear) {
    signals.push(`Activitate declarata din ${company.foundedYear}`);
  }

  const contactChannels = [company.phone, company.email, company.website].filter(Boolean).length;
  signals.push(
    contactChannels >= 2
      ? "Date de contact complete (telefon, email sau website)"
      : "Date de contact disponibile pentru solicitari rapide",
  );

  signals.push(
    company.coverage.length
      ? `Acoperire extinsa: ${Math.max(company.coverage.length, 1)} zone active`
      : `Acoperire concentrata pe ${company.city.name}`,
  );

  signals.push(
    company.sourceType === "claimed"
      ? "Profil revendicat si actualizat de firma"
      : company.sourceType === "google_places"
        ? "Profil sincronizat din surse externe si verificat editorial"
        : "Profil administrat intern pentru coerenta comerciala",
  );

  return signals;
}

function buildProfileLead(company: CompanyDetail, zones: string[], serviceNames: string[]) {
  const intros = [
    "Profil optimizat pentru cereri comerciale locale.",
    "Profil construit pentru cautari locale cu intentie mare de contractare.",
    "Profil local orientat pe raspuns rapid si selectie corecta de executanti.",
  ];
  const intro = pickVariant(company.slug, intros);
  const zoneSnippet = zones.slice(0, 4).join(", ");
  const serviceSnippet = serviceNames.slice(0, 3).join(", ");

  return `${intro} ${company.name} preia solicitari pentru ${serviceSnippet} in ${zoneSnippet}.`;
}

function buildProfileLongDescription(
  company: CompanyDetail,
  zones: string[],
  serviceNames: string[],
  buildingTypes: string[],
) {
  const current = (company.descriptionLong ?? "").trim();
  const serviceSnippet = serviceNames.slice(0, 4).join(", ");
  const zoneSnippet = zones.slice(0, 6).join(", ");
  const buildingSnippet = buildingTypes.slice(0, 5).join(", ");

  const generated =
    `${company.name} este prezentata ca optiune locala pentru lucrari la inaltime in ${company.city.name} si ${company.county.name}. ` +
    `Profilul pune accent pe servicii cu intentie comerciala ridicata (${serviceSnippet}), zone de acoperire reale (${zoneSnippet}) ` +
    `si tipuri de cladiri unde apar frecvent cereri (${buildingSnippet}). ` +
    "Pentru proiecte cu termen scurt sau lucrari combinate, poti trimite o singura cerere si primesti o ruta clara de ofertare.";

  if (current.length < 180) return generated;
  if (current.length < 420) return `${current}\n\n${generated}`;
  return current;
}

function buildLocalLinks(company: CompanyDetail, serviceSlugs: string[]) {
  const links: LinkItem[] = [
    { href: `/${company.county.slug}`, label: `${company.county.name} - pagina judet` },
    { href: `/${company.county.slug}/${company.city.slug}`, label: `${company.city.name} - pagina oras` },
  ];

  for (const slug of serviceSlugs.slice(0, 4)) {
    const service = company.services.find((item) => item.service.slug === slug)?.service;
    if (!service) continue;

    if (isPriorityLandingPath(company.county.slug, service.slug)) {
      links.push({
        href: `/${company.county.slug}/${service.slug}`,
        label: `${service.name} ${company.county.name}`,
      });
    }

    if (isPriorityLandingPath(company.city.slug, service.slug)) {
      links.push({
        href: `/${company.city.slug}/${service.slug}`,
        label: `${service.name} ${company.city.name}`,
      });
    }
  }

  if (company.county.slug === "bucuresti") {
    links.push(
      { href: "/sector-1/spalare-geamuri-la-inaltime", label: "Spalare geamuri Sector 1" },
      { href: "/sector-2/spalare-geamuri-la-inaltime", label: "Spalare geamuri Sector 2" },
      { href: "/sector-6/spalare-geamuri-la-inaltime", label: "Spalare geamuri Sector 6" },
    );
  }

  if (company.county.slug === "ilfov") {
    links.push(
      { href: "/voluntari/spalare-geamuri-la-inaltime", label: "Spalare geamuri Voluntari" },
      { href: "/otopeni/spalare-geamuri-la-inaltime", label: "Spalare geamuri Otopeni" },
      { href: "/chiajna/spalare-geamuri-la-inaltime", label: "Spalare geamuri Chiajna" },
    );
  }

  const uniqueLinks: LinkItem[] = [];
  const seen = new Set<string>();
  for (const link of links) {
    const key = `${link.href}::${link.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueLinks.push(link);
  }

  return uniqueLinks.slice(0, 12);
}

function buildFaq(company: CompanyDetail, zones: string[], serviceNames: string[], buildingTypes: string[]) {
  return [
    {
      question: `Ce lucrari preia ${company.name} in ${company.city.name}?`,
      answer: `${company.name} preia in principal ${serviceNames.slice(0, 4).join(", ")} in ${company.city.name} si localitatile apropiate.`,
    },
    {
      question: "Ce tipuri de cladiri sunt deservite?",
      answer: `Interventiile vizeaza frecvent ${buildingTypes.slice(0, 5).join(", ")}.`,
    },
    {
      question: "Lucreaza si in zonele din jur?",
      answer: `Da, profilul include acoperire in ${zones.slice(0, 6).join(", ")} in functie de complexitatea lucrarii.`,
    },
    {
      question: "Pot cere oferta pentru mai multe servicii in acelasi proiect?",
      answer:
        "Da. Poti descrie mai multe lucrari in acelasi formular, iar solicitarea este structurata intern pentru selectie comerciala corecta.",
    },
    {
      question: "Cat dureaza raspunsul la cerere?",
      answer:
        "Raspunsul initial este de obicei rapid dupa validarea interna a cererii, mai ales daca ai inclus poze, zona si nivelul de urgenta.",
    },
  ];
}

export function buildCompanyProfileCommercialContent(company: CompanyDetail): CompanyProfileCommercialContent {
  const serviceNames = company.services.map((item) => item.service.name);
  const serviceSlugs = company.services.map((item) => item.service.slug);
  const zones = buildCoverageZones(company);
  const buildingTypes = buildBuildingTypes(company);
  const serviceHighlights = buildServiceHighlights(company);
  const trustSignals = buildTrustSignals(company);
  const lead = buildProfileLead(company, zones, serviceNames);
  const longDescription = buildProfileLongDescription(company, zones, serviceNames, buildingTypes);

  const indexSignals = [
    company.services.length >= 2,
    longDescription.length >= 220,
    Boolean(company.phone || company.email || company.website),
    zones.length >= 3,
  ].filter(Boolean).length;
  const shouldIndex = priorityCountySlugs.has(company.county.slug) || indexSignals >= 3;

  const primaryServiceName = serviceNames[0] ?? "Alpinism utilitar";
  const metaTitle = `${company.name} | ${primaryServiceName} in ${company.city.name}, ${company.county.name}`;
  const metaDescription =
    `${company.name} - profil local pentru ${serviceNames.slice(0, 3).join(", ").toLowerCase()}. ` +
    `Zone acoperite: ${zones.slice(0, 4).join(", ")}. Cere oferta pentru ${company.city.name} si ${company.county.name}.`;

  return {
    metaTitle,
    metaDescription,
    shouldIndex,
    lead,
    longDescription,
    serviceHighlights,
    buildingTypes,
    coveredZones: zones,
    trustSignals,
    faq: buildFaq(company, zones, serviceNames, buildingTypes),
    localLinks: buildLocalLinks(company, serviceSlugs),
  };
}
