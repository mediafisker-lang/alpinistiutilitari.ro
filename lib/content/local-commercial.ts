import type { FaqItem } from "@/lib/content/local-seo";

type CountyPageSection = {
  title: string;
  points: string[];
};

type CountySeoOverride = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  serviceSlugs: string[];
  localitySlugs: string[];
  sections: CountyPageSection[];
  faq: FaqItem[];
};

type LandingSection = {
  title: string;
  points: string[];
};

type LandingSeoOverride = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  zones: string[];
  nearbyLocationSlugs?: string[];
};

type LocalLandingContext = {
  locationSlug: string;
  countySlug: string;
  serviceSlug: string;
  serviceName: string;
  locationName: string;
  countyName: string;
  type: "county" | "city";
};

type LandingContent = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: LandingSection[];
  faq: FaqItem[];
  relatedServiceSlugs: string[];
  relatedLocationSlugs: string[];
};

const priorityCountySlugs = new Set(["bucuresti", "ilfov"]);
const priorityLocalitySlugs = new Set([
  "sector-1",
  "sector-2",
  "sector-3",
  "sector-4",
  "sector-5",
  "sector-6",
  "voluntari",
  "otopeni",
  "tunari",
  "chiajna",
  "popesti-leordeni",
]);

const countySeoOverrides: Record<string, CountySeoOverride> = {
  bucuresti: {
    title: "Alpinism utilitar Bucuresti | Oferte rapide de la firme locale",
    description:
      "Compari rapid firme de alpinism utilitar din Bucuresti pentru geamuri la inaltime, bannere, fatade, urgente si lucrari tehnice comerciale.",
    h1: "Alpinism utilitar in Bucuresti - firme potrivite pentru lucrari la inaltime",
    intro:
      "Platforma te ajuta sa trimiti o cerere clara pentru Bucuresti si sa primesti optiuni potrivite pe tipul de lucrare, zona si gradul de urgenta.",
    serviceSlugs: [
      "alpinism-utilitar",
      "spalare-geamuri-la-inaltime",
      "montaj-bannere",
      "reparatii-fatade",
      "decopertari-tencuiala",
      "punere-in-siguranta-fatade",
      "interventii-urgente-la-inaltime",
      "taiere-copaci",
    ],
    localitySlugs: ["sector-1", "sector-2", "sector-3", "sector-4", "sector-5", "sector-6"],
    sections: [
      {
        title: "Ce tipuri de lucrari se cer frecvent in Bucuresti",
        points: [
          "Spalare geamuri la inaltime pentru birouri, clinici, hoteluri si showroom-uri.",
          "Montaj bannere si mesh pe fatade comerciale, cladiri office si santiere.",
          "Reparatii de fatada, etansari si interventii punctuale pe zone cu risc.",
          "Interventii urgente la inaltime pentru elemente desprinse sau infiltratii.",
        ],
      },
      {
        title: "Zone deservite in mod constant",
        points: [
          "Sector 1, Sector 2, Sector 3, Sector 4, Sector 5, Sector 6.",
          "Pipera, Aviatiei, Floreasca, Baneasa, Herastrau, Dimitrie Pompeiu.",
          "Zone comerciale cu trafic mare, unde timpul de raspuns conteaza.",
        ],
      },
      {
        title: "Cum trimiti cererea corect",
        points: [
          "Descrii lucrarea, adresa aproximativa si termenul dorit.",
          "Adaugi poze clare cu zona de interventie.",
          "Mentionezi daca ai nevoie de mai multe servicii in aceeasi lucrare.",
        ],
      },
    ],
    faq: [
      {
        question: "Cat dureaza raspunsul la cerere in Bucuresti?",
        answer:
          "Pentru lucrarile din Bucuresti, primul raspuns vine de regula rapid, dupa ce cererea este verificata intern si directionata catre firmele relevante.",
      },
      {
        question: "Pot cere oferta pentru mai multe lucrari in acelasi proiect?",
        answer:
          "Da. Poti combina in aceeasi cerere spalare geamuri, reparatii de fatada, montaj bannere sau alte interventii, iar noi structuram solicitarea pentru ofertare.",
      },
    ],
  },
  ilfov: {
    title: "Alpinism utilitar Ilfov | Oferte pentru Voluntari, Otopeni si imprejurimi",
    description:
      "Gasesti rapid firme pentru alpinism utilitar in Ilfov: Voluntari, Otopeni, Tunari, Chiajna, Popesti-Leordeni si alte localitati cu cerere comerciala.",
    h1: "Alpinism utilitar in Ilfov - compari rapid firme si oferte locale",
    intro:
      "Daca ai nevoie de lucrari la inaltime in Ilfov, centralizam cererea ta si te ajutam sa ajungi la executanti potriviti pentru zona, termen si complexitate.",
    serviceSlugs: [
      "alpinism-utilitar",
      "spalare-geamuri-la-inaltime",
      "montaj-bannere",
      "decopertari-tencuiala",
      "punere-in-siguranta-fatade",
      "interventii-urgente-la-inaltime",
      "taiere-copaci",
    ],
    localitySlugs: [
      "voluntari",
      "otopeni",
      "tunari",
      "chiajna",
      "popesti-leordeni",
      "buftea",
      "snagov",
      "afumati",
    ],
    sections: [
      {
        title: "Lucrari solicitate des in Ilfov",
        points: [
          "Spalare geamuri la inaltime pe cladiri de birouri si ansambluri noi.",
          "Montaj bannere si elemente publicitare pe fatade comerciale.",
          "Interventii urgente pe acoperisuri, fatade si zone cu risc.",
          "Taiere copaci in proximitatea caselor, drumurilor sau cablurilor.",
        ],
      },
      {
        title: "Localitati cu volum ridicat de cereri",
        points: [
          "Voluntari, Otopeni, Tunari, Chiajna, Popesti-Leordeni.",
          "Buftea, Snagov, Afumati si localitati in extindere rezidentiala.",
          "Zone cu dezvoltare accelerata unde lucrarile la inaltime apar constant.",
        ],
      },
      {
        title: "Cand devine urgenta interventia",
        points: [
          "Cand exista risc pentru oameni, trafic sau bunuri.",
          "Cand apar infiltratii active, elemente desprinse sau copaci instabili.",
          "Cand lucrarea afecteaza activitatea comerciala si trebuie rezolvata rapid.",
        ],
      },
    ],
    faq: [
      {
        question: "Lucrati si in localitatile din jurul Bucurestiului?",
        answer:
          "Da. Cererile din Ilfov sunt preluate inclusiv pentru Voluntari, Otopeni, Tunari, Chiajna, Popesti-Leordeni si alte localitati apropiate.",
      },
      {
        question: "Ce tipuri de cladiri deserviti in Ilfov?",
        answer:
          "Platforma acopera cereri pentru blocuri, case, birouri, showroom-uri, hale, cladiri comerciale si ansambluri rezidentiale noi.",
      },
    ],
  },
};

