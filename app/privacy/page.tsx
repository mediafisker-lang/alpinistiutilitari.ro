import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Politica de confidentialitate Cortina North",
  description:
    "Politica de confidentialitate pentru portalul comunitatii Cortina North din Bucuresti si Ilfov.",
  path: "/privacy",
  keywords: ["confidentialitate Cortina North", "politica GDPR Cortina North"],
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Confidentialitate"
        title="Explicam simplu ce date colectam si de ce."
        description="Aici explicam pe scurt cum sunt colectate, folosite si protejate datele transmise prin acest portal."
      />

      <div className="mt-8 space-y-4">
        <Card>
          <CardTitle>1. Ce date colectam</CardTitle>
          <CardDescription className="mt-3">
            Pentru inscriere colectam nume, telefon, email, statut si acordul pentru
            prelucrarea datelor. Pentru sesizari colectam nume, date de contact,
            categoria, titlul si descrierea problemei.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>2. In ce scop folosim datele</CardTitle>
          <CardDescription className="mt-3">
            Datele sunt folosite strict pentru organizarea asociatiei, comunicarea cu
            locatarii, centralizarea interesului pentru infiintare si gestionarea
            sesizarilor trimise prin portal.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>3. Temeiul si acordul</CardTitle>
          <CardDescription className="mt-3">
            Datele din formularul de inscriere sunt transmise doar dupa exprimarea
            acordului explicit. Pentru sesizari, datele de contact sunt folosite doar
            pentru analizarea si, daca este cazul, solutionarea problemei semnalate.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>4. Cat timp pastram datele</CardTitle>
          <CardDescription className="mt-3">
            Datele se pastreaza doar cat timp sunt necesare pentru scopul declarat sau
            pana cand ceri stergerea lor, daca legea permite acest lucru.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>5. Cui pot fi comunicate</CardTitle>
          <CardDescription className="mt-3">
            Datele nu sunt publicate pe site si nu sunt folosite in scop de marketing.
            Ele pot fi accesate doar de persoanele care administreaza acest portal si,
            daca este necesar, de furnizorii tehnici folositi pentru gazduire si stocare.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>6. Drepturile tale</CardTitle>
          <CardDescription className="mt-3">
            Poti cere informare, rectificare, stergere, restrictionarea prelucrarii sau
            poti retrage acordul oferit, in masura in care legea permite acest lucru.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>7. Date de contact</CardTitle>
          <CardDescription className="mt-3">
            Pentru solicitari privind confidentialitatea, completeaza inainte de lansare
            aceasta sectiune cu numele persoanei sau al grupului care administreaza
            datele si cu o adresa reala de email de contact.
          </CardDescription>
        </Card>
      </div>
    </section>
  );
}
