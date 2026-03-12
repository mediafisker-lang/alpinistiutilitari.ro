import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Stadiu Asociație | Cortina North",
};

const roleItems = [
  "organizarea inițială a comunității",
  "convocarea proprietarilor pe 14 februarie 2025 și pe 4 martie 2025",
  "solicitarea de oferte pentru consultanță juridică și selectarea unei echipe, după supunerea la vot către comunitate a ofertelor",
  "structurarea procesului de constituire și adaptarea documentației primite la problemele, nevoile și feedback-ul primit din partea comunității pe acte",
  "identificarea soluțiilor pentru blocajele instituționale",
  "reluarea inițiativei în momentele de stagnare",
  "menținerea transparenței procesului prin comunicări periodice cu comunitatea și membrii individuali",
];

const timeline = [
  {
    title: "Aug – Dec 2024",
    content:
      "Implicare activă în grupul comunității Cortina North, oferind soluții și coordonând discuții privind problemele ansamblului.",
  },
  {
    title: "Ianuarie 2025",
    content:
      "În urma votului într-o comunitate de peste 1000 membri, am fost desemnată să coordonez inițiativa de înființare a Asociației de Proprietari. A fost format un comitet de inițiativă din proprietari voluntari.",
  },
  {
    title: "Februarie 2025",
    content:
      "Inițiativa a trecut din zona de intenție în zona de acțiune. Au fost creați și distribuiți flyere și afișe, au fost organizați voluntari pentru distribuție la nivel de condominium, iar comunitatea a fost extinsă la peste 1200 membri prin codul QR de acces.",
  },
  {
    title: "14 Februarie 2025",
    content:
      "A avut loc întâlnirea cu proprietarii și colectarea semnăturilor pentru demararea procedurii de constituire. Comunitatea a depășit 1100 membri, aproximativ 110 locatari noi s-au alăturat în această etapă, iar rezultatul a fost de aproximativ 370 semnături colectate pentru inițierea procesului.",
  },
  {
    title: "Februarie 2025 | Etapă juridică și transparență",
    content:
      "Au fost solicitate oferte de la multiple firme de avocatură, procesul a fost deschis recomandărilor din comunitate, iar selecția a fost supusă votului proprietarilor. Conform votului, Cristina Timaru Law Office a fost selectată, cu onorariu de 2500 lei + TVA.",
  },
  {
    title: "Martie 2025",
    content:
      "A fost organizată finanțarea comunitară, prin contribuție voluntară de 7 lei per apartament. Suma necesară, 2970 lei cu TVA, a fost colectată cu succes de la 423 apartamente.",
  },
  {
    title: "18 Aprilie 2025",
    content:
      "A început colaborarea juridică, iar onorariul a fost achitat integral.",
  },
  {
    title: "30 Aprilie 2025",
    content:
      "A fost recepționată documentația juridică pentru înființarea asociației: Statut, Acord de asociere, Regulament de ordine interioară, Proces verbal AGA și Convocator.",
  },
  {
    title: "Iunie 2025",
    content:
      "A fost identificat blocajul major legat de completarea cotelor-părți indivize ale proprietarilor. Au fost analizate opțiuni juridice și administrative, dar a devenit clar că era necesară o mobilizare comunitară în teren pentru identificarea proprietarilor, obținerea datelor minime de contact și stabilirea unui canal direct de comunicare.",
  },
  {
    title: "Iunie – Septembrie 2025",
    content:
      "Au avut loc consultări juridice suplimentare, validarea documentației și adaptarea acesteia la specificul unui complex de aproximativ 1500 unități, în funcție de problemele semnalate în comunitate. În paralel a fost identificată nevoia unui sediu.",
  },
  {
    title: "16 Septembrie 2025",
    content:
      "A fost identificat sediul și inclus în documentație ca sediu oficial și de corespondență. În urma dialogului cu dezvoltatorul, a fost oferit un spațiu în scara B4, destinat sediului viitoarei asociații.",
  },
  {
    title: "Septembrie 2025",
    content:
      "Documentația pentru dosarul de constituire era aproape completă. Etapa următoare era contactarea și colectarea semnăturilor proprietarilor pentru constituire.",
  },
  {
    title: "Octombrie 2025",
    content:
      "Din motive personale, Filothea a predat coordonarea inițiativei, în contextul existenței unui comitet format, a documentelor și a sediului, cu obiectivul continuării procesului prin efort colectiv.",
  },
  {
    title: "Octombrie 2025 – Februarie 2026",
    content:
      "Nu s-au înregistrat pași concreți pentru depunerea dosarului. În tot acest timp, comunitatea a continuat să asocieze inițiativa cu Filothea și să solicite actualizări, iar lipsa de răspuns din partea celor desemnați să continue procesul a generat o presiune legitimă de clarificare și direcție.",
  },
  {
    title: "Februarie 2026",
    content:
      "După aproximativ 5 luni fără progrese concrete, Filothea a decis să revină în coordonarea inițiativei. Reimplicarea a vizat reluarea comunicării, recentralizarea problemelor rezidenților, reluarea colaborării cu firma de administrare și reactivarea nucleului de voluntari pentru a readuce procesul într-o etapă funcțională și orientată spre finalizare.",
  },
  {
    title: "Februarie 2025 – Prezent",
    content:
      "A fost menținut un efort constant pentru a ține comunitatea conectată și implicată: o comunitate activă de peste 900 membri, peste 25 grupuri de comunicare gestionate, mobilizarea voluntarilor, menținerea unei echipe implicate, dialog constant cu dezvoltatorul și colaborare continuă cu firmele de administrare.",
  },
];