const landingSeoOverrides: Record<string, LandingSeoOverride> = {
  "bucuresti/alpinism-utilitar": {
    title: "Alpinism utilitar Bucuresti | Oferte rapide pentru lucrari",
    description:
      "Soliciti alpinism utilitar in Bucuresti pentru fatade, acoperisuri, geamuri si montaj tehnic. Compari firme locale si alegi oferta potrivita rapid.",
    h1: "Alpinism utilitar in Bucuresti",
    intro:
      "Potrivita pentru blocuri inalte, cladiri office din Pipera si fatade comerciale din centru, pagina aceasta aduna executanti pentru lucrari tehnice pe coarda.",
    zones: ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6", "Pipera", "Aviatiei", "Floreasca"],
  },
  "bucuresti/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Bucuresti | Oferte rapide locale",
    description:
      "Ceri spalare geamuri la inaltime in Bucuresti pentru turnuri de birouri, blocuri noi, hoteluri si showroom-uri. Primesti rapid oferte locale comparabile.",
    h1: "Spalare geamuri la inaltime in Bucuresti",
    intro:
      "Pentru pereti cortina din Aviatiei, vitraje comerciale din Unirii sau blocuri din Titan, ai un traseu clar de ofertare pentru curatare profesionala.",
    zones: ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6", "Baneasa", "Herastrau", "Dimitrie Pompeiu"],
  },
  "bucuresti/montaj-bannere": {
    title: "Montaj bannere Bucuresti | Oferte rapide pentru fatade",
    description:
      "Soliciti montaj bannere in Bucuresti pentru fatade comerciale, mesh de santier si reclame outdoor. Compari echipe pentru montaj, demontare si tensionare.",
    h1: "Montaj bannere in Bucuresti",
    intro:
      "Utila pentru campanii in zone cu trafic mare precum Unirii, Tineretului sau Militari, pagina te ajuta sa alegi echipa potrivita pentru montaj publicitar.",
    zones: ["Pipera", "Aviatiei", "Floreasca", "Unirii", "Tineretului", "Berceni", "Militari"],
  },
  "bucuresti/reparatii-fatade": {
    title: "Reparatii fatade Bucuresti | Oferte rapide pentru cladiri",
    description:
      "Ceri reparatii fatade in Bucuresti pentru fisuri, etansari, tencuiala desprinsa si degradari locale. Primesti oferte pentru blocuri, birouri si imobile mixte.",
    h1: "Reparatii fatade in Bucuresti",
    intro:
      "Dedicata cladirilor rezidentiale si office din toate sectoarele, pagina acopera interventii punctuale sau lucrari extinse pe zone cu acces dificil.",
    zones: ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"],
  },
  "bucuresti/interventii-urgente-la-inaltime": {
    title: "Interventii urgente la inaltime Bucuresti | Oferte rapide",
    description:
      "Soliciti interventii urgente la inaltime in Bucuresti pentru elemente desprinse, infiltratii active si risc pe fatade. Trimiti cererea, primesti raspuns rapid.",
    h1: "Interventii urgente la inaltime in Bucuresti",
    intro:
      "Creata pentru situatii critice in blocuri, cladiri comerciale si acoperisuri tehnice, pagina prioritizeaza cererile cu risc imediat pentru oameni si bunuri.",
    zones: ["Bucuresti central", "Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"],
  },
  "bucuresti/taiere-copaci": {
    title: "Taiere copaci Bucuresti | Oferte rapide pentru zone urbane",
    description:
      "Ceri taiere copaci in Bucuresti pentru arbori instabili, ramuri periculoase si lucrari in curti sau parcari. Compari echipe pentru interventii controlate.",
    h1: "Taiere copaci in Bucuresti",
    intro:
      "Relevanta pentru zone dense precum Baneasa, Cotroceni sau Drumul Taberei, pagina acopera lucrari unde siguranta trecatorilor si a cladirilor este prioritara.",
    zones: ["Baneasa", "Domenii", "Cotroceni", "Titan", "Drumul Taberei", "Berceni"],
  },
  "ilfov/alpinism-utilitar": {
    title: "Alpinism utilitar Ilfov | Oferte rapide in zona nordica",
    description:
      "Soliciti alpinism utilitar in Ilfov pentru ansambluri noi, hale, fatade si acoperisuri tehnice. Compari firme din Voluntari, Otopeni, Tunari si Chiajna.",
    h1: "Alpinism utilitar in Ilfov",
    intro:
      "Utila pentru proiecte din nordul Capitalei si localitatile periurbane, pagina te ajuta sa ceri oferte pentru lucrari la inaltime cu acces dificil.",
    zones: ["Voluntari", "Otopeni", "Tunari", "Chiajna", "Popesti-Leordeni", "Buftea", "Snagov", "Afumati"],
  },
  "ilfov/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Ilfov | Oferte rapide locale",
    description:
      "Ceri spalare geamuri la inaltime in Ilfov pentru birouri, showroom-uri si ansambluri rezidentiale. Compari rapid oferte din Voluntari, Otopeni si Tunari.",
    h1: "Spalare geamuri la inaltime in Ilfov",
    intro:
      "Potrivita pentru cladiri vitrate din Voluntari, Otopeni si Chiajna, pagina te ajuta sa alegi executantii pentru lucrari punctuale sau mentenanta periodica.",
    zones: ["Voluntari", "Otopeni", "Tunari", "Chiajna", "Popesti-Leordeni"],
  },
  "ilfov/montaj-bannere": {
    title: "Montaj bannere Ilfov | Oferte rapide pentru fatade",
    description:
      "Soliciti montaj bannere in Ilfov pentru fatade comerciale, hale si mesh de santier. Primesti oferte pentru montaj, demontare si inlocuiri rapide.",
    h1: "Montaj bannere in Ilfov",
    intro:
      "Recomandata pentru localitati cu dezvoltare comerciala accelerata, pagina acopera proiecte publicitare in Voluntari, Otopeni, Buftea si zonele industriale.",
    zones: ["Voluntari", "Otopeni", "Tunari", "Chiajna", "Popesti-Leordeni", "Buftea"],
  },
  "ilfov/interventii-urgente-la-inaltime": {
    title: "Interventii urgente la inaltime Ilfov | Oferte rapide",
    description:
      "Ceri interventii urgente la inaltime in Ilfov pentru infiltratii, elemente desprinse si risc pe fatade. Cererea este prioritizata pentru raspuns rapid.",
    h1: "Interventii urgente la inaltime in Ilfov",
    intro:
      "Construita pentru probleme critice in ansambluri rezidentiale, sedii office si hale, pagina centralizeaza urgent lucrarile din Voluntari, Otopeni si Tunari.",
    zones: ["Voluntari", "Otopeni", "Tunari", "Chiajna", "Popesti-Leordeni", "Afumati"],
  },
  "ilfov/taiere-copaci": {
    title: "Taiere copaci Ilfov | Oferte rapide pentru zone rezidentiale",
    description:
      "Soliciti taiere copaci in Ilfov pentru arbori periculosi, ramuri instabile si curti cu acces dificil. Compari echipe pentru lucrari sigure in localitatea ta.",
    h1: "Taiere copaci in Ilfov",
    intro:
      "Utila in localitati cu multa constructie noua, pagina te ajuta sa gestionezi arborii cu risc in Voluntari, Otopeni, Snagov si Popesti-Leordeni.",
    zones: ["Voluntari", "Otopeni", "Tunari", "Chiajna", "Popesti-Leordeni", "Snagov"],
  },
  "bucuresti/decopertari-tencuiala": {
    title: "Decopertari tencuiala Bucuresti | Fatade periculoase",
    description:
      "Ceri decopertari tencuiala in Bucuresti pentru fatade degradate, tencuiala desprinsa si interventii urgente de punere in siguranta cu alpinisti utilitari.",
    h1: "Decopertari tencuiala in Bucuresti",
    intro:
      "Pentru blocuri vechi, cladiri administrative si fatade comerciale cu risc de desprindere, pagina centralizeaza rapid oferte pentru decopertari controlate.",
    zones: ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6", "Unirii", "Floreasca"],
  },
  "ilfov/decopertari-tencuiala": {
    title: "Decopertari tencuiala Ilfov | Fatade degradate urgent",
    description:
      "Soliciti decopertari tencuiala in Ilfov pentru fatade degradate, desprinderi periculoase si interventii urgente de securizare in Voluntari, Otopeni si Chiajna.",
    h1: "Decopertari tencuiala in Ilfov",
    intro:
      "Potrivita pentru ansambluri rezidentiale noi si cladiri comerciale din Ilfov, pagina te ajuta sa preiei rapid lucrari cu risc pe fatade.",
    zones: ["Voluntari", "Otopeni", "Chiajna", "Popesti-Leordeni", "Tunari", "Buftea"],
  },
  "bucuresti/punere-in-siguranta-fatade": {
    title: "Punere in siguranta fatade Bucuresti | Interventii rapide",
    description:
      "Soliciti punere in siguranta fatade in Bucuresti pentru elemente instabile, fisuri si risc de desprindere. Primesti oferte rapide pentru interventii urgente.",
    h1: "Punere in siguranta fatade in Bucuresti",
    intro:
      "Pentru blocuri, cladiri office si imobile comerciale cu degradari vizibile, pagina te ajuta sa ceri rapid interventii de securizare a fatadei.",
    zones: ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6", "Aviatiei", "Unirii"],
  },
  "ilfov/punere-in-siguranta-fatade": {
    title: "Punere in siguranta fatade Ilfov | Interventii urgente",
    description:
      "Ceri punere in siguranta fatade in Ilfov pentru desprinderi, zone instabile si risc pentru pietoni sau trafic. Interventii rapide in localitati periurbane.",
    h1: "Punere in siguranta fatade in Ilfov",
    intro:
      "Utila pentru ansambluri rezidentiale, sedii comerciale si cladiri mixte din Ilfov, pagina acopera interventii urgente pe fatade degradate.",
    zones: ["Voluntari", "Otopeni", "Tunari", "Chiajna", "Popesti-Leordeni", "Buftea", "Snagov"],
  },
  "sector-1/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Sector 1 Bucuresti | Oferte rapide",
    description:
      "Ceri spalare geamuri la inaltime in Sector 1 pentru cladiri office din Aviatiei, hoteluri din Baneasa si blocuri premium. Compari oferte locale in aceeasi zi.",
    h1: "Spalare geamuri la inaltime in Sector 1 Bucuresti",
    intro:
      "Optima pentru turnuri de birouri, clinici private si ansambluri premium, pagina Sector 1 acopera lucrari pe vitrari mari si fatade greu accesibile.",
    zones: ["Aviatiei", "Baneasa", "Domenii", "Herastrau", "Piata Victoriei"],
    nearbyLocationSlugs: ["sector-2", "sector-6", "voluntari", "otopeni"],
  },
  "sector-2/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Sector 2 Bucuresti | Oferte rapide",
    description:
      "Soliciti spalare geamuri la inaltime in Sector 2 pentru blocuri inalte, clinici si cladiri comerciale din Obor, Iancului si Pantelimon. Primesti oferte rapide.",
    h1: "Spalare geamuri la inaltime in Sector 2 Bucuresti",
    intro:
      "Construita pentru zone mixte rezidential-comerciale, pagina Sector 2 te ajuta sa ceri oferte pentru geamuri greu accesibile si vitrari continue.",
    zones: ["Obor", "Pantelimon", "Iancului", "Fundeni", "Colentina"],
    nearbyLocationSlugs: ["sector-1", "sector-3", "voluntari", "otopeni"],
  },
  "sector-3/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Sector 3 Bucuresti | Oferte rapide",
    description:
      "Ceri spalare geamuri la inaltime in Sector 3 pentru blocuri noi, showroom-uri si cladiri office din Dristor, Unirii si Vitan. Compari oferte locale relevante.",
    h1: "Spalare geamuri la inaltime in Sector 3 Bucuresti",
    intro:
      "Pagina Sector 3 este orientata pe fatade vitrate mari si lucrari recurente pentru imobile rezidentiale cu trafic ridicat in jurul arterelor principale.",
    zones: ["Dristor", "Titan", "Unirii", "Vitan", "Decebal"],
    nearbyLocationSlugs: ["sector-2", "sector-4", "popesti-leordeni", "sector-1"],
  },
  "sector-4/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Sector 4 Bucuresti | Oferte rapide",
    description:
      "Soliciti spalare geamuri la inaltime in Sector 4 pentru blocuri, sedii office si centre comerciale din Tineretului, Berceni si Brancoveanu. Oferte rapide.",
    h1: "Spalare geamuri la inaltime in Sector 4 Bucuresti",
    intro:
      "Recomandata pentru ansambluri dense si cladiri comerciale din sud, pagina Sector 4 acopera mentenanta periodica a geamurilor si interventii punctuale.",
    zones: ["Tineretului", "Berceni", "Brancoveanu", "Carol", "Aparatorii Patriei"],
    nearbyLocationSlugs: ["sector-3", "sector-5", "popesti-leordeni", "sector-2"],
  },
  "sector-5/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Sector 5 Bucuresti | Oferte rapide",
    description:
      "Ceri spalare geamuri la inaltime in Sector 5 pentru imobile rezidentiale, institutii si sedii comerciale din Rahova, Panduri si 13 Septembrie. Oferte rapide.",
    h1: "Spalare geamuri la inaltime in Sector 5 Bucuresti",
    intro:
      "Pagina Sector 5 este utila pentru cladiri mixte si sedii administrative unde geamurile exterioare necesita acces pe coarda si programare flexibila.",
    zones: ["Rahova", "13 Septembrie", "Cotroceni", "Panduri", "Eroii Revolutiei"],
    nearbyLocationSlugs: ["sector-4", "sector-6", "chiajna", "sector-3"],
  },
  "sector-6/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Sector 6 Bucuresti | Oferte rapide",
    description:
      "Soliciti spalare geamuri la inaltime in Sector 6 pentru turnuri office, blocuri noi si retail din Militari, Crangasi si Drumul Taberei. Primesti oferte locale.",
    h1: "Spalare geamuri la inaltime in Sector 6 Bucuresti",
    intro:
      "Dedicata zonelor cu proiecte rezidentiale mari si spatii comerciale extinse, pagina Sector 6 te ajuta sa programezi lucrari rapide pe geamuri inalte.",
    zones: ["Militari", "Drumul Taberei", "Crangasi", "Grozavesti", "Lujerului"],
    nearbyLocationSlugs: ["sector-1", "sector-5", "chiajna", "otopeni"],
  },
  "voluntari/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Voluntari | Oferte rapide Ilfov",
    description:
      "Ceri spalare geamuri la inaltime in Voluntari pentru cladiri office din Pipera, ansambluri premium si sedii comerciale. Compari rapid oferte locale din Ilfov.",
    h1: "Spalare geamuri la inaltime in Voluntari",
    intro:
      "Conceputa pentru zona de business din nord, pagina Voluntari acopera lucrari pe vitrari mari, fatade continue si mentenanta recurenta in ansambluri noi.",
    zones: ["Pipera", "Voluntari centru", "Erou Iancu Nicolae", "nord Ilfov"],
    nearbyLocationSlugs: ["otopeni", "tunari", "sector-1", "sector-2"],
  },
  "otopeni/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Otopeni | Oferte rapide Ilfov",
    description:
      "Soliciti spalare geamuri la inaltime in Otopeni pentru hoteluri, birouri, hale logistice si cladiri rezidentiale. Primesti oferte locale comparabile rapid.",
    h1: "Spalare geamuri la inaltime in Otopeni",
    intro:
      "Potrivita pentru zona aeroportuara si coridorul logistic, pagina Otopeni te ajuta sa ceri interventii punctuale sau contracte periodice de curatare.",
    zones: ["Otopeni centru", "zona aeroport", "Tunari", "Mogosoaia"],
    nearbyLocationSlugs: ["voluntari", "tunari", "sector-1", "chiajna"],
  },
  "tunari/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Tunari | Oferte rapide Ilfov",
    description:
      "Ceri spalare geamuri la inaltime in Tunari pentru vile, ansambluri noi si cladiri comerciale locale. Compari echipe care acopera rapid nordul Ilfovului.",
    h1: "Spalare geamuri la inaltime in Tunari",
    intro:
      "Construita pentru localitati rezidentiale in expansiune, pagina Tunari este utila cand geamurile inalte necesita acces tehnic sigur si interventie rapida.",
    zones: ["Tunari", "Pipera", "Otopeni", "Stefanestii de Jos"],
    nearbyLocationSlugs: ["voluntari", "otopeni", "sector-1", "sector-2"],
  },
  "chiajna/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Chiajna | Oferte rapide Ilfov",
    description:
      "Soliciti spalare geamuri la inaltime in Chiajna pentru blocuri noi, retail si spatii logistice. Primesti oferte locale pentru lucrari punctuale sau recurente.",
    h1: "Spalare geamuri la inaltime in Chiajna",
    intro:
      "Utila pentru ansambluri dense si zone comerciale din vest, pagina Chiajna centralizeaza rapid cererile pentru geamuri si fatade vitrate extinse.",
    zones: ["Chiajna", "Militari Residence", "Rosu", "Dragomiresti"],
    nearbyLocationSlugs: ["sector-6", "sector-5", "otopeni", "voluntari"],
  },
  "popesti-leordeni/spalare-geamuri-la-inaltime": {
    title: "Spalare geamuri la inaltime Popesti-Leordeni | Oferte rapide",
    description:
      "Ceri spalare geamuri la inaltime in Popesti-Leordeni pentru ansambluri rezidentiale, sedii si spatii comerciale. Compari oferte locale si alegi executantul.",
    h1: "Spalare geamuri la inaltime in Popesti-Leordeni",
    intro:
      "Potrivita pentru sudul Ilfovului si zona Berceni, pagina Popesti-Leordeni acopera interventii pe vitrari mari in blocuri noi si cladiri mixte.",
    zones: ["Popesti-Leordeni", "Berceni", "IMGB", "sud Ilfov"],
    nearbyLocationSlugs: ["sector-4", "sector-3", "sector-2", "voluntari"],
  },
};

