"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const roleBullets = [
  "organizarea initiala a comunitatii",
  "convocarea proprietarilor pe 14 februarie 2025 si pe 4 martie 2025",
  "solicitarea de oferte pentru consultanta juridica si selectarea unei echipe, dupa supunerea la vot catre comunitate a ofertelor",
  "structurarea procesului de constituire si adaptarea documentatiei primite la problemele, nevoile si feedback-ul primit din partea comunitatii pe acte",
  "identificarea solutiilor pentru blocajele institutionale",
  "reluarea initiativei in momentele de stagnare",
  "mentinerea transparentei procesului prin comunicari periodice cu comunitatea si membrii individuali",
];

const timeline = [
  {
    title: "Aug - Dec 2024",
    paragraphs: [
      "Implicare activa in grupul comunitatii Cortina North, oferind solutii si coordonand discutii privind problemele ansamblului.",
    ],
  },
  {
    title: "Ianuarie 2025",
    paragraphs: [
      "In urma votului intr-o comunitate de peste 1000 membri, am fost desemnata sa coordonez initiativa de infiintare a Asociatiei de Proprietari.",
      "Am format un comitet de initiativa format din proprietari voluntari.",
    ],
  },
  {
    title: "Februarie 2025",
    paragraphs: [
      "Initiativa a trecut din zona de intentie in zona de actiune.",
      "Organizarea voluntarilor pentru anuntarea initiativei in scarile de bloc prin distribuirea de flyere la casutele postale si lipirea afiselor la intrarea in scara si in lifturi.",
      "Actiuni realizate:",
    ],
    bullets: [
      "creare postere si flyere",
      "distribuire flyere in scari si lifturi",
      "organizare voluntari pentru distributie la nivel de condominium (16 scari de bloc pentru apartamentele predate din Fazele 1+2)",
      "extinderea comunitatii la peste 1200 membri prin codul QR invitatie pentru acces in comunitate",
    ],
  },
  {
    title: "14 Februarie 2025",
    paragraphs: [
      "Intalnire cu proprietarii si colectarea semnaturilor pentru demararea procedurii de constituire. Organizarea primei convocari pentru initierea procedurii de constituire.",
      "Impact:",
    ],
    bullets: [
      "extinderea comunitatii la peste 1100 membri",
      "aproximativ 110 locatari noi alaturati in aceasta etapa",
    ],
    extraTitle: "Rezultat:",
    extraBullets: [
      "~370 semnaturi colectate pentru initierea procesului",
      "(Atasat prima parte a PV, fara semnaturi)",
    ],
  },
  {
    title: "Februarie 2025 | Etapa juridica si transparenta",
    paragraphs: [
      "Solicitarea de oferte din partea multiplelor firme de avocatura. Deschiderea listelor pentru ofertare din partea comunitatii.",
      "Filothea a coordonat:",
    ],
    bullets: [
      "solicitarea de oferte de la multiple firme de avocatura",
      "deschiderea procesului catre recomandari din comunitate",
      "supunerea selectiei votului proprietarilor",
    ],
    extraTitle: "Conform votului:",
    extraBullets: [
      "Cristina Timaru Law Office a fost selectata",
      "Onorariu: 2500 lei + TVA",
      "(reducere acordata in contextul apartenentei la comunitate)",
    ],
  },
  {
    title: "Martie 2025",
    paragraphs: [
      "Organizarea finantarii comunitare.",
      "A fost organizata contributia voluntara, printr-un sistem de colectare: 7 lei / apartament.",
      "Rezultat:",
    ],
    bullets: ["suma necesara (2970 lei cu TVA) a fost colectata cu succes de la 423 apartamente."],
  },
  {
    title: "18 Aprilie 2025",
    paragraphs: ["Inceperea colaborarii juridice."],
    bullets: [
      "colaborarea oficiala a fost initiata",
      "onorariul a fost achitat integral",
      "(Atasat factura)",
    ],
  },
  {
    title: "30 Aprilie 2025",
    paragraphs: ["Receptia documentatiei juridice pentru infiintarea asociatiei:"],
    bullets: ["Statut", "Acord de asociere", "Regulament de ordine interioara", "Proces verbal AGA", "Convocator"],
  },
  {
    title: "Iunie 2025",
    paragraphs: [
      "Identificarea blocajului major.",
      "Pentru a putea merge mai departe cu procesul de constituire, a devenit clar ca lipsea un element esential: completarea cotelor-parti indivize ale proprietarilor.",
      "Au fost analizate mai multe optiuni juridice pentru obtinerea acestor date, inclusiv:",
    ],
    bullets: [
      "accesarea extraselor CF publice",
      "colectarea informatiilor direct de la proprietari",
    ],
    extraParagraphs: [
      "Toate acestea au trebuit evaluate prin prisma limitarilor reale impuse de cadrul GDPR, mai ales in contextul in care demersul era realizat de o structura comunitara in formare, nu de o entitate juridica deja constituita.",
      "Realitatea operationala era insa mult mai complexa.",
      "Nu exista o baza de date centralizata cu proprietarii accesibila.",
      "Nu exista acces la datele lor de contact.",
      "Iar pentru a putea continua, era nevoie exact de aceste date.",
      "In mod practic, procesul de strangere a semnaturilor la nivel de condominiu nu mai putea fi rezolvat administrativ, ci doar printr-un efort comunitar coordonat.",
      "A devenit evident ca era necesara o mobilizare in teren:",
    ],
    extraBullets: [
      "identificarea proprietarilor apartament cu apartament",
      "obtinerea datelor minime de contact (email, telefon)",
      "stabilirea unui canal direct de comunicare",
      "(Screenshot cu adresele de email ale Cristinei si celelalte sterse cu negru)",
    ],
  },
  {
    title: "Iunie - Septembrie 2025",
    paragraphs: ["Adaptare si validare.", "Au avut loc:"],
    bullets: [
      "consultari juridice suplimentare cu avocati din comunitate",
      "validarea documentatiei",
      "adaptarea acesteia la specificul unui complex de ~1500 unitati, in functie de problemele semnalate pe comunitatea de WhatsApp, acum ajunsa la peste 1350 membri",
    ],
    extraParagraphs: ["In paralel, a fost identificata nevoia unui sediu."],
  },
  {
    title: "16 Septembrie 2025",
    paragraphs: [
      "Identificarea sediului si includerea sa in documentatie ca sediu oficial si de corespondenta.",
      "Filothea a coordonat dialogul cu dezvoltatorul.",
      "Rezultat:",
    ],
    bullets: [
      "spatiu oferit in scara B4",
      "destinat sediului viitoarei asociatii",
      "B4 - Birou administratie",
    ],
  },
  {
    title: "Septembrie 2025",
    paragraphs: [
      "Documentatia pentru dosarul de constituire era aproape completa.",
      "Etapa urmatoare: contactarea si colectarea semnaturilor proprietarilor pentru constituire.",
    ],
  },
  {
    title: "Octombrie 2025",
    paragraphs: [
      "Transfer de coordonare.",
      "Din motive personale, Filothea a decis sa predea coordonarea initiativei, in contextul in care:",
    ],
    bullets: ["exista deja un comitet format", "existau documentele", "exista sediul"],
    extraParagraphs: ["Obiectivul: continuarea procesului prin efort colectiv."],
  },
  {
    title: "Octombrie 2025, Noiembrie 2025, Decembrie 2025, Ianuarie 2026, Februarie 2026",
    paragraphs: [
      "Nu s-au inregistrat pasi concreti in directia depunerii dosarului.",
      "In tot acest timp, comunitatea a continuat sa asocieze initiativa cu Filothea si sa ii adreseze, in mod constant, solicitari de actualizare privind stadiul demersului.",
      "Intrebarile adresate, atat public, cat si in privat, catre membrii desemnati sa duca mai departe procesul au ramas, in mod repetat, fara raspuns, ceea ce a generat o presiune legitima de clarificare si directie din partea proprietarilor.",
    ],
  },
  {
    title: "Februarie 2026",
    paragraphs: [
      "Reluarea implicarii.",
      "Dupa aproximativ 5 luni fara progrese concrete in procesul de constituire, Filothea a decis sa revina in coordonarea initiativei, din responsabilitate fata de comunitate si fata de demersul deja construit.",
      "Reimplicarea a vizat nu doar reluarea comunicarii, ci repornirea mecanismelor necesare avansarii:",
    ],
    bullets: [
      "recentralizarea problemelor rezidentilor",
      "reinstaurarea unei comunicari transparente",
      "reluarea colaborarii cu firma de administrare",
    ],
    extraParagraphs: [
      "In paralel, au fost evaluate blocajele existente, reactivat nucleul de voluntari si reluata coordonarea cu actorii implicati, pentru a readuce procesul intr-o etapa functionala si orientata spre finalizare.",
    ],
  },
  {
    title: "Februarie 2025 - Prezent",
    paragraphs: [
      "Dincolo de pasii formali ai procesului, a fost mentinut un efort constant de a tine comunitatea conectata si implicata.",
    ],
    bullets: [
      "o comunitate activa de peste 900 membri",
      "peste 25 grupuri de comunicare gestionate",
    ],
    extraTitle: "Acest lucru a insemnat, in practica:",
    extraBullets: [
      "mobilizarea voluntarilor atunci cand a fost nevoie",
      "mentinerea unei echipe implicate in jurul initiativei",
      "dialog constant cu dezvoltatorul",
      "colaborare continua cu firmele de administrare",
    ],
    extraParagraphs: [
      "Acest cadru a ajutat la pastrarea coeziunii comunitatii si la mentinerea capacitatii de actiune, chiar si in perioadele in care procesul formal a intampinat blocaje.",
    ],
  },
];

