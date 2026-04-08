import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";

export const metadata = buildMetadata({
  title: "Despre noi - AlpinistiUtilitari.ro",
  description:
    "Află cum funcționează platforma națională pentru firme de alpinism utilitar și de ce este construită pentru căutări locale reale din România.",
  path: "/despre-noi",
});

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Despre noi" }]} />
      <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">Despre AlpinistiUtilitari.ro</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
          <p>
            Platforma este construită pentru clienți care caută rapid firme de alpinism utilitar după județ, oraș și tip de lucrare.
          </p>
          <p>
            Structura SEO urmează modelul județ → oraș → serviciu → firmă, astfel încât paginile să fie clare, utile și ușor de înțeles atât pentru Google, cât și pentru utilizatori.
          </p>
        </div>
      </div>
    </div>
  );
}
