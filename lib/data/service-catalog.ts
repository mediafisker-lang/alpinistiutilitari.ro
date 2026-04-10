export type ServiceSeed = {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
};

export const serviceCatalog: ServiceSeed[] = [
  {
    name: "Alpinism utilitar",
    slug: "alpinism-utilitar",
    category: "Lucrari la inaltime",
    shortDescription:
      "Interventii generale la inaltime pentru fatade, acoperisuri, structuri tehnice si urgente comerciale.",
    longDescription:
      "Serviciul de alpinism utilitar acopera lucrari la inaltime in zone greu accesibile, fara schela clasica, pentru cladiri rezidentiale, comerciale si industriale.",
    icon: "mountain",
  },
  {
    name: "Spalare geamuri la inaltime",
    slug: "spalare-geamuri-la-inaltime",
    category: "Geamuri",
    shortDescription:
      "Spalare geamuri pentru cladiri inalte, geamuri greu accesibile si pereti cortina.",
    longDescription:
      "Spalarea geamurilor la inaltime este potrivita pentru cladiri de birouri, showroom-uri, hoteluri si ansambluri rezidentiale cu acces dificil.",
    icon: "building-2",
  },
  {
    name: "Spalare fatade",
    slug: "spalare-fatade",
    category: "Fatade",
    shortDescription:
      "Curatare si spalare fatade pentru cladiri comerciale, rezidentiale si suprafete vitrate.",
    longDescription:
      "Serviciul include spalarea fatadelor, curatarea depunerilor si intretinerea suprafetelor exterioare accesibile doar prin alpinism utilitar.",
    icon: "spray-can",
  },
  {
    name: "Curatare fatade",
    slug: "curatare-fatade",
    category: "Fatade",
    shortDescription:
      "Curatare depuneri, murdarie si urme industriale de pe fatade accesibile dificil.",
    longDescription:
      "Curatarea fatadelor este utila pentru cladiri murdarite de praf urban, trafic, depuneri industriale sau intretinere insuficienta.",
    icon: "sparkles",
  },
  {
    name: "Reparatii fatade",
    slug: "reparatii-fatade",
    category: "Fatade",
    shortDescription:
      "Interventii la inaltime pentru reparatii fatade, fisuri, rosturi si elemente exterioare degradate.",
    longDescription:
      "Reparatiile de fatada includ etansari, remedieri punctuale, refaceri locale si consolidari usoare in zone greu accesibile.",
    icon: "hammer",
  },
  {
    name: "Vopsire fatade",
    slug: "vopsire-fatade",
    category: "Finisaje",
    shortDescription:
      "Vopsire exterioara pentru fatade degradate, cladiri comerciale si blocuri.",
    longDescription:
      "Vopsirea fatadelor la inaltime este potrivita pentru reimprospatarea cladirilor si refacerea aspectului exterior fara schela clasica.",
    icon: "paintbrush",
  },
  {
    name: "Indepartare tencuiala degradata",
    slug: "indepartare-tencuiala-degradata",
    category: "Fatade",
    shortDescription:
      "Indepartare tencuiala degradata si elemente instabile de pe fatade si cladiri cu risc.",
    longDescription:
      "Interventiile de indepartare a tencuielii degradate sunt folosite pentru a elimina riscurile si a pregati suprafetele pentru reparatii.",
    icon: "brick-wall",
  },
  {
    name: "Decopertari tencuiala",
    slug: "decopertari-tencuiala",
    category: "Fatade",
    shortDescription:
      "Decopertari controlate de tencuiala desprinsa pentru fatade cu risc, realizate cu alpinisti utilitari.",
    longDescription:
      "Serviciul de decopertari tencuiala este folosit pentru indepartarea zonelor instabile de pe fatade, punerea in siguranta a perimetrului si pregatirea reparatiilor ulterioare.",
    icon: "brick-wall",
  },
  {
    name: "Punere in siguranta fatade",
    slug: "punere-in-siguranta-fatade",
    category: "Fatade",
    shortDescription:
      "Punere in siguranta pentru fatade degradate: indepartare elemente instabile si masuri urgente de protectie.",
    longDescription:
      "Punerea in siguranta a fatadelor include evaluarea riscului, indepartarea zonelor periculoase, fixari provizorii si interventii urgente pana la reparatia completa.",
    icon: "shield-alert",
  },
  {
    name: "Etansari si infiltratii",
    slug: "etansari-si-infiltratii",
    category: "Fatade",
    shortDescription:
      "Etansari la inaltime pentru rosturi, fisuri, infiltratii si zone expuse la apa.",
    longDescription:
      "Etansarile si lucrarile pentru infiltratii sunt potrivite pentru blocuri, cladiri de birouri si fatade cu probleme locale sau recurente.",
    icon: "shield-alert",
  },
  {
    name: "Etansare rosturi blocuri",
    slug: "etansare-rosturi-blocuri",
    category: "Fatade",
    shortDescription:
      "Etansare rosturi si fisuri la blocuri si cladiri de mari dimensiuni.",
    longDescription:
      "Etansarea rosturilor reduce pierderile termice si infiltratiile si este des ceruta la blocuri, imobile de birouri si ansambluri rezidentiale.",
    icon: "shield-check",
  },
  {
    name: "Reparatii acoperisuri",
    slug: "reparatii-acoperisuri",
    category: "Acoperisuri",
    shortDescription:
      "Reparatii acoperis, inlocuire tigla, hidroizolatii si interventii la jgheaburi si burlane.",
    longDescription:
      "Lucrarile la acoperisuri includ reparatii, inlocuire tigla, hidroizolatii, jgheaburi si burlane pentru imobile rezidentiale sau comerciale.",
    icon: "house",
  },
  {
    name: "Hidroizolatii acoperisuri",
    slug: "hidroizolatii-acoperisuri",
    category: "Acoperisuri",
    shortDescription:
      "Hidroizolatii pentru acoperisuri si terase greu accesibile, executate la inaltime.",
    longDescription:
      "Lucrarile de hidroizolatie la acoperis sunt utile pentru oprirea infiltratiilor si protectia pe termen lung a imobilelor expuse la apa.",
    icon: "droplets",
  },
  {
    name: "Jgheaburi si burlane",
    slug: "jgheaburi-si-burlane",
    category: "Acoperisuri",
    shortDescription:
      "Montaj, reparatii si inlocuire jgheaburi si burlane la cladiri cu acces dificil.",
    longDescription:
      "Serviciul acopera repararea si inlocuirea sistemelor de colectare a apei de pe acoperisuri rezidentiale si comerciale.",
    icon: "pipe",
  },
  {
    name: "Curatare jgheaburi",
    slug: "curatare-jgheaburi",
    category: "Acoperisuri",
    shortDescription:
      "Curatare jgheaburi si burlane pentru cladiri rezidentiale si comerciale cu acces dificil.",
    longDescription:
      "Curatarea jgheaburilor previne infiltratiile si blocajele si este recomandata periodic pentru acoperisuri si cladiri inalte.",
    icon: "droplets",
  },
  {
    name: "Montaj bannere",
    slug: "montaj-bannere",
    category: "Publicitate",
    shortDescription:
      "Montaj si demontaj bannere publicitare la inaltime pentru cladiri, santiere si fatade comerciale.",
    longDescription:
      "Montajul de bannere include prindere, ancorare, tensionare si demontare in conditii de siguranta pentru structuri greu accesibile.",
    icon: "flag",
  },
  {
    name: "Montaj mesh",
    slug: "montaj-mesh",
    category: "Publicitate",
    shortDescription:
      "Montaj si demontaj mesh publicitar pentru suprafete mari si campanii outdoor.",
    longDescription:
      "Serviciul include instalarea si mentenanta mesh-urilor publicitare pe cladiri, hale si suprafete verticale de mari dimensiuni.",
    icon: "square-dashed",
  },
  {
    name: "Montaj litere volumetrice",
    slug: "montaj-litere-volumetrice",
    category: "Publicitate",
    shortDescription:
      "Montaj si mentenanta pentru litere volumetrice, casete si elemente de branding exterior.",
    longDescription:
      "Serviciul acopera instalarea de litere volumetrice si elemente publicitare greu accesibile, inclusiv revizii si demontari.",
    icon: "type",
  },
  {
    name: "Montaj firme luminoase",
    slug: "montaj-firme-luminoase",
    category: "Publicitate",
    shortDescription:
      "Montaj si demontaj firme luminoase si casete publicitare la inaltime.",
    longDescription:
      "Firmele luminoase si casetele publicitare necesita montaj sigur pe fatade comerciale, cladiri inalte si spatii cu acces limitat.",
    icon: "badge",
  },
  {
    name: "Montaj plase protectie",
    slug: "montaj-plase-protectie",
    category: "Protectie",
    shortDescription:
      "Montaj plase de protectie pe versanti, fatade sau zone cu risc de desprinderi.",
    longDescription:
      "Interventiile cu plase de protectie sunt folosite pentru consolidari, siguranta si limitarea riscului in zone greu accesibile.",
    icon: "shield",
  },
  {
    name: "Consolidari taluzuri",
    slug: "consolidari-taluzuri",
    category: "Protectie",
    shortDescription:
      "Consolidari taluzuri, versanti si zone expuse la surpari sau desprinderi.",
    longDescription:
      "Serviciile pentru taluzuri si versanti includ ancorari, plase si alte interventii tehnice executate in conditii dificile.",
    icon: "triangle-alert",
  },
  {
    name: "Vopsitorii la inaltime",
    slug: "vopsitorii-la-inaltime",
    category: "Finisaje",
    shortDescription:
      "Vopsitorii exterioare la inaltime pentru fatade, elemente metalice si suprafete tehnice.",
    longDescription:
      "Vopsitoriile la inaltime acopera fatade, hale, cosuri, structuri metalice si alte suprafete cu acces dificil.",
    icon: "paintbrush",
  },
  {
    name: "Montaj antene",
    slug: "montaj-antene",
    category: "Tehnic",
    shortDescription:
      "Montaj si mentenanta antene, cabluri si echipamente tehnice pe cladiri, piloni si catarge.",
    longDescription:
      "Serviciul include instalare, verificare si mentenanta pentru antene si echipamente de telecomunicatii montate la inaltime.",
    icon: "radio-tower",
  },
  {
    name: "Montaj paratrasnet",
    slug: "montaj-paratrasnet",
    category: "Tehnic",
    shortDescription:
      "Montaj si verificare sisteme de paratrasnet pe cladiri inalte si hale.",
    longDescription:
      "Sistemele de paratrasnet necesita interventii la inaltime pentru instalare, mentenanta si inlocuire in conditii de siguranta.",
    icon: "zap",
  },
  {
    name: "Montaj panouri solare la inaltime",
    slug: "montaj-panouri-solare-la-inaltime",
    category: "Tehnic",
    shortDescription:
      "Montaj panouri solare si echipamente conexe pe acoperisuri si structuri greu accesibile.",
    longDescription:
      "Interventiile pentru panouri solare sunt potrivite pentru acoperisuri industriale, comerciale si rezidentiale unde accesul clasic este dificil.",
    icon: "sun",
  },
  {
    name: "Interventii pe piloni si catarge",
    slug: "interventii-pe-piloni-si-catarge",
    category: "Tehnic",
    shortDescription:
      "Lucrari de montaj si mentenanta pe piloni, catarge si structuri metalice inalte.",
    longDescription:
      "Piloni, catarge si alte structuri metalice necesita echipe specializate pentru inspectie, montaj si mentenanta la inaltime.",
    icon: "tower-control",
  },
  {
    name: "Inspectii tehnice vizuale",
    slug: "inspectii-tehnice-vizuale",
    category: "Inspectii",
    shortDescription:
      "Inspectii vizuale pentru poduri, cosuri, turnuri si alte structuri greu accesibile.",
    longDescription:
      "Inspectiile tehnice vizuale sunt utile pentru evaluarea rapida a starii unei structuri fara schela sau utilaje grele.",
    icon: "search-check",
  },
  {
    name: "Lucrari la cosuri industriale",
    slug: "lucrari-la-cosuri-industriale",
    category: "Industrial",
    shortDescription:
      "Interventii la cosuri industriale, turnuri de racire si structuri inalte speciale.",
    longDescription:
      "Cosurile industriale si structurile tehnice inalte necesita operatiuni specializate de inspectie, reparatie si protectie anticoroziva.",
    icon: "factory",
  },
  {
    name: "Interventii urgente la inaltime",
    slug: "interventii-urgente-la-inaltime",
    category: "Urgente",
    shortDescription:
      "Interventii rapide pentru desprinderi, infiltratii, elemente periculoase si situatii greu accesibile.",
    longDescription:
      "Interventiile urgente la inaltime sunt utile cand exista risc imediat pentru persoane, trafic sau proprietate.",
    icon: "siren",
  },
  {
    name: "Taiere copaci",
    slug: "taiere-copaci",
    category: "Arbori",
    shortDescription:
      "Taiere controlata pentru copaci cu risc, arbori uscati sau exemplare aflate langa imobile si cabluri.",
    longDescription:
      "Taierea copacilor cu risc necesita planificare si echipe care pot lucra controlat in spatii sensibile sau greu accesibile.",
    icon: "trees",
  },
  {
    name: "Toaletare copaci",
    slug: "toaletare-copaci",
    category: "Arbori",
    shortDescription:
      "Toaletare copaci, taiere controlata si interventii pentru arbori aflati in zone cu risc.",
    longDescription:
      "Serviciile de arboricultura includ toaletare copaci, doborare controlata si interventii pentru ramuri sau arbori periculosi.",
    icon: "tree-pine",
  },
  {
    name: "Doborare controlata arbori",
    slug: "doborare-controlata-arbori",
    category: "Arbori",
    shortDescription:
      "Doborare controlata pentru arbori periculosi sau aflati in apropierea cladirilor si cablurilor.",
    longDescription:
      "Doborarea controlata este folosita in spatii aglomerate, unde taierea clasica a arborilor nu poate fi realizata in siguranta.",
    icon: "axe",
  },
];
