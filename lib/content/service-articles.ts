import { serviceCatalog } from "@/lib/data/service-catalog";

type ArticleSeed = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  coverImageUrl: string;
  serviceSlug: string;
};

const openingVariants = [
  "este una dintre lucrările căutate frecvent atunci când accesul clasic cu schelă sau nacelă nu este eficient, nu este disponibil sau ar încetini mult intervenția.",
  "apare în mod obișnuit pe clădiri, fațade, acoperișuri și structuri unde timpul de reacție și accesul controlat la înălțime contează foarte mult.",
  "este solicitat mai ales în mediul urban, pentru clădiri comerciale, imobile rezidențiale și obiective tehnice unde intervenția trebuie făcută rapid și fără blocaje mari în jurul lucrării.",
];

const selectionVariants = [
  "În cererea de ofertă merită să precizezi zona exactă, tipul suprafeței, dacă există acces din interior sau doar din exterior și dacă lucrarea se poate programa în afara orelor de trafic.",
  "Pentru o estimare mai bună, ajută să menționezi înălțimea aproximativă, suprafața, obstacolele din jur, eventualele restricții de acces și dacă este nevoie de protejarea unor zone sensibile.",
  "Firmele pot răspunde mai repede când primesc poze clare, adresa aproximativă, descrierea problemei și detalii despre termenul în care vrei să fie făcută intervenția.",
];

const processVariants = [
  "În practică, intervenția începe cu evaluarea accesului, identificarea punctelor de ancorare și alegerea soluției potrivite pentru siguranță, protecția zonei și ritmul lucrării.",
  "De cele mai multe ori, lucrarea se planifică în mai mulți pași: verificare la fața locului, organizarea echipei, delimitarea zonei și execuția efectivă cu echipamente pentru lucru la înălțime.",
  "O firmă serioasă va analiza înainte condițiile din teren, fluxul pietonal sau auto din jur, riscurile de desprindere și necesarul de echipamente pentru intervenția la înălțime.",
];

const supportSections: Record<
  string,
  {
    needs: string[];
    checklist: string[];
    faqQuestion: string;
    faqAnswer: string;
  }
> = {
  "spalare-geamuri-la-inaltime": {
    needs: [
      "când geamurile exterioare nu pot fi curățate în siguranță de la interior",
      "când ai pereți cortină, suprafețe mari vitrate sau geamuri greu accesibile",
      "când imaginea clădirii influențează percepția clienților, chiriașilor sau vizitatorilor",
    ],
    checklist: [
      "numărul aproximativ de niveluri și tipul de geam sau fațadă vitrată",
      "dacă există acces în curte, pe terasă sau doar din stradă",
      "dacă lucrarea trebuie făcută dimineața, noaptea sau în afara programului",
    ],
    faqQuestion: "Cât de des merită programată spălarea geamurilor la înălțime?",
    faqAnswer:
      "Depinde de zonă, trafic și expunere la praf sau ploaie, dar clădirile comerciale și de birouri o programează frecvent periodic pentru a păstra vizibilitatea și aspectul exterior.",
  },
  "spalare-fatade": {
    needs: [
      "când fațada are depuneri vizibile de praf, poluare sau scurgeri",
      "când vrei întreținere periodică fără montarea unei schele clasice",
      "când zona exterioară trebuie curățată înainte de vopsire sau alte lucrări",
    ],
    checklist: [
      "tipul de material al fațadei și suprafața aproximativă",
      "gradul de murdărie și dacă există zone sensibile sau fragile",
      "dacă este nevoie de curățare punctuală sau de întreaga fațadă",
    ],
    faqQuestion: "Spălarea fațadelor este aceeași lucrare cu curățarea fațadelor?",
    faqAnswer:
      "Nu întotdeauna. Spălarea poate însemna o intervenție standard de întreținere, în timp ce curățarea poate include tratamente pentru depuneri mai dificile sau pentru anumite materiale.",
  },
  "reparatii-fatade": {
    needs: [
      "când apar fisuri, desprinderi, infiltrații sau zone degradate pe exterior",
      "când anumite elemente de fațadă devin periculoase pentru trecători",
      "când vrei remedieri punctuale fără organizarea unui șantier mare",
    ],
    checklist: [
      "unde este localizată degradarea și dacă există risc de desprindere",
      "dacă sunt afectate rosturi, tencuială, glafuri sau elemente metalice",
      "dacă lucrarea este urgentă sau poate fi programată după o constatare",
    ],
    faqQuestion: "Se pot face reparații de fațadă și fără schelă?",
    faqAnswer:
      "Da, multe intervenții punctuale se pot face prin alpinism utilitar, mai ales când accesul este localizat și soluția reduce timpul și costurile de organizare.",
  },
  "taiere-copaci": {
    needs: [
      "când arborele este uscat, înclinat sau prezintă risc pentru clădiri, cabluri și mașini",
      "când spațiul nu permite tăiere clasică și este nevoie de doborâre controlată pe segmente",
      "când există ramuri rupte sau coroane care pun în pericol circulația",
    ],
    checklist: [
      "poze clare cu arborele și zona din jur",
      "dacă sunt cabluri, acoperișuri, garduri sau alte obstacole aproape",
      "dacă este nevoie de toaletare, îndepărtare totală sau doar reducerea coronamentului",
    ],
    faqQuestion: "Când este necesară doborârea controlată a unui arbore?",
    faqAnswer:
      "Atunci când spațiul din jur este restrâns și arborele nu poate fi tăiat direct la bază fără riscuri pentru clădiri, cabluri, drumuri sau alte bunuri.",
  },
};

