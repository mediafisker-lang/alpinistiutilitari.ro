type LocalArticleSeed = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  coverImageUrl: string;
  serviceSlug: string;
};

const localArticleInputs = [
  {
    county: "Bucuresti",
    serviceName: "spalare geamuri la inaltime",
    serviceSlug: "spalare-geamuri-la-inaltime",
    slug: "pret-spalare-geamuri-la-inaltime-bucuresti",
  },
  {
    county: "Cluj",
    serviceName: "reparatii fatade",
    serviceSlug: "reparatii-fatade",
    slug: "reparatii-fatade-cluj-ghid-local",
  },
  {
    county: "Brasov",
    serviceName: "alpinism utilitar pentru hoteluri si pensiuni",
    serviceSlug: "spalare-fatade",
    slug: "alpinism-utilitar-brasov-pentru-cladiri-turistice",
  },
  {
    county: "Constanta",
    serviceName: "montaj bannere si mesh",
    serviceSlug: "montaj-bannere",
    slug: "montaj-bannere-constanta-ghid-local",
  },
  {
    county: "Iasi",
    serviceName: "taiere copaci",
    serviceSlug: "taiere-copaci",
    slug: "cand-ai-nevoie-de-taiere-copaci-in-iasi",
  },
  {
    county: "Timis",
    serviceName: "interventii urgente la inaltime",
    serviceSlug: "interventii-urgente-la-inaltime",
    slug: "interventii-urgente-la-inaltime-timis",
  },
  {
    county: "Prahova",
    serviceName: "reparatii acoperisuri",
    serviceSlug: "reparatii-acoperisuri",
    slug: "reparatii-acoperisuri-prahova-ghid-de-cautare",
  },
  {
    county: "Ilfov",
    serviceName: "toaletare copaci",
    serviceSlug: "toaletare-copaci",
    slug: "toaletare-copaci-ilfov-cum-alegi-firma",
  },
  {
    county: "Sibiu",
    serviceName: "curatare jgheaburi",
    serviceSlug: "curatare-jgheaburi",
    slug: "curatare-jgheaburi-sibiu-ghid-practic",
  },
  {
    county: "Galati",
    serviceName: "etansari si infiltratii",
    serviceSlug: "etansari-si-infiltratii",
    slug: "etansari-si-infiltratii-galati-ghid-local",
  },
  {
    county: "Mures",
    serviceName: "vopsitorii la inaltime",
    serviceSlug: "vopsitorii-la-inaltime",
    slug: "vopsitorii-la-inaltime-mures-cand-merita",
  },
  {
    county: "Bihor",
    serviceName: "montaj antene",
    serviceSlug: "montaj-antene",
    slug: "montaj-antene-bihor-lucrari-la-inaltime",
  },
];

export const localSeoArticleSeeds: LocalArticleSeed[] = localArticleInputs.map((item) => {
  const title = `${item.serviceName} in ${item.county}: ghid local, costuri orientative si alegerea firmei`;
  const excerpt = `Ghid local pentru ${item.serviceName} in ${item.county}: când ai nevoie de intervenție, ce detalii trimiți în cererea de ofertă și cum filtrezi firmele potrivite.`;
  const seoTitle = `${item.serviceName} in ${item.county} - ghid local si cerere rapida de oferta`;
  const seoDescription = `Afla cum alegi rapid o firmă pentru ${item.serviceName} în ${item.county}, ce informații trimiți în cerere și la ce să fii atent înainte de ofertare.`;
  const coverImageUrl = `/blog-covers/${item.slug}`;

  const content = [
    `${item.serviceName} în ${item.county} este o căutare comercială reală atunci când lucrarea trebuie rezolvată rapid și clientul vrea firme care pot interveni local, nu doar rezultate generale din alt județ.`,
    `În practică, pagina locală pentru ${item.serviceName} în ${item.county} trebuie să răspundă simplu la trei întrebări: cine lucrează în zonă, ce tip de intervenții fac aceste firme și ce informații trebuie să primească pentru a răspunde repede.`,
    "## Ce caută de obicei clientul",
    `- firme care pot interveni în ${item.county} fără întârzieri mari`,
    `- echipe care au experiență clară pentru ${item.serviceName}`,
    "- o cerere unică, simplă, fără apeluri repetate către mai multe firme",
    "## Ce merită să trimiți în cerere",
    "- localitatea sau zona aproximativă",
    "- poze clare din exterior",
    "- înălțimea aproximativă și accesul disponibil",
    "- dacă lucrarea este urgentă sau poate fi programată",
    "## Cum filtrezi firmele potrivite",
    `Pe platformă, merită să verifici firmele care au sediu în ${item.county}, firmele care acoperă zona și firmele care au servicii corelate direct cu ${item.serviceName}. Asta reduce mult rezultatele vagi și te apropie de oferte relevante.`,
    "## Întrebare frecventă",
    `De ce este utilă o pagină locală pentru ${item.serviceName} în ${item.county}? Pentru că intenția de căutare este locală și comercială: utilizatorul vrea executanți din apropiere, nu definiții generale sau pagini fără firme reale.`,
    "## Concluzie",
    `Dacă ai nevoie de ${item.serviceName} în ${item.county}, cel mai eficient este să trimiți o cerere clară, cu detalii și poze. Astfel ajungi mai repede la firmele locale sau regionale care pot da o ofertă potrivită pentru lucrarea ta.`,
  ].join("\n\n");

  return {
    title,
    slug: item.slug,
    excerpt,
    content,
    seoTitle,
    seoDescription,
    coverImageUrl,
    serviceSlug: item.serviceSlug,
  };
});
