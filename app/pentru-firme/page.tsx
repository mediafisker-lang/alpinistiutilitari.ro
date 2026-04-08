import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Pentru firme de alpinism utilitar",
  description:
    "Informații pentru firmele care vor să apară în platformă, să fie descoperite în Google și să primească cereri locale relevante.",
  path: "/pentru-firme",
});

export default function ForCompaniesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Pentru firme" }]} />
      <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">Pentru firme</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
          <p>
            Platforma este orientată pe vizibilitate locală în Google și pe centralizarea solicitărilor comerciale din România pentru lucrări la înălțime.
          </p>
          <p>
            Profilurile publicate pot fi legate de județe, orașe și servicii, astfel încât să apară în paginile locale unde există cerere reală.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/contact">
            <Button>Solicită listare</Button>
          </Link>
          <Link href="/firme">
            <Button variant="secondary">Vezi firmele existente</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