const serviceSectionTemplates: Record<
  string,
  {
    works: string[];
    buildingTypes: string[];
    urgentCases: string[];
    relatedServiceSlugs: string[];
  }
> = {
  "alpinism-utilitar": {
    works: [
      "Mentenanta si reparatii punctuale pe fatade, acoperisuri si structuri exterioare.",
      "Montaj si demontaj elemente la inaltime (publicitate, instalatii, protectii).",
      "Interventii tehnice in zone unde schela sau nacela nu sunt eficiente.",
    ],
    buildingTypes: [
      "Cladiri de birouri si centre comerciale.",
      "Blocuri, ansambluri rezidentiale si vile cu acces dificil.",
      "Hale, structuri industriale si cladiri tehnice.",
    ],
    urgentCases: [
      "Elemente desprinse care pot pune in pericol persoane sau trafic.",
      "Infiltratii active sau degradari care avanseaza rapid.",
      "Situatii in care activitatea comerciala este blocata de defectiuni exterioare.",
    ],
    relatedServiceSlugs: [
      "spalare-geamuri-la-inaltime",
      "reparatii-fatade",
      "interventii-urgente-la-inaltime",
      "montaj-bannere",
    ],
  },
  "spalare-geamuri-la-inaltime": {
    works: [
      "Spalare geamuri exterioare la inaltime pe cladiri office si rezidentiale.",
      "Curatare pereti cortina, luminatoare si suprafete vitrate mari.",
      "Interventii punctuale pentru geamuri greu accesibile.",
    ],
    buildingTypes: [
      "Cladiri de birouri, showroom-uri si hoteluri.",
      "Blocuri si ansambluri rezidentiale noi.",
      "Spatii medicale, educationale si comerciale cu fatade vitrate.",
    ],
    urgentCases: [
      "Cand murdaria afecteaza imaginea comerciala a cladirii.",
      "Cand exista termene fixe pentru receptii, audit sau inspectii.",
      "Cand sunt depuneri greu de indepartat care necesita interventie profesionala.",
    ],
    relatedServiceSlugs: ["spalare-fatade", "reparatii-fatade", "alpinism-utilitar"],
  },
  "montaj-bannere": {
    works: [
      "Montaj bannere publicitare pe fatade, schele si structuri metalice.",
      "Montaj mesh de santier si materiale promotionale de mari dimensiuni.",
      "Demontari, inlocuiri si tensionari pentru campanii sezoniere.",
    ],
    buildingTypes: [
      "Cladiri comerciale si sedii corporate.",
      "Santiere, hale si fatade cu expunere mare.",
      "Spatii retail, showroom-uri si proiecte mixed-use.",
    ],
    urgentCases: [
      "Cand campania are termen scurt de lansare.",
      "Cand bannerele existente sunt deteriorate si trebuie inlocuite imediat.",
      "Cand conditiile de siguranta impun refixare sau demontare rapida.",
    ],
    relatedServiceSlugs: ["montaj-mesh", "montaj-litere-volumetrice", "interventii-urgente-la-inaltime"],
  },
  "reparatii-fatade": {
    works: [
      "Reparatii punctuale de fisuri, tencuiala si rosturi.",
      "Etansari locale pentru infiltratii si zone degradate.",
      "Consolidari usoare in puncte cu acces dificil.",
    ],
    buildingTypes: [
      "Blocuri vechi si ansambluri rezidentiale noi.",
      "Cladiri de birouri si fatade comerciale.",
      "Institutii publice si cladiri tehnice.",
    ],
    urgentCases: [
      "Cand apar desprinderi de material cu risc pentru trecatori.",
      "Cand infiltratiile afecteaza spatii locuite sau exploatate comercial.",
      "Cand degradarea avanseaza si creste costul reparatiei ulterioare.",
    ],
    relatedServiceSlugs: ["etansari-si-infiltratii", "spalare-fatade", "interventii-urgente-la-inaltime"],
  },
  "decopertari-tencuiala": {
    works: [
      "Decopertare controlata a tencuielii desprinse de pe fatade inalte.",
      "Curatarea zonelor instabile si evacuarea materialului periculos.",
      "Pregatirea suprafetei pentru reparatii ulterioare si consolidare locala.",
    ],
    buildingTypes: [
      "Blocuri vechi cu fatade degradate.",
      "Cladiri administrative si scoli cu risc de desprinderi.",
      "Imobile comerciale cu trafic pietonal intens la baza cladirii.",
    ],
    urgentCases: [
      "Cand tencuiala cade sau exista risc imediat pentru trecatori.",
      "Cand apar fisuri active si zone care se desprind dupa ploi sau inghet.",
      "Cand autoritatile sau administratorul cer punere rapida in siguranta.",
    ],
    relatedServiceSlugs: [
      "punere-in-siguranta-fatade",
      "interventii-urgente-la-inaltime",
      "reparatii-fatade",
      "indepartare-tencuiala-degradata",
    ],
  },
  "punere-in-siguranta-fatade": {
    works: [
      "Identificare si indepartare elemente instabile de pe fatada.",
      "Fixari provizorii in zonele cu risc pana la reparatia completa.",
      "Delimitare perimetru si masuri de protectie pentru trafic si pietoni.",
    ],
    buildingTypes: [
      "Blocuri cu elemente decorative degradate.",
      "Cladiri de birouri cu placari desprinse partial.",
      "Imobile comerciale situate in arii cu circulatie intensa.",
    ],
    urgentCases: [
      "Cand fatada prezinta desprinderi active sau fisuri critice.",
      "Cand exista risc pentru oameni, masini sau intrari in cladire.",
      "Cand este necesara interventie rapida pana la proiectul complet de reabilitare.",
    ],
    relatedServiceSlugs: [
      "decopertari-tencuiala",
      "interventii-urgente-la-inaltime",
      "reparatii-fatade",
      "etansari-si-infiltratii",
    ],
  },
  "interventii-urgente-la-inaltime": {
    works: [
      "Asigurari provizorii si interventii de limitare a riscului.",
      "Indepartare elemente desprinse sau instabile.",
      "Remedieri rapide pentru infiltratii, fixari si siguranta exterioara.",
    ],
    buildingTypes: [
      "Blocuri, cladiri office si centre comerciale.",
      "Cladiri publice, scoli, clinici si sedii operationale.",
      "Spatii industriale si structuri tehnice.",
    ],
    urgentCases: [
      "Cand exista risc imediat pentru persoane, masini sau infrastructura.",
      "Cand lucrarea nu suporta amanare din cauza vremii sau degradarii.",
      "Cand trebuie asigurata rapid zona pana la remedierea completa.",
    ],
    relatedServiceSlugs: ["reparatii-fatade", "alpinism-utilitar", "taiere-copaci"],
  },
  "taiere-copaci": {
    works: [
      "Taiere controlata a arborilor cu risc in zone urbane dense.",
      "Indepartare ramuri periculoase in proximitatea cladirilor si cablurilor.",
      "Interventii de urgenta dupa vant puternic sau rupere de crengi.",
    ],
    buildingTypes: [
      "Curti rezidentiale si ansambluri de locuinte.",
      "Parcari, alei, zone comerciale si sedii de firma.",
      "Spatii publice cu trafic pietonal sau auto.",
    ],
    urgentCases: [
      "Cand arborele este inclinat sau prezinta risc de cadere.",
      "Cand ramurile afecteaza cabluri electrice sau accesul in proprietate.",
      "Cand exista pericol pentru trecatori, masini sau acoperisuri.",
    ],
    relatedServiceSlugs: ["toaletare-copaci", "interventii-urgente-la-inaltime", "alpinism-utilitar"],
  },
};

