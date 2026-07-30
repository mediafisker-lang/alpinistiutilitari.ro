import Image from "next/image";
import Link from "next/link";
import type { Article, ArticleService, Service } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { getArticleCoverUrl } from "@/lib/article-cover";

export function ArticleCard({
  article,
}: {
  article: Article & { services?: (ArticleService & { service: Service })[] };
}) {
  return (
    <Link href={`/blog/${article.slug}`} className="group block h-full">
      <Card className="ui-card-hover h-full rounded-2xl border border-[#DCE4E9] bg-white p-6 shadow-[0_12px_32px_rgba(16,42,67,0.07)] transition">
        <div className="aspect-[16/9] overflow-hidden rounded-xl border border-[#DCE4E9] bg-slate-50">
          <Image
            src={getArticleCoverUrl(article.slug)}
            alt={article.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            width="1200"
            height="675"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>
        <h3 className="mt-4 line-clamp-3 min-h-[4.5rem] break-words text-lg font-extrabold leading-6 text-[#102A43]">
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">{article.excerpt}</p>
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
