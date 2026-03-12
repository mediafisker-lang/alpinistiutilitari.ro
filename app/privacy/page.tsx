import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Confidențialitate | Asociația Blocului",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Confidențialitate"
        title="Explicăm simplu ce date colectăm și de ce."
        description="Aici explicăm pe scurt cum sunt colectate, folosite și protejate datele transmise prin acest portal."
      />

      <div className="mt-8 space-y-4">
        <Card>
          <CardTitle>1. Ce date colectăm</CardTitle>
          <CardDescription className="mt-3">
            Pentru înscriere colectăm nume, telefon, email, statut și acordul pentru
            prelucrarea datelor. Pentru sesizări colectăm nume, date de contact,
            categoria, titlul și descrierea problemei.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>2. În ce scop folosim datele</CardTitle>
          <CardDescription className="mt-3">
            Datele sunt folosite strict pentru organizarea asociației, comunicarea cu
            locatarii, centralizarea interesului pentru înființare și gestionarea
            sesizărilor trimise prin portal.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>3. Temeiul și acordul</CardTitle>
          <CardDescription className="mt-3">
            Datele din formularul de înscriere sunt transmise doar după exprimarea
            acordului explicit. Pentru sesizări, datele de contact sunt folosite doar
            pentru analizarea și, dacă este cazul, soluționarea problemei semnalate.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>4. Cât timp păstrăm datele</CardTitle>
          <CardDescription className="mt-3">
            Datele se păstrează doar cât timp sunt necesare pentru scopul declarat sau
            până când ceri ștergerea lor, dacă legea permite acest lucru.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>5. Cui pot fi comunicate</CardTitle>
          <CardDescription className="mt-3">
            Datele nu sunt publicate pe site și nu sunt folosite în scop de marketing.
            Ele pot fi accesate doar de persoanele care administrează acest portal și,
            dacă este necesar, de furnizorii tehnici folosiți pentru găzduire și stocare.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>6. Drepturile tale</CardTitle>
          <CardDescription className="mt-3">
            Poți cere informare, rectificare, ștergere, restricționarea prelucrării sau
            poți retrage acordul oferit, în măsura în care legea permite acest lucru.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>7. Date de contact</CardTitle>
          <CardDescription className="mt-3">
            Pentru solicitări privind confidențialitatea, completează înainte de lansare
            această secțiune cu numele persoanei sau al grupului care administrează
            datele și cu o adresă reală de email de contact.
          </CardDescription>
        </Card>
      </div>
    </section>
  );
}