const defaultRelatedServiceSlugs = ["alpinism-utilitar", "spalare-geamuri-la-inaltime", "interventii-urgente-la-inaltime"];

function buildDefaultLandingTitle(locationName: string, serviceName: string) {
  return `${serviceName} in ${locationName} | Oferte locale rapide`;
}

function buildDefaultLandingDescription(locationName: string, countyName: string, serviceName: string) {
  return `Ceri ${serviceName.toLowerCase()} in ${locationName}, ${countyName}, compari oferte locale si alegi executantul potrivit pentru cladirea si lucrarea ta in timp scurt.`;
}

function buildLocalLandingFaq(context: LocalLandingContext, zones: string[]): FaqItem[] {
  const zoneSnippet = zones.length ? zones.slice(0, 4).join(", ") : `${context.locationName} si imprejurimi`;

  return [
    {
      question: "Cat dureaza raspunsul la cerere?",
      answer:
        "Raspunsul initial vine de obicei rapid dupa validarea cererii. Pentru urgente, mentioneaza clar prioritatea si intervalul dorit.",
    },
    {
      question: "Ce tipuri de cladiri deserviti?",
      answer:
        "Cererile acopera blocuri, cladiri office, centre comerciale, hale, showroom-uri si proprietati rezidentiale cu acces dificil.",
    },
    {
      question: "Lucrati si in localitatile din jur?",
      answer: `Da, se pot prelua lucrari in ${zoneSnippet}, in functie de disponibilitatea echipelor si complexitatea lucrarii.`,
    },
    {
      question: "Pot cere oferta pentru mai multe lucrari?",
      answer:
        "Da. Poti include mai multe lucrari in aceeasi cerere, iar solicitarea este structurata intern pentru ofertare corecta.",
    },
    {
      question: "Ce include o interventie de alpinism utilitar?",
      answer:
        "Evaluarea accesului, masuri de siguranta, executia lucrarii la inaltime si recomandari tehnice pentru pasii urmatori.",
    },
  ];
}

