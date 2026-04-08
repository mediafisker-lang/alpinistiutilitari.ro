import { PrismaClient, VerificationStatus } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";
import { serviceArticleSeeds } from "../lib/content/service-articles";

const prisma = new PrismaClient();

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  await prisma.adminSession.deleteMany();
  await prisma.leadRequestEvent.deleteMany();
  await prisma.leadRequestNote.deleteMany();
  await prisma.leadRequestImage.deleteMany();
  await prisma.leadRequest.deleteMany();
  await prisma.googlePlaceCategoryMap.deleteMany();
  await prisma.companyImportEvent.deleteMany();
  await prisma.companyImportRun.deleteMany();
  await prisma.articleService.deleteMany();
  await prisma.companyService.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.company.deleteMany();
  await prisma.article.deleteMany();
  await prisma.service.deleteMany();
  await prisma.city.deleteMany();
  await prisma.county.deleteMany();
  await prisma.adminUser.deleteMany();

  const countiesInput = [
    {
      name: "Bucuresti",
      slug: "bucuresti",
      shortCode: "B",
      intro:
        "Firme de alpinism utilitar din Bucuresti pentru lucrari la inaltime, fatade, bannere si interventii rapide.",
      seoTitle: "Firme de alpinism utilitar in Bucuresti",
      seoDescription:
        "Gasesti rapid firme de alpinism utilitar in Bucuresti pentru fatade, geamuri, bannere si lucrari la inaltime.",
      cities: ["Bucuresti"],
    },
    {
      name: "Brasov",
      slug: "brasov",
      shortCode: "BV",
      intro:
        "Servicii de alpinism utilitar in Brasov pentru cladiri comerciale, rezidentiale si proiecte tehnice.",
      seoTitle: "Alpinism utilitar Brasov",
      seoDescription:
        "Firme din Brasov pentru lucrari la inaltime, geamuri, fatade si mentenanta exterioara.",
      cities: ["Brasov", "Sacele"],
    },
    {
      name: "Cluj",
      slug: "cluj",
      shortCode: "CJ",
      intro:
        "Companii din Cluj pentru interventii la inaltime, acoperisuri, bannere si inspectii tehnice.",
      seoTitle: "Firme de alpinism utilitar Cluj",
      seoDescription:
        "Gasesti firme de alpinism utilitar in Cluj-Napoca si in restul judetului Cluj.",
      cities: ["Cluj-Napoca", "Turda"],
    },
    {
      name: "Ilfov",
      slug: "ilfov",
      shortCode: "IF",
      intro:
        "Companii care acopera Ilfov pentru lucrari la inaltime, arbori, bannere si reparatii exterioare.",
      seoTitle: "Firme alpinism utilitar Ilfov",
      seoDescription:
        "Vezi firme de alpinism utilitar care lucreaza in Ilfov, Voluntari, Otopeni si imprejurimi.",
      cities: [
        "Voluntari",
        "Otopeni",
        "Pantelimon",
        "Chiajna",
        "Bragadiru",
        "Popesti-Leordeni",
        "Magurele",
        "Dobroiesti",
        "Stefanestii de Jos",
        "Caldararu",
      ],
    },
  ];

  const counties = await Promise.all(
    countiesInput.map((county) =>
      prisma.county.create({
        data: {
          name: county.name,
          slug: county.slug,
          shortCode: county.shortCode,
          intro: county.intro,
          introText: county.intro,
          seoTitle: county.seoTitle,
          seoDescription: county.seoDescription,
          isActive: true,
          cities: {
            create: county.cities.map((city) => ({
              name: city,
              slug: slugify(city),
              intro: `Pagina locala pentru ${city} si servicii de alpinism utilitar.`,
              introText: `Pagina locala pentru ${city} si servicii de alpinism utilitar.`,
              seoTitle: `Alpinism utilitar ${city}`,
              seoDescription: `Firme de alpinism utilitar din ${city} si servicii comerciale locale.`,
              isActive: true,
            })),
          },
        },
      }),
    ),
  );

  const servicesInput = [
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
      name: "Etansari si infiltratii",
      slug: "etansari-si-infiltratii",
      category: "Fatade",
      shortDescription:
        "Etansari la inaltime pentru rosturi, fisuri, infiltratii si zone expuse la apa.",
      longDescription:
        "Etansarile si lucrarile pentru infiltratii sunt potrivite pentru blocuri, cladiri de birouri si fatade cu probleme locale sau recurente.",
      icon: "shield-alert",
    },
  ];

  const services = await Promise.all(
    servicesInput.map((service) =>
      prisma.service.create({
        data: {
          ...service,
          seoTitle: `${service.name} in Romania`,
          seoDescription: service.shortDescription,
          isActive: true,
        },
      }),
    ),
  );

  const cityBucuresti = await prisma.city.findUniqueOrThrow({ where: { slug: "bucuresti" } });
  const cityBrasov = await prisma.city.findUniqueOrThrow({ where: { slug: "brasov" } });
  const cityVoluntari = await prisma.city.findUniqueOrThrow({ where: { slug: "voluntari" } });

  const companies = await Promise.all([
    prisma.company.create({
      data: {
        countyId: counties[0].id,
        cityId: cityBucuresti.id,
        name: "Altitudine Utilitara Bucuresti",
        slug: "altitudine-utilitara-bucuresti",
        legalName: "Altitudine Utilitara SRL",
        cui: "RO41234567",
        registrationNumber: "J40/1234/2019",
        descriptionShort:
          "Echipa din Bucuresti pentru alpinism utilitar, bannere, spalare geamuri si reparatii rapide la inaltime.",
        descriptionLong:
          "Altitudine Utilitara Bucuresti executa lucrari la inaltime pentru cladiri de birouri, fatade comerciale si proiecte tehnice.",
        website: "https://altitudine-utilitara.ro",
        email: "oferta@altitudine-utilitara.ro",
        phone: "0722000001",
        whatsapp: "40722000001",
        address: "Bulevardul Iuliu Maniu 7, Bucuresti",
        latitude: 44.434,
        longitude: 26.046,
        sourceType: "manual",
        source: "seed",
        googleMapsUrl: "https://maps.google.com/?q=Altitudine+Utilitara+Bucuresti",
        ratingValue: 4.9,
        ratingCount: 19,
        manuallyEditedAt: new Date(),
        foundedYear: 2019,
        isVerified: true,
        verificationStatus: VerificationStatus.verified,
        isFeatured: true,
        isActive: true,
        isPublished: true,
        services: {
          create: [
            { serviceId: services.find((service) => service.slug === "reparatii-acoperisuri")!.id },
            { serviceId: services.find((service) => service.slug === "montaj-bannere")!.id },
            { serviceId: services.find((service) => service.slug === "spalare-geamuri-la-inaltime")!.id },
          ],
        },
        coverage: {
          create: [
            { countyId: counties[0].id, cityId: cityBucuresti.id, isPrimary: true },
            { countyId: counties[3].id },
          ],
        },
      },
    }),
    prisma.company.create({
      data: {
        countyId: counties[1].id,
        cityId: cityBrasov.id,
        name: "Vertical Fix Brasov",
        slug: "vertical-fix-brasov",
        legalName: "Vertical Fix Expert SRL",
        cui: "RO39876543",
        registrationNumber: "J08/456/2018",
        descriptionShort:
          "Firma din Brasov pentru fatade, etansari, geamuri si interventii de mentenanta la inaltime.",
        descriptionLong:
          "Vertical Fix Brasov lucreaza cu echipe specializate pentru reabilitare exterioara, curatare si reparatii de fatade.",
        website: "https://verticalfix.ro",
        email: "contact@verticalfix.ro",
        phone: "0733000002",
        address: "Strada Harmanului 12, Brasov",
        latitude: 45.658,
        longitude: 25.601,
        sourceType: "manual",
        source: "seed",
        googleMapsUrl: "https://maps.google.com/?q=Vertical+Fix+Brasov",
        ratingValue: 4.8,
        ratingCount: 11,
        manuallyEditedAt: new Date(),
        foundedYear: 2018,
        isVerified: true,
        verificationStatus: VerificationStatus.verified,
        isFeatured: true,
        isActive: true,
        isPublished: true,
        services: {
          create: [
            { serviceId: services.find((service) => service.slug === "spalare-fatade")!.id },
            { serviceId: services.find((service) => service.slug === "spalare-geamuri-la-inaltime")!.id },
            { serviceId: services.find((service) => service.slug === "reparatii-fatade")!.id },
          ],
        },
        coverage: {
          create: [{ countyId: counties[1].id, cityId: cityBrasov.id, isPrimary: true }],
        },
      },
    }),
    prisma.company.create({
      data: {
        countyId: counties[3].id,
        cityId: cityVoluntari.id,
        name: "Arbori Control Ilfov",
        slug: "arbori-control-ilfov",
        legalName: "Arbori Control Team SRL",
        cui: "RO42765432",
        registrationNumber: "J23/987/2020",
        descriptionShort:
          "Interventii pentru arbori, bannere si lucrari la inaltime in Ilfov, Voluntari, Otopeni si nordul Capitalei.",
        descriptionLong:
          "Arbori Control Ilfov preia solicitari din Ilfov pentru toaletare arbori, montaj bannere si servicii rapide la inaltime.",
        website: "https://arboricontrol.ro",
        email: "hello@arboricontrol.ro",
        phone: "0744000003",
        address: "Soseaua Pipera 45, Voluntari",
        latitude: 44.495,
        longitude: 26.117,
        sourceType: "manual",
        source: "seed",
        googleMapsUrl: "https://maps.google.com/?q=Arbori+Control+Ilfov",
        ratingValue: 4.6,
        ratingCount: 7,
        manuallyEditedAt: new Date(),
        foundedYear: 2020,
        isVerified: false,
        verificationStatus: VerificationStatus.pending,
        isActive: true,
        isPublished: true,
        services: {
          create: [
            { serviceId: services.find((service) => service.slug === "montaj-bannere")!.id },
            { serviceId: services.find((service) => service.slug === "toaletare-copaci")!.id },
            { serviceId: services.find((service) => service.slug === "taiere-copaci")!.id },
          ],
        },
        coverage: {
          create: [
            { countyId: counties[3].id, cityId: cityVoluntari.id, isPrimary: true },
            { countyId: counties[0].id },
          ],
        },
      },
    }),
  ]);

  await Promise.all([
    prisma.article.create({
      data: {
        title: "Cum alegi o firma de alpinism utilitar in Bucuresti",
        slug: "cum-alegi-o-firma-de-alpinism-utilitar-in-bucuresti",
        excerpt:
          "Ghid scurt pentru compararea firmelor dupa servicii, timp de raspuns, zona acoperita si verificare profil.",
        content:
          "Atunci cand cauti o firma de alpinism utilitar in Bucuresti, verifica daca are servicii clare, zona acoperita, mod de contact rapid si un profil bine structurat.",
        seoTitle: "Cum alegi o firma de alpinism utilitar in Bucuresti",
        seoDescription:
          "Ghid local pentru alegerea unei firme de alpinism utilitar in Bucuresti.",
        isPublished: true,
        coverImageUrl: "/images/blog/ghid-firma.jpg",
        services: {
          create: [{ serviceId: services.find((service) => service.slug === "reparatii-acoperisuri")!.id }],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "Cand ai nevoie de spalare geamuri la inaltime",
        slug: "cand-ai-nevoie-de-spalare-geamuri-la-inaltime",
        excerpt:
          "Situatii tipice in care spalarea geamurilor la inaltime devine necesara pentru birouri si imobile comerciale.",
        content:
          "Spalarea geamurilor la inaltime este importanta pentru cladiri de birouri, showroom-uri si ansambluri cu fatade vitrate greu accesibile.",
        seoTitle: "Cand ai nevoie de spalare geamuri la inaltime",
        seoDescription:
          "Afla cand este momentul potrivit pentru o interventie profesionala de spalare geamuri la inaltime.",
        isPublished: true,
        coverImageUrl: "/images/blog/geamuri-inaltime.jpg",
        services: {
          create: [{ serviceId: services.find((service) => service.slug === "spalare-geamuri-la-inaltime")!.id }],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "Cand ai nevoie de toaletare copaci cu alpinisti utilitari",
        slug: "cand-ai-nevoie-de-toaletare-copaci-cu-alpinisti-utilitari",
        excerpt:
          "Cum identifici arborii cu risc si cand este momentul potrivit pentru o interventie controlata in oras.",
        content:
          "Toaletarea copacilor cu risc este recomandata in apropierea blocurilor, caselor, cablurilor sau drumurilor aglomerate. Alegerea unei firme potrivite reduce riscul si ajuta la organizarea lucrarii in siguranta.",
        seoTitle: "Cand ai nevoie de toaletare copaci cu alpinisti utilitari",
        seoDescription:
          "Afla cand este necesara toaletarea copacilor cu risc si cum alegi firma potrivita.",
        coverImageUrl: "/images/blog/toaletare-copaci.jpg",
        isPublished: true,
        services: {
          create: [{ serviceId: services.find((service) => service.slug === "toaletare-copaci")!.id }],
        },
      },
    }),
    ...serviceArticleSeeds.map((article) =>
      prisma.article.create({
        data: {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          seoTitle: article.seoTitle,
          seoDescription: article.seoDescription,
          coverImageUrl: article.coverImageUrl,
          isPublished: true,
          services: {
            create: [
              {
                serviceId: services.find((service) => service.slug === article.serviceSlug)!.id,
              },
            ],
          },
        },
      }),
    ),
  ]);

  await Promise.all([
    prisma.fAQ.create({
      data: {
        question: "Cum aleg o firma de alpinism utilitar?",
        answer:
          "Verifica serviciile listate, zona acoperita, claritatea profilului si modul in care este prezentata solicitarea ta comerciala.",
        countyId: counties[0].id,
        pageType: "county",
        pageRefId: counties[0].id,
        sortOrder: 1,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "Pot trimite o singura cerere pentru mai multe firme?",
        answer:
          "Da. Formularul unic este gandit pentru centralizarea interna a cererii si selectie manuala a firmelor potrivite.",
        serviceId: services.find((service) => service.slug === "reparatii-acoperisuri")!.id,
        pageType: "service",
        pageRefId: services.find((service) => service.slug === "reparatii-acoperisuri")!.id,
        sortOrder: 1,
      },
    }),
  ]);

  const createdLeads = await Promise.all([
    prisma.leadRequest.create({
      data: {
        companyId: companies[0].id,
        fullName: "Alexandru Popescu",
        phone: "0711111111",
        email: "alex@example.com",
        countyId: counties[0].id,
        cityId: cityBucuresti.id,
        address: "Bulevardul Timisoara 20, Bucuresti",
        serviceId: services.find((service) => service.slug === "montaj-bannere")!.id,
        urgency: "urgent",
        description:
          "Am nevoie de montaj banner pe o cladire comerciala cu 6 niveluri. Lucrarea este urgenta.",
        gdprAccepted: true,
        attachmentsJson: [],
        status: "noua",
        clientContacted: false,
        executantsContacted: false,
        sourcePage: "/firma/altitudine-utilitara-bucuresti",
        events: {
          create: [
            {
              type: "created",
              payloadJson: { source: "seed" },
            },
          ],
        },
      },
    }),
    prisma.leadRequest.create({
      data: {
        companyId: companies[1].id,
        fullName: "Irina Matei",
        phone: "0722222222",
        countyId: counties[1].id,
        cityId: cityBrasov.id,
        address: "Strada Saturn 10, Brasov",
        serviceId: services.find((service) => service.slug === "spalare-fatade")!.id,
        urgency: "normal",
        description:
          "Solicit curatare si spalare fatada pentru un showroom cu geamuri mari si acces dificil.",
        gdprAccepted: true,
        attachmentsJson: [],
        status: "in_analiza",
        clientContacted: true,
        executantsContacted: true,
        resultSummary: "Doua firme candidate identificate pentru follow-up.",
        sourcePage: "/contact",
        events: {
          create: [
            {
              type: "created",
              payloadJson: { source: "seed" },
            },
            {
              type: "status_changed",
              payloadJson: { status: "in_analiza" },
            },
          ],
        },
      },
    }),
  ]);

  await prisma.leadCompanySelection.createMany({
    data: [
      { leadRequestId: createdLeads[0].id, companyId: companies[0].id },
      { leadRequestId: createdLeads[0].id, companyId: companies[2].id },
      { leadRequestId: createdLeads[1].id, companyId: companies[1].id },
    ],
    skipDuplicates: true,
  });

  const admin = await prisma.adminUser.create({
    data: {
      email: "admin@alpinistiutilitari.ro",
      passwordHash: hashPassword("Admin1234!"),
      role: "admin",
    },
  });

  await prisma.leadRequestNote.create({
    data: {
      leadRequestId: (
        await prisma.leadRequest.findFirstOrThrow({ where: { fullName: "Irina Matei" } })
      ).id,
      adminUserId: admin.id,
      note: "Cererea pare potrivita pentru doua firme din Brasov. Urmeaza contactarea lor.",
    },
  });

  await Promise.all(
    [
      "roofing_contractor",
      "window_cleaning_service",
      "tree_service",
      "general_contractor",
      "advertising_agency",
      "sign_shop",
      "painter",
    ].map((placeType, index) =>
      prisma.googlePlaceCategoryMap.create({
        data: {
          placeType,
          serviceId: services[Math.min(index, services.length - 1)].id,
          confidence: 0.7,
        },
      }),
    ),
  );
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
