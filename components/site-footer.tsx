import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[radial-gradient(circle_at_top,#1e293b_0%,#111827_55%,#0b1220_100%)] text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
          <div>
            <div className="inline-flex flex-col items-start gap-3 rounded-[1.75rem] border border-slate-500/40 bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:rounded-full sm:py-2">
              <Image
                src="/logo.png"
                alt="Cortina North"
                width={208}
                height={68}
                className="h-12 w-auto object-contain sm:h-14"
              />
              <div>
                <p className="text-base font-extrabold tracking-tight text-white sm:text-lg">Cortina North</p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                  Comunitate. Transparenta. Eleganta.
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
              Portalul comunitatii reuneste actualizari, sesizari, voturi si inscrieri intr-un
              singur loc pentru Cortina North, Bucuresti si Ilfov, intr-o prezentare premium cu
              accente glamour si acces rapid la informatia importanta.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                Meniu
              </p>
              <div className="mt-4 grid gap-3 text-sm">
                <Link href="/stadiu-asociatie" className="transition hover:text-white">
                  Stadiu Asoc.
                </Link>
                <Link href="/descriere-cortina-north" className="transition hover:text-white">
                  Descriere Cortina North
                </Link>
                <Link href="/#beneficii" className="transition hover:text-white">
                  Beneficii
                </Link>
                <Link href="/sesizari" className="transition hover:text-white">
                  Sesizari / Istoric
                </Link>
                <Link href="/voteaza" className="transition hover:text-white">
                  Voteaza propuneri
                </Link>
                <Link href="/inregistrare" className="transition hover:text-white">
                  Contul meu
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                Acces rapid
              </p>
              <div className="mt-4 grid gap-3 text-sm">
                <Link href="/privacy" className="transition hover:text-white">
                  Confidentialitate
                </Link>
                <Link href="/admin" className="transition hover:text-white">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-500/40 pt-6 text-xs uppercase tracking-[0.18em] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Cortina North portal comunitate</p>
          <p>Comunitate conectata si implicata</p>
        </div>
      </div>
    </footer>
  );
}
