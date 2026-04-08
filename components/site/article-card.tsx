import Link from "next/link";
import type { Article, ArticleService, Service } from "@prisma/client";
import { Card } from "@/components/ui/card";

export function ArticleCard({
  article,
}: {
  article: Article & { services?: (ArticleService & { service: Service })[] };
}) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <Card className="h-full p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100">
        {article.coverImageUrl ? (
          <div className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-50">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="h-44 w-full object-cover"
              loading="lazy"
            />
          </div>
        ) : null}
        <h3 className="mt-3 text-xl font-bold text-slate-950">{article.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{article.excerpt}</p>
        {article.services?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {article.services.slice(0, 2).map((item) => (
              <span
                key={item.id}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {item.service.name}
              </span>
            ))}
          </div>
        ) : null}
      </Card>
    </Link>
  );
}
