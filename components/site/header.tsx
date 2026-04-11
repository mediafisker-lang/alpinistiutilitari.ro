import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/site/mobile-nav";

const links = [
  { href: "/servicii", label: "SERVICII" },
  { href: "/cum-functioneaza", label: "CUM SA" },
  { href: "/firme", label: "FIRME" },
  { href: "/judete", label: "JUDETE" },
  { href: "/despre-noi", label: "DESPRE" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-[#0057db] bg-[linear-gradient(90deg,#0057db,#0063f7_62%,#e31e24)] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs font-semibold sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Zap className="size-3.5" />
            <span>Solicitări preluate rapid pentru lucrări la înălțime din toată România</span>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <ShieldCheck className="size-3.5" />
            <span>Platformă națională cu selecție manuală a firmelor</span>
          </div>
        </div>
      </div>

      <div className="border-b border-white/60 bg-white/94 shadow-[0_16px_44px_rgba(15,23,42,0.08)] md:backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 xl:gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-[0_18px_34px_rgba(0,99,247,0.16)] md:backdrop-blur">
                <Image
                  src="/logo-alpinistiutilitari.svg"
                  alt="Alpinisti Utilitari"
                  width={48}
                  height={48}
                  className="size-12 rounded-2xl"
                  priority
                />
              </div>
              <div className="min-w-0">
                <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0063f7]">
                  PLATFORMA NATIONALA
                </p>
                <p className="truncate text-lg font-black text-slate-950">AlpinistiUtilitari.ro</p>
              </div>
            </Link>

            <Link
              href="/"
              className="hidden rounded-[1.25rem] border border-[#0063f7]/14 bg-[#0063f7]/6 px-4 py-3 text-xs font-bold uppercase leading-5 text-[#0063f7] transition hover:border-[#0063f7]/28 hover:bg-[#0063f7]/10 lg:block"
            >
              <span className="block whitespace-nowrap">Lansezi o cerere,</span>
              <span className="block whitespace-nowrap">primești mai multe oferte locale!</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-4 lg:flex xl:gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold tracking-[0.08em] text-slate-700 transition hover:text-[#0063f7]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/cere-oferta">
              <Button className="shadow-[0_18px_34px_rgba(0,99,247,0.26)]">
                CERE OFERTA!
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>

          <MobileNav links={links} />
        </div>
      </div>
    </header>
  );
}