function defaultSupport(serviceName: string) {
  return {
    needs: [
      `când ai nevoie de ${serviceName.toLowerCase()} într-o zonă cu acces dificil`,
      "când intervenția trebuie făcută rapid, fără blocaje mari și fără schelă clasică",
      "când vrei o echipă care poate lucra controlat pe verticală și în spații sensibile",
    ],
    checklist: [
      "adresa aproximativă și fotografii clare din zona lucrării",
      "suprafața, înălțimea și principalele obstacole din jur",
      "dacă lucrarea este urgentă sau poate fi programată într-un interval mai larg",
    ],
    faqQuestion: `Ce trebuie să trimiți într-o cerere pentru ${serviceName.toLowerCase()}?`,
    faqAnswer:
      "Ajută să incluzi adresa aproximativă, poze, descrierea problemei, înălțimea estimată și orice restricții de acces sau program.",
  };
}

export const serviceArticleSeeds: ArticleSeed[] = serviceCatalog.map((service, index) => {
  const support = supportSections[service.slug] ?? defaultSupport(service.name);
  const opening = openingVariants[index % openingVariants.length];
  const selection = selectionVariants[index % selectionVariants.length];
  const process = processVariants[index % processVariants.length];

  const title = `${service.name}: ghid practic, când ai nevoie și cum alegi firma potrivită`;
  const slug = `ghid-${service.slug}`;
  const excerpt = `${service.name} explicat simplu: când merită cerut, ce informații să trimiți în ofertă și cum alegi o firmă de alpinism utilitar potrivită pentru lucrarea ta.`;
  const seoTitle = `${service.name} in Romania: ghid, pret si alegerea firmei potrivite`;
  const seoDescription = `Afla când ai nevoie de ${service.name.toLowerCase()}, cum pregătești cererea și ce verifici înainte să alegi o firmă pentru lucrarea la înălțime.`;
  const coverImageUrl = `/blog-covers/${slug}`;

  const content = [
    `${service.name} ${opening}`,
    `${service.longDescription} În platformă, pagina acestui serviciu este gândită să te ducă rapid spre firmele relevante din județul și orașul tău, nu doar spre informație generică.`,
    "## Cand ai nevoie de acest serviciu",
    ...support.needs.map((item) => `- ${item}`),
    "## Cum decurge de obicei interventia",
    process,
    "O ofertă realistă se face mai ușor când echipa știe ce suprafață are lucrarea, ce nivel de acces există și dacă în jur sunt zone care trebuie protejate. Pentru intervențiile la înălțime contează mult organizarea, nu doar execuția propriu-zisă.",
    "## Ce sa trimiti in cererea de oferta",
    ...support.checklist.map((item) => `- ${item}`),
    selection,
    "## Cum alegi firma potrivita",
    "Compară firmele după zona acoperită, serviciile listate, claritatea profilului și modul în care răspund la o cerere. O firmă bună explică simplu ce poate face, ce informații mai sunt necesare și dacă lucrarea poate fi preluată rapid.",
    "În paginile locale merită să cauți și profilurile care au servicii apropiate de lucrarea ta, pentru că uneori aceeași echipă poate prelua lucrări complementare, de exemplu curățare, etanșare și reparații punctuale pe aceeași clădire.",
    "## Cat de importanta este siguranta",
    "Pentru lucrul la înălțime, organizarea și siguranța sunt esențiale. Ghidurile publice despre work at height și rope access subliniază evaluarea riscurilor, planificarea accesului și alegerea unei metode de lucru potrivite situației din teren. În practică, pentru client contează să ofere date bune despre locație și condițiile de acces încă din primul mesaj.",
    `## Intrebare frecventa`,
    `${support.faqQuestion} ${support.faqAnswer}`,
    "## Concluzie",
    `Dacă ai nevoie de ${service.name.toLowerCase()}, cel mai eficient este să trimiți o cerere clară, cu poze și adresa aproximativă. Astfel ajungi mai repede la firmele din zona ta și poți compara oferte reale pentru lucrarea respectivă.`,
  ].join("\n\n");

  return {
    title,
    slug,
    excerpt,
    content,
    seoTitle,
    seoDescription,
    coverImageUrl,
    serviceSlug: service.slug,
  };
});