const currentStageBullets = [
  "contact direct",
  "coordonare logistica",
  "actiuni door-to-door acolo unde este necesar",
];

const legalSteps = [
  "convocarea Adunarii Generale de constituire",
  "obtinerea acordului scris a 50% + 1 dintre proprietari",
  "adoptarea oficiala a statutului si acordului de asociere",
  "depunerea dosarului de infiintare in instanta",
];

export function ProgressDetailsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash === "#detalii-etape") {
        setIsOpen(true);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  return (
    <div id="detalii-etape" className="mt-6 scroll-mt-24">
      <Button size="lg" onClick={() => setIsOpen((current) => !current)}>
        {isOpen ? "Inchide detaliile" : "Detalii, etape realizate"}
      </Button>

      {isOpen ? (
        <Card className="mt-6 rounded-[2rem] border-slate-200 bg-white p-6 sm:p-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <CardTitle className="text-2xl">Etape realizate si coordonare</CardTitle>
              <CardDescription className="text-base leading-7">
                Coordonarea initiativei este asigurata de Filothea Favatas, desemnata de
                comunitate in urma unui vot exprimat intr-o comunitate de peste 1100 membri.
              </CardDescription>
              <p className="text-sm leading-7 text-slate-700">
                Rolul sau a fost unul de organizare si structurare a procesului:
              </p>
              <ul className="space-y-2 text-sm leading-7 text-slate-700">
                {roleBullets.map((bullet) => (
                  <li key={bullet}>- {bullet}</li>
                ))}
              </ul>
              <p className="text-sm leading-7 text-slate-700">
                In paralel, Filothea a coordonat administrarea si dezvoltarea comunitatii
                rezidentilor Cortina North, care astazi numara peste 900 membri activi intr-un grup
                de WhatsApp si 25+ grupuri tematice de comunicare.
              </p>
              <p className="text-sm leading-7 text-slate-700">
                Aceasta infrastructura comunitara a devenit principalul spatiu de informare si
                mobilizare al proprietarilor.
              </p>
            </div>

            <div className="space-y-4">
              <CardTitle className="text-2xl">Cronologia demersului</CardTitle>
              <div className="space-y-4">
                {timeline.map((entry) => (
                  <div key={entry.title} className="rounded-2xl bg-slate-50 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">{entry.title}</h3>
                    <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
                      {entry.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {"bullets" in entry && entry.bullets ? (
                        <ul className="space-y-2">
                          {entry.bullets.map((bullet) => (
                            <li key={bullet}>- {bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                      {"extraTitle" in entry && entry.extraTitle ? (
                        <p className="font-semibold text-slate-900">{entry.extraTitle}</p>
                      ) : null}
                      {"extraBullets" in entry && entry.extraBullets ? (
                        <ul className="space-y-2">
                          {entry.extraBullets.map((bullet) => (
                            <li key={bullet}>- {bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                      {"extraParagraphs" in entry && entry.extraParagraphs
                        ? entry.extraParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                        : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <CardTitle className="text-2xl">Unde ne aflam in prezent</CardTitle>
              <CardDescription className="text-base leading-7">
                Documentatia juridica necesara constituirii asociatiei este deja redactata de firma
                de avocatura selectata de comunitate si achitata integral prin contributia
                proprietarilor.
              </CardDescription>
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                <p>
                  Ne aflam acum in etapa operationala, cea care face diferenta intre intentie si
                  finalizare.
                </p>
                <p>
                  Lucram activ la mobilizarea voluntarilor pentru strangerea semnaturilor necesare
                  infiintarii asociatiei, consolidand o baza de date deja construita de peste 620
                  proprietari care pot fi contactati.
                </p>
                <p>Acest proces presupune:</p>
                <ul className="space-y-2">
                  {currentStageBullets.map((bullet) => (
                    <li key={bullet}>- {bullet}</li>
                  ))}
                </ul>
                <p>
                  Este un efort anevoios, dar esential, unul care necesita organizare atenta si
                  coerenta, pentru a transforma munca depusa pana acum intr-un rezultat concret.
                </p>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="font-semibold text-emerald-950">
                    In paralel, continuam parcurgerea pasilor prevazuti de Legea 196/2018:
                  </p>
                  <ol className="mt-3 space-y-2 text-sm leading-7 text-emerald-950">
                    {legalSteps.map((step, index) => (
                      <li key={step}>
                        {index + 1}. {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <p>
                  Suntem, in mod real, in faza in care ceea ce a fost construit poate fi dus la
                  capat.
                </p>
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
