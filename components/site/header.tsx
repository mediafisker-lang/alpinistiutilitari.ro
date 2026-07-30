import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Phone, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/site/mobile-nav";

const links = [
  { href: "/servicii", label: "SERVICII" },
  { href: "/servicii/alpinism-industrial-greu", label: "INDUSTRIAL" },
  { href: "/cum-functioneaza", label: "CUM SA" },
  { href: "/firme", label: "FIRME" },
  { href: "/judete", label: "JUDETE" },
  { href: "/despre-noi", label: "DESPRE" },
  { href: "/contact", label: "CONTACT" },
];

const serviceMenuLinks = [
  { href: "/servicii/alpinism-utilitar", label: "Alpinism utilitar" },
  { href: "/servicii/alpinism-industrial-greu", label: "Alpinism industrial greu" },
  { href: "/servicii/spalare-geamuri-la-inaltime", label: "Spalare geamuri la inaltime" },
  { href: "/servicii/reparatii-fatade", label: "Reparatii fatade" },
  { href: "/servicii/reparatii-acoperisuri", label: "Reparatii acoperisuri" },
  { href: "/servicii/inspectii-ndt-la-inaltime", label: "Inspectii NDT la inaltime" },
  { href: "/servicii/protectie-anticoroziva-la-inaltime", label: "Protectie anticoroziva" },
  { href: "/servicii/mentenanta-cosuri-industriale", label: "Cosuri industriale" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#DCE4E9] bg-white/96 shadow-[0_8px_30px_rgba(16,42,67,0.07)] backdrop-blur-xl">
      <div className="bg-[#102A43] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-xs font-semibold sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Zap className="size-3.5" />
            <span>
              Cereri de lucrări la înălțime preluate rapid din toată România și trimise către
              firmele de execuție corespunzătoare, pe județe.
            </span>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <ShieldCheck className="size-3.5" />
            <span>Platformă națională cu selecție manuală a firmelor</span>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 xl:gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl border border-[#DCE4E9] bg-white">
                <Image
                  src="/logo-alpinistiutilitari.svg"
                  alt="Alpinisti Utilitari"
                  width={48}
                  height={48}
                  className="size-11 rounded-xl"
                  priority
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[9px] font-bold uppercase tracking-[0.14em] text-[#176B87] sm:text-[10px] sm:tracking-[0.2em]">
                  PLATFORMA NATIONALA
                </p>
                <p className="truncate text-lg font-extrabold text-[#102A43]">AlpinistiUtilitari.ro</p>
              </div>
            </Link>

            <Link
              href="/"
              className="hidden rounded-xl border border-[#DCE4E9] bg-[#F5F7F9] px-4 py-2 text-[11px] font-bold uppercase leading-5 text-[#176B87] transition hover:border-[#176B87]/35 lg:block xl:hidden"
            >
              <span className="block whitespace-nowrap">Lansezi o cerere,</span>
              <span className="block whitespace-nowrap">primești mai multe oferte locale!</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-4 lg:flex xl:gap-5">
            <div className="group relative">
              <Link
                href="/servicii"
                className="flex items-center gap-1 text-sm font-bold text-[#334E68] transition hover:text-[#176B87]"
              >
                SERVICII <ChevronDown className="size-4" />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 w-80 translate-y-2 pt-4 opacity-0 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-950/15">
                  {serviceMenuLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#334E68] transition hover:bg-[#E8F0F3] hover:text-[#176B87]"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/servicii"
                    className="mt-2 block rounded-xl bg-[#102A43] px-4 py-3 text-center text-sm font-bold text-white"
                  >
                    Vezi toate serviciile
                  </Link>
                </div>
              </div>
            </div>
            {links.slice(2).map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-bold text-[#334E68] transition hover:text-[#176B87]">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="tel:+40799102030"
              aria-label="Sună la 0799 102 030"
              className="hidden items-center gap-2 text-sm font-bold text-[#334E68] transition hover:text-[#176B87] xl:inline-flex"
            >
              <Phone className="size-4" />
              0799 102 030
            </a>
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
