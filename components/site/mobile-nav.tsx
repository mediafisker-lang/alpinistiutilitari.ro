import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckSquare,
  ChevronRight,
  FileText,
  Headphones,
  Home,
  Mail,
  MapPin,
  Menu,
  Phone,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

type MobileNavProps = {
  links: Array<{ href: string; label: string }>;
};

const icons = {
  "/": Home,
  "/servicii": Wrench,
  "/cum-functioneaza": CheckSquare,
  "/firme": Building2,
  "/judete": MapPin,
  "/despre-noi": UserRound,
  "/contact": Mail,
};

const mobileLabels = {
  "/": "Acasă",
  "/servicii": "Servicii",
  "/cum-functioneaza": "Cum să",
  "/firme": "Firme",
  "/judete": "Județe",
  "/despre-noi": "Despre",
  "/contact": "Contact",
};

export function MobileNav({ links }: MobileNavProps) {
  const visibleLinks = links.filter((link) => link.href !== "/servicii/alpinism-industrial-greu");
  const menuLinks = [{ href: "/", label: "Acasă" }, ...visibleLinks];

  return (
    <div className="mobile-nav lg:hidden">
      <button
        type="button"
        aria-label="Deschide meniul"
        aria-controls="mobile-navigation-panel"
        popoverTarget="mobile-navigation-panel"
        popoverTargetAction="toggle"
        className="mobile-nav-trigger inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FF5A0A] px-4 text-xs font-extrabold text-white shadow-[0_8px_18px_rgba(249,115,22,0.3)] transition hover:bg-[#E94F00]"
      >
        <Menu className="size-5" aria-hidden="true" />
        MENIU
      </button>

      <aside
        id="mobile-navigation-panel"
        aria-label="Meniu principal"
        popover="auto"
        className="mobile-menu-panel fixed bottom-0 right-0 top-[var(--mobile-header-height,6.85rem)] m-0 ml-auto h-auto w-[20rem] max-w-[calc(100vw-2.25rem)] overflow-y-auto rounded-tl-[18px] border-0 bg-white px-5 pb-5 pt-4 text-[#102A43] shadow-[-18px_24px_50px_rgba(16,42,67,0.22)]"
      >
        <div className="flex min-h-full flex-col">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                aria-label="Închide meniul"
                popoverTarget="mobile-navigation-panel"
                popoverTargetAction="hide"
                className="inline-flex size-11 items-center justify-center rounded-full text-[#102A43] transition hover:bg-[#F1F5F7]"
              >
                <X className="size-7" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Navigare mobilă" className="grid gap-1">
              {menuLinks.map((link) => {
                const Icon = icons[link.href as keyof typeof icons] ?? FileText;
                const isServices = link.href === "/servicii";
                const label = mobileLabels[link.href as keyof typeof mobileLabels] ?? link.label;

                if (isServices) {
                  return (
                    <details key={link.href} className="mobile-services-menu">
                      <summary className="mobile-menu-link w-full cursor-pointer list-none">
                        <span className="flex items-center gap-3">
                          <Icon className="size-5 text-[#176B87]" aria-hidden="true" />
                          <span>{label}</span>
                        </span>
                        <ChevronRight className="mobile-services-chevron size-5 transition" aria-hidden="true" />
                      </summary>
                      <div className="mb-2 ml-8 grid gap-1 border-l border-[#DCE4E9] pl-4">
                          <Link href="/servicii" className="mobile-menu-sublink">
                            Toate serviciile
                          </Link>
                          <Link
                            href="/servicii/alpinism-industrial-greu"
                            className="mobile-menu-sublink"
                          >
                            Alpinism industrial greu
                          </Link>
                      </div>
                    </details>
                  );
                }

                return (
                  <Link key={link.href} href={link.href} className="mobile-menu-link">
                    <span className="flex items-center gap-3">
                      <Icon className="size-5 text-[#176B87]" aria-hidden="true" />
                      <span>{label}</span>
                    </span>
                    {link.href === "/" ? null : <ChevronRight className="size-5" aria-hidden="true" />}
                  </Link>
                );
              })}
            </nav>

            <div className="my-4 h-px bg-[#DCE4E9]" />

            <Link
              href="/cere-oferta"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FF5A0A] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(249,115,22,0.25)] transition hover:bg-[#E94F00]"
            >
              <FileText className="size-5" aria-hidden="true" />
              Cere ofertă
              <ArrowRight className="ml-auto size-4" aria-hidden="true" />
            </Link>

            <a
              href="tel:+40799102030"
              className="mt-4 flex items-center gap-3 rounded-2xl bg-[#F1F5F7] p-3 text-[#102A43] transition hover:bg-[#E8F0F3]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#DCE7EC]">
                <Headphones className="size-6" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-[#627D98]">Ai nevoie de ajutor?</span>
                <span className="flex items-center gap-1.5 text-sm font-extrabold">
                  <Phone className="size-3.5" aria-hidden="true" />
                  0799102030
                </span>
              </span>
            </a>
        </div>
      </aside>
    </div>
  );
}
