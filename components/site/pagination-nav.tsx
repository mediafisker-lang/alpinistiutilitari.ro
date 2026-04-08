import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationNavProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
};

function buildPageHref(
  basePath: string,
  page: number,
  searchParams?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (!value || key === "page") return;
    params.set(key, value);
  });

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function PaginationNav({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: PaginationNavProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => {
    return (
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
    );
  });

  const dedupedPages = pages.filter((page, index) => pages.indexOf(page) === index);

  return (
    <nav
      aria-label="Paginare"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={buildPageHref(basePath, currentPage - 1, searchParams)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
        >
          <ChevronLeft className="size-4" />
          Pagina anterioară
        </Link>
      ) : null}

      {dedupedPages.map((page, index) => {
        const previousPage = dedupedPages[index - 1];
        const showGap = previousPage && page - previousPage > 1;

        return (
          <div key={page} className="flex items-center gap-2">
            {showGap ? <span className="px-1 text-sm text-slate-400">…</span> : null}
            <Link
              href={buildPageHref(basePath, page, searchParams)}
              aria-current={page === currentPage ? "page" : undefined}
              className={[
                "inline-flex min-w-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition",
                page === currentPage
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:text-sky-700",
              ].join(" ")}
            >
              {page}
            </Link>
          </div>
        );
      })}

      {currentPage < totalPages ? (
        <Link
          href={buildPageHref(basePath, currentPage + 1, searchParams)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
        >
          Pagina următoare
          <ChevronRight className="size-4" />
        </Link>
      ) : null}
    </nav>
  );
}
