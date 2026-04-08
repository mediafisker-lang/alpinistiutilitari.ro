import { notFound } from "next/navigation";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getArticle } from "@/lib/data/queries";
import { Breadcrumbs } from "@/components/site/breadcrumbs";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return buildMetadata({
      title: "Articol indisponibil",
      description: "Articolul cautat nu exista.",
    });
  }

  return buildMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    path: `/blog/${article.slug}`,
    image: article.coverImageUrl ?? undefined,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const breadcrumbItems = [
    { label: "Acasa", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: article.title },
  ];
  const articleJsonLd = buildArticleJsonLd({
    title: article.title,
    description: article.excerpt,
    path: `/blog/${article.slug}`,
    publishedAt: article.publishedAt,
    image: article.coverImageUrl ?? undefined,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);
  const contentBlocks = article.content.split("\n\n").filter(Boolean);

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
        {article.coverImageUrl ? (
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
            <img src={article.coverImageUrl} alt={article.title} className="h-auto w-full object-cover" />
          </div>
        ) : null}
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
          {article.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{article.excerpt}</p>
        {article.services?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {article.services.map((item) => (
              <a
                key={item.id}
                href={`/servicii/${item.service.slug}`}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-sky-200 hover:text-sky-700"
              >
                {item.service.name}
              </a>
            ))}
          </div>
        ) : null}
        <div className="mt-8 space-y-5 text-base leading-8 text-slate-700">
          {contentBlocks.map((block, index) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={`${index}-${block}`} className="pt-3 text-2xl font-bold text-slate-950">
                  {block.replace("## ", "")}
                </h2>
              );
            }

            if (block.includes("\n- ")) {
              const items = block
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
                .map((item) => item.replace(/^- /, ""));

              return (
                <ul key={`${index}-${items[0]}`} className="space-y-3 rounded-[1.5rem] bg-slate-50 p-5">
                  {items.map((item) => (
                    <li key={item} className="list-none text-slate-700">
                      <span className="mr-2 text-sky-700">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }

            return <p key={`${index}-${block.slice(0, 24)}`}>{block}</p>;
          })}
        </div>
      </div>
    </article>
  );
}
