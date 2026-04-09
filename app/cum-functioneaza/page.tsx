import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ArticleCard } from "@/components/site/article-card";
import { getArticles } from "@/lib/data/queries";

export const metadata = buildMetadata({
  title: "Cum sa functioneze rapid cererea ta",
  description:
    "Pași clari pentru trimiterea cererii și ghiduri utile din blog, într-o singură pagină.",
  path: "/cum-functioneaza",
});

export default async function HowItWorksPage() {
  const [articles] = await Promise.all([getArticles()]);

  const steps = [
    {
      title: "Completezi formularul",
      description:
        "Alegi județul și tipul lucrării, adaugi detalii utile și poze dacă ai.",
    },
    {
      title: "Cererea intră în platformă",
      description:
        "Solicitarea este salvată intern și direcționată către zona și serviciul selectat.",
    },
    {
      title: "Analiză și selecție",
      description:
        "Operatorul verifică cererea și selectează firmele relevante pentru lucrare.",
    },
    {
      title: "Primești oferte",
      description:
        "Revii rapid cu opțiuni comparabile ca preț, termen și nivel de experiență.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Cum sa" }]} />
      <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">Cum sa trimiti corect cererea</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Urmează pașii de mai jos pentru a obține oferte relevante, apoi folosește articolele din blog
          pentru decizii mai bune înainte de lucrare.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                Pasul {index + 1}
              </p>
              <h2 className="mt-2 text-base font-bold text-slate-950">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="mt-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Articole utile
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Toate ghidurile din blog, într-un singur loc
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Aici ai toate articolele publicate, ca să poți pregăti corect cererea și să compari mai
            bine ofertele primite.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
