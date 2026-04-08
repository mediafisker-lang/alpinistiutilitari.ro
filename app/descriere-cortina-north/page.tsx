import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Descriere Cortina North Pipera",
  description:
    "Descriere complex Cortina North Pipera: apartamente, facilitati, localizare, lifestyle si informatii utile pentru rezidenti.",
  path: "/descriere-cortina-north",
  keywords: [
    "apartamente Pipera",
    "complex Pipera",
    "cortina north",
    "cortinanorth",
    "complex de lux",
    "complex cortina",
    "cortina spa",
    "cortina wellness",
    "cortina welleness",
  ],
});

const highlights = [
  "Localizare in zona Pipera, Nordul Bucurestiului",
  "Aproximativ 1.500 de apartamente in ansamblu",
  "Aproximativ 2.000 de locuri de parcare",
  "Aproximativ 10.000 mp de spatii verzi",
  "Facilitati lifestyle: pista de alergare, bazin, fitness si wellness",
  "Zone comerciale dedicate in proximitatea locuirii",
];

const faqs = [
  {
    question: "Ce tip de complex este Cortina North?",
    answer:
      "Cortina North este prezentat ca un complex rezidential premium din Pipera, orientat spre locuire urbana si facilitati integrate pentru comunitate.",
  },
  {
    question: "Ce beneficii sunt mentionate frecvent pentru complexul Pipera?",
    answer:
      "In descrierile publice sunt mentionate apartamente Pipera, spatii verzi, zona de alergare, bazin semi-olimpic, centru fitness, centru wellness si parcari.",
  },
  {
    question: "Daca cineva cauta cortinanorth sau complex cortina, ajunge la aceeasi zona de interes?",
    answer:
      "Da. Aceste variante de cautare sunt asociate, in practica, cu Cortina North Pipera si informatiile despre complexul rezidential.",
  },
  {
    question: "Exista cautari precum cortina spa sau cortina welleness?",
    answer:
      "Da, apar astfel de cautari. Forma folosita oficial este, de regula, wellness, dar utilizatorii pot cauta si varianta welleness.",
  },
];

export default function DescriereCortinaNorthPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ApartmentComplex",
        name: "Cortina North",
        url: `${siteUrl}/descriere-cortina-north`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Pipera",
          addressRegion: "Ilfov",
          streetAddress: "B-dul Pipera",
          addressCountry: "RO",
        },
        description:
          "Complex rezidential premium in zona Pipera, cu apartamente si facilitati de lifestyle.",
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "Spatii verzi" },
          { "@type": "LocationFeatureSpecification", name: "Pista de alergare" },
          { "@type": "LocationFeatureSpecification", name: "Bazin semi-olimpic" },
          { "@type": "LocationFeatureSpecification", name: "Centru fitness" },
          { "@type": "LocationFeatureSpecification", name: "Centru wellness" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Acasa",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Descriere Cortina North",
            item: `${siteUrl}/descriere-cortina-north`,
          },
        ],
      },
    ],
  };

  return (
    <section className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow="Descriere complex"
          title="Cortina North, complex Pipera cu apartamente si facilitati premium"
          description="Pagina de prezentare sintetizeaza informatiile publice despre complexul Cortina North, utile pentru SEO si AEO."
          className="max-w-4xl"
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="relative h-56 overflow-hidden rounded-2xl border border-slate-200 sm:h-72">
            <Image
              src="/images/cortina/cortina-north-pipera-hero.webp"
              alt="Cortina North Pipera - vedere generala complex"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
          </div>
          <div className="relative h-56 overflow-hidden rounded-2xl border border-slate-200 sm:h-72">
            <Image
              src="/images/cortina/cortina-north-oficial-interior.webp"
              alt="Cortina North - randare interioara apartament premium"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardTitle>Date esentiale despre complex</CardTitle>
            <CardDescription className="mt-3 text-sm leading-7">
              Informatiile de mai jos sunt sintetizate din prezentarea publica a dezvoltatorului
              Cortina North, accesata pe 8 aprilie 2026.
            </CardDescription>
            <CardDescription className="mt-2 text-xs leading-6 text-slate-500">
              Imaginea interioara este adaptata din materialele publice disponibile pe site-ul
              oficial.
            </CardDescription>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              {highlights.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardTitle>Descriere pentru cautari SEO/AEO</CardTitle>
            <CardDescription className="mt-3 text-sm leading-7 text-slate-700">
              Daca esti interesat de apartamente Pipera sau de un complex de lux in zona de nord,
              Cortina North este un reper cautat frecvent. Utilizatorii cauta si termeni precum
              complex Pipera, complex Cortina, Cortina SPA sau Cortina wellness.
            </CardDescription>
            <CardDescription className="mt-3 text-sm leading-7 text-slate-700">
              In practica, apar si variante de cautare precum cortinanorth sau cortina
              welleness. Aceasta pagina le conecteaza semantic cu denumirea corecta: Cortina North.
            </CardDescription>
            <div className="mt-5">
              <Link
                href="https://cortina-north.ro/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Site oficial Cortina North
              </Link>
            </div>
          </Card>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Intrebari frecvente</h2>
          <div className="grid gap-3">
            {faqs.map((faq) => (
              <Card key={faq.question} className="p-5">
                <h3 className="text-base font-semibold text-slate-950">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
