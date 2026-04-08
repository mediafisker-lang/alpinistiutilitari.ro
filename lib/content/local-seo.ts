import type { CountyDetail, CityDetail, ServiceDetail } from "@/lib/data/types";

export type FaqItem = {
  question: string;
  answer: string;
};

export function buildCountyFaqs(county: CountyDetail): FaqItem[] {
  return county.faqs.length
    ? county.faqs.map((item) => ({ question: item.question, answer: item.answer }))
    : [
        {
          question: `Cum aleg o firmă de alpinism utilitar în ${county.name}?`,
          answer:
            "Compară serviciile afișate, localizarea, claritatea profilului și tipul lucrărilor pe care le poți cere. Platforma centralizează cererea și o procesează intern.",
        },
        {
          question: `Pot cere ofertă pentru mai multe lucrări în ${county.name}?`,
          answer:
            "Da. În formular poți descrie proiectul complet, iar administratorul stabilește manual firmele candidate în funcție de județ, oraș și serviciu.",
        },
      ];
}

export function buildCityFaqs(city: CityDetail): FaqItem[] {
  return city.faqs.length
    ? city.faqs.map((item) => ({ question: item.question, answer: item.answer }))
    : [
        {
          question: `Ce tipuri de lucrări se caută frecvent în ${city.name}?`,
          answer:
            "Cele mai frecvente cereri sunt pentru fațade, geamuri la înălțime, bannere, acoperișuri și intervenții punctuale în zone greu accesibile.",
        },
        {
          question: `Cum ajunge cererea mea la firmele din ${city.name}?`,
          answer:
            "Cererea este salvată intern și analizată de administrator. Apoi sunt contactați manual executanții potriviți, nu există trimitere automată.",
        },
      ];
}

export function buildServiceFaqs(service: ServiceDetail): FaqItem[] {
  return service.faqs.length
    ? service.faqs.map((item) => ({ question: item.question, answer: item.answer }))
    : [
        {
          question: `Când ai nevoie de ${service.name.toLowerCase()}?`,
          answer:
            "Atunci când lucrarea trebuie executată la înălțime, în spații greu accesibile sau când soluțiile clasice precum schela și nacela nu sunt eficiente ori rapide.",
        },
        {
          question: "Cum aleg serviciul corect înainte să trimit cererea?",
          answer:
            "Alege serviciul care se potrivește cel mai bine lucrării. Dacă nu ești sigur, descrie problema cât mai clar și administratorul o clasifică intern înainte de ofertare.",
        },
      ];
}

export function buildCountyIntro(county: CountyDetail) {
  return `În ${county.name} există cerere constantă pentru intervenții la înălțime, de la lucrări pe acoperișuri și fațade până la bannere, geamuri și arboricultură. Pagina aceasta centralizează firme active, orașe relevante și servicii comerciale căutate des în județ.`;
}

export function buildCityIntro(city: CityDetail) {
  return `${city.name} este o zonă în care apar frecvent solicitări pentru lucrări la înălțime, mentenanță exterioară și intervenții rapide. Aici găsești firme listate local și poți trimite o singură cerere pentru proiectul tău.`;
}

export function buildServiceCommercialBlocks(service: ServiceDetail) {
  return [
    {
      title: "Când este util acest serviciu",
      content:
        "Este potrivit pentru proiecte unde accesul este dificil, timpul de execuție contează și ai nevoie de echipe care pot interveni fără montaj extins de schelă.",
    },
    {
      title: "Pentru ce tipuri de clădiri sau spații",
      content:
        "Clădiri rezidențiale, birouri, centre comerciale, hale, turnuri, structuri metalice, spații industriale și zone tehnice greu accesibile.",
    },
    {
      title: "Cum te ajută platforma",
      content:
        "Selectezi serviciul, județul și orașul, descrii lucrarea și platforma centralizează cererea pentru analiză și selecție manuală a executanților potriviți.",
    },
  ];
}

export function buildLocalLandingCopy(locationName: string, serviceName: string, type: "county" | "city") {
  const scopeText =
    type === "city"
      ? `pentru proiecte punctuale din ${locationName}`
      : `pentru proiecte la nivel de județ în ${locationName}`;

  return {
    lead:
      `Pagina locală este optimizată pentru căutări comerciale reale precum „${serviceName.toLowerCase()} ${locationName.toLowerCase()}” și prezintă firme relevante ${scopeText}.`,
    why:
      "Poți compara mai rapid opțiunile listate, vezi ce servicii sunt asociate și trimiți o singură cerere către platformă, fără să contactezi separat mai multe firme.",
    cta:
      "Dacă lucrarea este urgentă, completează formularul cu detalii și poze. Cererea se salvează intern și este analizată manual înainte de ofertare.",
  };
}
