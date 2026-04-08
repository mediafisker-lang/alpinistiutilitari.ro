import { upsertArticleAction } from "@/lib/actions/admin";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    include: { services: { include: { service: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Conținut</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Articole</h1>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <h2 className="text-xl font-bold text-slate-950">Adaugă articol</h2>
        <form action={upsertArticleAction} className="mt-5 grid gap-4">
          <input name="title" placeholder="Titlu" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <input name="slug" placeholder="Slug" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <textarea name="excerpt" placeholder="Excerpt" className="min-h-24 rounded-3xl border border-slate-200 px-4 py-3 text-sm" />
          <textarea name="content" placeholder="Conținut" className="min-h-48 rounded-3xl border border-slate-200 px-4 py-3 text-sm" />
          <input name="seoTitle" placeholder="SEO title" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <input name="seoDescription" placeholder="SEO description" className="h-12 rounded-2xl border border-slate-200 px-4 text-sm" />
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input type="checkbox" name="isPublished" />
            Publică articolul
          </label>
          <button type="submit" className="h-12 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">
            Salvează articolul
          </button>
        </form>
      </section>

      <div className="grid gap-4">
        {articles.map((article) => (
          <form
            key={article.id}
            action={upsertArticleAction}
            className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5"
          >
            <input type="hidden" name="id" value={article.id} />
            <input name="title" defaultValue={article.title} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <input name="slug" defaultValue={article.slug} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            <textarea name="excerpt" defaultValue={article.excerpt} className="min-h-20 rounded-3xl border border-slate-200 px-4 py-3 text-sm" />
            <textarea name="content" defaultValue={article.content} className="min-h-32 rounded-3xl border border-slate-200 px-4 py-3 text-sm" />
            <div className="grid gap-3 lg:grid-cols-2">
              <input name="seoTitle" defaultValue={article.seoTitle ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
              <input name="seoDescription" defaultValue={article.seoDescription ?? ""} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm" />
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input type="checkbox" name="isPublished" defaultChecked={article.isPublished} />
              Publicat
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                Actualizat {formatDate(article.updatedAt)} · {article.services.length} servicii mapate
              </p>
              <button type="submit" className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">
                Update
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
