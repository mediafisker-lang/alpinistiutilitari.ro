import Link from "next/link";
import { ArrowRight, ChevronRight, Menu } from "lucide-react";

type MobileNavProps = {
  links: Array<{ href: string; label: string }>;
};

export function MobileNav({ links }: MobileNavProps) {
  return (
    <details className="mobile-nav relative lg:hidden">
      <summary
        aria-label="Deschide meniul"
        className="mobile-nav-trigger inline-flex size-11 cursor-pointer list-none items-center justify-center rounded-xl text-[#102A43]"
      >
        <Menu className="size-7" aria-hidden="true" />
      </summary>

      <div className="fixed inset-x-0 top-[var(--mobile-header-height,6.75rem)] z-50 max-h-[calc(100dvh-var(--mobile-header-height,6.75rem))] overflow-y-auto border-t border-[#DCE4E9] bg-white px-4 pb-6 pt-4 shadow-[0_24px_50px_rgba(16,42,67,0.18)]">
        <nav aria-label="Navigare mobilă" className="mx-auto grid max-w-lg gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-12 items-center justify-between rounded-xl border border-[#DCE4E9] px-4 py-3 text-sm font-bold text-[#334E68] transition hover:border-[#176B87]/40 hover:bg-[#F5F7F9] hover:text-[#176B87]"
            >
              <span>{link.label}</span>
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          ))}
          <Link
            href="/cere-oferta"
            className="mt-2 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#F97316] px-5 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(249,115,22,0.22)]"
          >
            Cere ofertă acum
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </details>
  );
}