export function isPriorityCountySlug(countySlug: string) {
  return priorityCountySlugs.has(countySlug);
}

export function isPriorityLocalitySlug(locationSlug: string) {
  return priorityLocalitySlugs.has(locationSlug);
}

export function isPriorityLandingPath(locationSlug: string, serviceSlug: string) {
  return Boolean(landingSeoOverrides[`${locationSlug}/${serviceSlug}`]);
}

export function getCountySeoOverride(countySlug: string) {
  return countySeoOverrides[countySlug];
}

export function getCountyCommercialSections(countySlug: string) {
  return countySeoOverrides[countySlug]?.sections ?? [];
}

export function getCountyCommercialFaq(countySlug: string) {
  return countySeoOverrides[countySlug]?.faq ?? [];
}

export function getCountyLocalitySlugs(countySlug: string) {
  return countySeoOverrides[countySlug]?.localitySlugs ?? [];
}

export function getCountyServiceSlugs(countySlug: string) {
  return countySeoOverrides[countySlug]?.serviceSlugs ?? [];
}

export function getLocalLandingContent(context: LocalLandingContext): LandingContent {
  const key = `${context.locationSlug}/${context.serviceSlug}`;
  const override = landingSeoOverrides[key];
  const template = serviceSectionTemplates[context.serviceSlug];
  const zones = override?.zones ?? [context.locationName];

  return {
    title: override?.title ?? buildDefaultLandingTitle(context.locationName, context.serviceName),
    description:
      override?.description ??
      buildDefaultLandingDescription(
        context.locationName,
        context.countyName,
        context.serviceName,
      ),
    h1: override?.h1 ?? `${context.serviceName} in ${context.locationName}`,
    intro:
      override?.intro ??
      `Pagina este optimizata pentru cautari de tip ${context.serviceSlug.replaceAll("-", " ")} + ${context.locationName}, cu accent pe cereri comerciale reale.`,
    sections: [
      {
        title: "Ce lucrari se fac",
        points:
          template?.works ?? [
            "Interventii la inaltime adaptate lucrarii descrise in cerere.",
            "Lucrari punctuale sau recurente, in functie de nevoia proiectului.",
            "Executie in conditii de siguranta, cu planificare clara.",
          ],
      },
      {
        title: "Tipuri de cladiri deservite",
        points:
          template?.buildingTypes ?? [
            "Cladiri rezidentiale si comerciale.",
            "Spatii office, retail si proiecte mixed-use.",
            "Structuri tehnice sau industriale cu acces dificil.",
          ],
      },
      {
        title: "Zone deservite",
        points: zones.map((zone) => `Interventii in ${zone}.`),
      },
      {
        title: "Cand este urgenta interventia",
        points:
          template?.urgentCases ?? [
            "Cand exista risc pentru persoane, trafic sau proprietate.",
            "Cand apare o problema activa care se agraveaza rapid.",
            "Cand lucrarea are termen comercial strict.",
          ],
      },
      {
        title: "Cum se cere oferta",
        points: [
          "Selectezi zona si tipul lucrarii.",
          "Descrii problema, adresa aproximativa si termenul dorit.",
          "Atasezi poze relevante pentru evaluare mai rapida.",
        ],
      },
    ],
    faq: buildLocalLandingFaq(context, zones),
    relatedServiceSlugs: template?.relatedServiceSlugs ?? defaultRelatedServiceSlugs,
    relatedLocationSlugs:
      context.type === "county"
        ? getCountyLocalitySlugs(context.locationSlug)
        : (override?.nearbyLocationSlugs ??
          getCountyLocalitySlugs(context.countySlug).filter((slug) => slug !== context.locationSlug)),
  };
}
