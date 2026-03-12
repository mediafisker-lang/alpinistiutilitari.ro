import Link from "next/link";
import { Menu } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="min-w-0">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Cortina North"
              className="h-16 w-auto object-contain sm:h-20"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[0.14em] text-slate-900 uppercase">
                Cortina North
              </p>
              <p className="text-xs text-slate-500">Comunitate, transparență, asociere</p>
            </div>
          </div>
        </Link>
        <details className="group lg:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 [&::-webkit-details-marker]:hidden">
            <Menu className="size-5" />
          </summary>
          <div className="absolute inset-x-4 top-[calc(100%-0.25rem)] rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/10">
            <nav className="grid grid-cols-2 gap-3">
              <Link
                href="#stadiu"
                className="rounded-2xl bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-slate-200"
              >
                Stadiu Asoc.
              </Link>
              <Link
                href="#beneficii"
                className="rounded-2xl bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-slate-200"
              >
                Beneficii
              </Link>
              <Link
                href="#voteaza"
                className="rounded-2xl bg-slate-100 px-4 py-3 text-center text-sm font-medium leading-5 text-slate-800 transition hover:bg-slate-200"
              >
                Votează schimbările
              </Link>
              <Link
                href="#sesizare"
                className="rounded-2xl bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-slate-200"
              >
                Sesizează
              </Link>
              <Link
                href="#inscriere"
                className="col-span-2 rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Vreau să mă înscriu
              </Link>
            </nav>
          </div>
        </details>
        <div className="hidden items-center gap-5 text-sm text-slate-600 lg:flex">
          <Link
            href="#stadiu"
            className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Stadiu Asoc.
          </Link>
          <Link
            href="#beneficii"
            className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Beneficii
          </Link>
          <Link
            href="#voteaza"
            className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Votează schimbările
          </Link>
          <Link
            href="#sesizare"
            className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Sesizează
          </Link>
          <Link
            href="#inscriere"
            className="rounded-full bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
          >
            Vreau să mă înscriu
          </Link>
        </div>
      </div>
    </header>
  );
}
