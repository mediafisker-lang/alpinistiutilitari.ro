import { buildMetadata } from "@/lib/seo";
import { getArticles, getCounties, getServices } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ArticleCard } from "@/components/site/article-card";
import { SeoLinkCloud } from "@/components/site/seo-link-cloud";
import { CTASection } from "@/components/site/cta-section";

export const metadata = buildMetadata({
  title: "Articole despre alpinism utilitar si servicii la inaltime",
  description:
    "Ghiduri si articole utile despre alegerea firmelor, servicii la inaltime si cautari locale.",
  path: "/blog",
});

export default async function ArticlesPage() {
  const [articles, counties, services] = await Promise.all([
    getArticles(),
    getCounties(),
    getServices(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Articole" }]} />
      <div className="mt-6 max-w-3xl space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">
          Articole utile pentru servicii la inaltime
        </h1>
        <p className="text-lg leading-8 text-slate-600">
          Continut orientat pe cautari locale, compararea firmelor si alegerea corecta a serviciului necesar.
        </p>
      </div>

      <section className="mt-8 grid gap-4 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6 shadow-sm shadow-slate-950/5 md:grid-cols-3">
        <div>
          <p className="text-3xl font-black text-slate-950">{articles.length}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">articole indexabile pentru intentii comerciale si informative.</p>
        </div>
        <div>
          <p className="text-3xl font-black text-slate-950">{counties.length}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">judete care pot fi sustinute prin continut local si interlinking.</p>
        </div>
        <div>
          <p className="text-3xl font-black text-slate-950">{services.length}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">servicii pentru care putem lega ghiduri, firme si pagini locale.</p>
        </div>
      </section>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <SeoLinkCloud
          title="Judete cu intentie comerciala ridicata"
          description="Leaga ghidurile de paginile locale pentru a sustine cautarile reale din Google."
          links={counties.slice(0, 10).map((county) => ({
            href: `/${county.slug}`,
            label: `Alpinism utilitar ${county.name}`,
          }))}
        />
        <SeoLinkCloud
          title="Servicii despre care merita sa publici mai mult"
          description="Aceste verticale ajuta atat SEO-ul informational, cat si conversia din paginile comerciale."
          links={services.slice(0, 10).map((service) => ({
            href: `/servicii/${service.slug}`,
            label: service.name,
          }))}
        />
      </div>

      <div className="mt-10">
        <CTASection
          eyebrow="Ceri ajutor rapid"
          title="Ai o lucrare urgenta? Nu trebuie sa cauti prin zeci de pagini."
          description="Trimite o singura cerere si revenim manual cu executantii relevanti, in functie de locatie, urgenta si tipul interventiei."
          primaryAction={{ href: "/cere-oferta", label: "Cere oferta" }}
          secondaryAction={{ href: "/firme", label: "Vezi firmele" }}
        />
      </div>
    </div>
  );
}