export default function StadiuAsociatiePage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Stadiu Asociație"
        title="Pașii făcuți, pe larg"
        description="Mai jos este prezentată cronologia detaliată a demersului, rolul de coordonare și stadiul actual al procesului de constituire."
      />

      <div className="mt-8 space-y-6">
        <Card>
          <CardTitle>Rolul de organizare și structurare a procesului</CardTitle>
          <CardDescription className="mt-4">
            Rolul său a fost unul de organizare și structurare a procesului:
          </CardDescription>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            {roleItems.map((item) => (
              <li key={item}>✔️ {item}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-6 text-slate-700">
            În paralel, Filothea a coordonat administrarea și dezvoltarea comunității rezidenților Cortina North, care astăzi numără peste 900 membri activi într-un grup de WhatsApp și peste 25 grupuri tematice de comunicare. Această infrastructură comunitară a devenit principalul spațiu de informare și mobilizare al proprietarilor.
          </p>
        </Card>

        <Card>
          <CardTitle>Cronologia demersului</CardTitle>
          <div className="mt-6 space-y-5">
            {timeline.map((entry) => (
              <div key={entry.title} className="rounded-2xl bg-slate-50 p-4">
                <h3 className="text-base font-semibold text-slate-950">{entry.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{entry.content}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Unde ne aflăm în prezent</CardTitle>
          <CardDescription className="mt-4">
            Documentația juridică necesară constituirii asociației este deja redactată de firma de avocatură selectată de comunitate și achitată integral prin contribuția proprietarilor.
          </CardDescription>
          <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
            <p>
              Ne aflăm acum în etapa operațională, cea care face diferența între intenție și finalizare.
            </p>
            <p>
              Lucrăm activ la mobilizarea voluntarilor pentru strângerea semnăturilor necesare înființării asociației, consolidând o bază de date deja construită de peste 620 proprietari care pot fi contactați.
            </p>
            <p>
              Acest proces presupune contact direct, coordonare logistică și acțiuni door-to-door acolo unde este necesar. Este un efort anevoios, dar esențial, unul care necesită organizare atentă și coerență pentru a transforma munca depusă până acum într-un rezultat concret.
            </p>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="font-medium text-emerald-900">În paralel, continuăm parcurgerea pașilor prevăzuți de Legea 196/2018:</p>
              <ol className="mt-3 space-y-2">
                <li>1. convocarea Adunării Generale de constituire</li>
                <li>2. obținerea acordului scris a 50% + 1 dintre proprietari</li>
                <li>3. adoptarea oficială a statutului și acordului de asociere</li>
                <li>4. depunerea dosarului de înființare în instanță</li>
              </ol>
            </div>
            <p>
              Suntem, în mod real, în faza în care ceea ce a fost construit poate fi dus la capăt.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
