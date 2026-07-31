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
    name: "Alpinism industrial greu",
    slug: "alpinism-industrial-greu",
    category: "Industrial",
    shortDescription:
      "Interventii complexe pe rafinarii, cosuri, hale, silozuri, structuri metalice si instalatii industriale.",
    longDescription:
      "Alpinismul industrial greu acopera lucrari cu acces pe coarda in obiective cu inaltimi mari, geometrii dificile si cerinte stricte de securitate: rafinarii, combinate, termocentrale, porturi, santiere navale, silozuri si hale industriale.",
    icon: "factory",
  },
  {
    name: "Inspectii NDT la inaltime",
    slug: "inspectii-ndt-la-inaltime",
    category: "Industrial",
    shortDescription:
      "Acces tehnic pentru inspectii vizuale si examinari nedistructive pe structuri industriale greu accesibile.",
    longDescription:
      "Serviciul faciliteaza inspectii tehnice si NDT la inaltime pe conducte, rezervoare, cosuri, macarale, poduri si structuri metalice, cu documentarea zonelor evaluate si coordonare cu personal autorizat pentru metoda de examinare.",
    icon: "scan-search",
  },
  {
    name: "Protectie anticoroziva la inaltime",
    slug: "protectie-anticoroziva-la-inaltime",
    category: "Industrial",
    shortDescription:
      "Pregatire, sablare locala si aplicare de sisteme anticorozive pe metal, conducte, turnuri si hale.",
    longDescription:
      "Protectia anticoroziva la inaltime include pregatirea controlata a suprafetelor si aplicarea sistemelor compatibile cu mediul de exploatare pe structuri metalice, conducte, rezervoare, turnuri si infrastructura portuara.",
    icon: "shield-check",
  },
  {
    name: "Mentenanta cosuri industriale",
    slug: "mentenanta-cosuri-industriale",
    category: "Industrial",
    shortDescription:
      "Inspectii, reparatii, etansari si interventii structurale pe cosuri industriale si turnuri de racire.",
    longDescription:
      "Mentenanta cosurilor industriale vizeaza inspectii ale anvelopei si elementelor metalice, reparatii locale, etansari, protectii anticorozive si acces pentru lucrari specializate la inaltimi extreme.",
    icon: "factory",
  },
  {
    name: "Mentenanta turbine eoliene",
    slug: "mentenanta-turbine-eoliene",
    category: "Industrial",
    shortDescription:
      "Inspectii vizuale si interventii de acces pe turnuri si pale de turbine eoliene.",
    longDescription:
      "Mentenanta turbinelor eoliene prin acces pe coarda poate include inspectarea turnului si palelor, documentarea defectelor, curatare tehnica si suport pentru reparatii de materiale compozite executate de personal calificat.",
    icon: "wind",
  },
  {
    name: "Mentenanta structuri metalice industriale",
    slug: "mentenanta-structuri-metalice-industriale",
    category: "Industrial",
    shortDescription:
      "Interventii pe hale, macarale, estacade, benzi transportoare si structuri metalice suspendate.",
    longDescription:
      "Serviciul acopera accesul si interventiile pe structuri metalice industriale: hale, macarale, estacade, poduri tehnologice, benzi transportoare, tubulaturi si retele suspendate.",
    icon: "construction",
  },
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
  {
    name: "Termoizolatii fatade la inaltime",
    slug: "termoizolatii-fatade-la-inaltime",
    category: "Fatade",
    shortDescription:
      "Montaj si reparatii de termosistem pe fatade greu accesibile, cu polistiren sau vata minerala.",
    longDescription:
      "Termoizolatiile de fatada la inaltime acopera placari locale sau continue, refacerea zonelor desprinse, armare, masa de spaclu si finisaj, folosind acces pe coarda acolo unde schela nu este practica.",
    icon: "layers",
  },
  {
    name: "Deszapezire acoperisuri",
    slug: "deszapezire-acoperisuri",
    category: "Servicii de iarna",
    shortDescription:
      "Indepartare controlata a zapezii de pe acoperisuri, terase si copertine cu acces dificil.",
    longDescription:
      "Deszapezirea acoperisurilor reduce supraincarcarea si riscul caderilor necontrolate de zapada, cu protejarea invelitorii, delimitarea zonei de la sol si evacuarea etapizata a masei de zapada.",
    icon: "snowflake",
  },
  {
    name: "Indepartare turturi si gheata",
    slug: "indepartare-turturi",
    category: "Servicii de iarna",
    shortDescription:
      "Eliminare rapida a turturilor si ghetii de pe cornise, jgheaburi si acoperisuri.",
    longDescription:
      "Indepartarea turturilor se realizeaza controlat deasupra trotuarelor, intrarilor si parcarilor, cu securizarea perimetrului si verificarea zonelor in care gheata se poate forma din nou.",
    icon: "snowflake",
  },
  {
    name: "Sisteme anti-pasari",
    slug: "sisteme-anti-pasari",
    category: "Protectie",
    shortDescription:
      "Montaj plase, tepi si sisteme discrete impotriva pasarilor pe fatade si acoperisuri.",
    longDescription:
      "Sistemele anti-pasari protejeaza balcoane, cornise, luminatoare, hale si instalatii tehnice prin solutii adaptate geometriei cladirii, fara blocarea ventilatiei sau a accesului pentru mentenanta.",
    icon: "shield",
  },
  {
    name: "Curatare panouri solare",
    slug: "curatare-panouri-solare",
    category: "Curatare",
    shortDescription:
      "Spalare controlata a panourilor fotovoltaice montate pe acoperisuri si structuri inalte.",
    longDescription:
      "Curatarea panourilor solare indeparteaza praf, polen si depuneri fara a zgaria sticla sau afecta cablurile, cu acces sigur pe acoperis si inspectarea vizuala a prinderilor accesibile.",
    icon: "sun",
  },
  {
    name: "Montaj structuri metalice la inaltime",
    slug: "montaj-structuri-metalice-la-inaltime",
    category: "Montaj industrial",
    shortDescription:
      "Asamblare si demontare controlata de structuri metalice in zone inalte sau greu accesibile.",
    longDescription:
      "Montajul structurilor metalice la inaltime include pozitionarea elementelor, prinderi, ajustari si demontari etapizate pe hale, fatade, estacade si suporturi tehnice, in coordonare cu proiectul si operatiunile de ridicare.",
    icon: "construction",
  },
  {
    name: "Vopsire acoperisuri",
    slug: "vopsire-acoperisuri",
    category: "Acoperisuri",
    shortDescription:
      "Pregatire si vopsire a invelitorilor metalice pe acoperisuri cu acces dificil.",
    longDescription:
      "Vopsirea acoperisurilor presupune curatarea suportului, tratarea punctelor de coroziune si aplicarea unui sistem compatibil cu tabla existenta, cu atentie la rosturi, coame si zonele de evacuare a apei.",
    icon: "paintbrush",
  },
  {
    name: "Curatare acoperisuri si cupole",
    slug: "curatare-acoperisuri-si-cupole",
    category: "Curatare",
    shortDescription:
      "Curatare depuneri, vegetatie si murdarie de pe acoperisuri, cupole si luminatoare.",
    longDescription:
      "Curatarea acoperisurilor si cupolelor reda functionarea corecta a scurgerilor si suprafetelor vitrate, folosind metode adaptate materialului pentru a evita deteriorarea membranelor, tablei sau policarbonatului.",
    icon: "sparkles",
  },
  {
    name: "Curatare hale industriale",
    slug: "curatare-hale-industriale",
    category: "Industrial",
    shortDescription:
      "Curatare la inaltime pentru grinzi, ferme, pereti si instalatii din hale industriale.",
    longDescription:
      "Curatarea halelor industriale vizeaza praful si depunerile de pe structura, luminatoare, tubulaturi si suprafete greu accesibile, cu plan de lucru adaptat activitatii si restrictiilor din amplasament.",
    icon: "factory",
  },
  {
    name: "Montaj aer conditionat la inaltime",
    slug: "montaj-aer-conditionat-la-inaltime",
    category: "Instalatii",
    shortDescription:
      "Acces si montaj pentru unitati exterioare, trasee frigorifice si suporturi pe fatade inalte.",
    longDescription:
      "Montajul aparatelor de aer conditionat la inaltime faciliteaza instalarea sau inlocuirea unitatilor exterioare in pozitii inaccesibile, impreuna cu fixarea suporturilor si organizarea traseelor de instalatii.",
    icon: "fan",
  },
  {
    name: "Montaj linii de viata",
    slug: "montaj-linii-de-viata",
    category: "Siguranta",
    shortDescription:
      "Instalare sisteme permanente de ancorare si protectie pentru accesul sigur pe acoperisuri.",
    longDescription:
      "Montajul liniilor de viata creeaza trasee de protectie pentru personalul care efectueaza inspectii si mentenanta, pe baza configuratiei cladirii si a unei solutii tehnice compatibile cu suportul existent.",
    icon: "shield-check",
  },
  {
    name: "Montaj geamuri si pereti cortina",
    slug: "montaj-geamuri-si-pereti-cortina",
    category: "Fatade vitrate",
    shortDescription:
      "Montaj, inlocuire si reglaj pentru panouri vitrate si elemente de perete cortina.",
    longDescription:
      "Interventiile pe pereti cortina includ accesul pentru inlocuirea geamurilor, presarea garniturilor, remontarea capacelor si etansari locale, cu manipularea controlata a elementelor vitrate.",
    icon: "panels-top-left",
  },
  {
    name: "Montaj decoratiuni la inaltime",
    slug: "montaj-decoratiuni-la-inaltime",
    category: "Montaj",
    shortDescription:
      "Instalare si demontare decoratiuni luminoase, ghirlande si elemente tematice pe cladiri.",
    longDescription:
      "Montajul decoratiunilor la inaltime acopera fixarea, alimentarea organizata si demontarea elementelor sezoniere pe fatade, piete comerciale si structuri urbane, cu verificarea prinderilor expuse la vant.",
    icon: "sparkles",
  },
  {
    name: "Reparatii balcoane la inaltime",
    slug: "reparatii-balcoane-la-inaltime",
    category: "Fatade",
    shortDescription:
      "Reparatii exterioare pentru placi, muchii, glafuri si finisaje degradate ale balcoanelor.",
    longDescription:
      "Reparatiile balcoanelor la inaltime trateaza local betonul degradat, muchiile desprinse, fisurile si etansarile exterioare, dupa eliminarea elementelor instabile si evaluarea suportului accesibil.",
    icon: "hammer",
  },
  {
    name: "Curatare si mentenanta silozuri",
    slug: "curatare-si-mentenanta-silozuri",
    category: "Industrial",
    shortDescription:
      "Acces specializat pentru curatarea si intretinerea silozurilor si recipientelor industriale.",
    longDescription:
      "Curatarea si mentenanta silozurilor se planifica in functie de materialul depozitat, geometrie si riscurile procesului, incluzand acces, indepartarea depunerilor si inspectarea vizuala a zonelor expuse.",
    icon: "factory",
  },
  {
    name: "Lucrari in spatii confinate",
    slug: "lucrari-in-spatii-confinate",
    category: "Industrial",
    shortDescription:
      "Interventii controlate in rezervoare, puturi si incinte cu acces limitat si ventilatie redusa.",
    longDescription:
      "Lucrarile in spatii confinate necesita evaluarea atmosferei, supraveghere, comunicare si plan de salvare dedicat, pentru inspectii, curatare sau mentenanta in incinte cu intrari si iesiri limitate.",
    icon: "scan-search",
  },
  {
    name: "Montaj tubulaturi industriale",
    slug: "montaj-tubulaturi-industriale",
    category: "Industrial",
    shortDescription:
      "Montaj si demontaj de tubulaturi, trasee si suporturi suspendate in obiective industriale.",
    longDescription:
      "Montajul tubulaturilor industriale prin acces pe coarda permite pozitionarea segmentelor, suporturilor si accesoriilor in zone unde platformele nu ajung, cu integrarea lucrarii in planul tehnic al instalatiei.",
    icon: "pipe",
  },
  {
    name: "Inspectii foto-video la inaltime",
    slug: "inspectii-foto-video-la-inaltime",
    category: "Inspectii",
    shortDescription:
      "Documentare foto-video detaliata pentru fatade, acoperisuri si structuri greu accesibile.",
    longDescription:
      "Inspectiile foto-video la inaltime ofera imagini localizate ale fisurilor, coroziunii, infiltratiilor si prinderilor, utile pentru evaluare preliminara, planificarea reparatiilor si urmarirea in timp a degradarilor.",
    icon: "camera",
  },
  {
    name: "Mentenanta poduri si viaducte",
    slug: "mentenanta-poduri-si-viaducte",
    category: "Infrastructura",
    shortDescription:
      "Acces pentru inspectii si interventii pe grinzi, pile, tabliere si elemente greu accesibile.",
    longDescription:
      "Mentenanta podurilor si viaductelor prin acces pe coarda sprijina inspectarea, curatarea si reparatiile locale sub tablier sau pe pile, reducand necesarul de echipamente amplasate pe carosabil.",
    icon: "construction",
  },
  {
    name: "Interventii portuare si navale",
    slug: "interventii-portuare-si-navale",
    category: "Industrial",
    shortDescription:
      "Lucrari la inaltime pe macarale portuare, nave, silozuri si structuri expuse mediului marin.",
    longDescription:
      "Interventiile portuare si navale includ acces pentru inspectii, protectii anticorozive, montaj si reparatii locale pe structuri cu geometrii dificile, planificate in jurul operatiunilor din port sau santier naval.",
    icon: "anchor",
  },
];
