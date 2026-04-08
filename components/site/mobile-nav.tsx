"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";

type MobileNavProps = {
  links: Array<{ href: string; label: string }>;
};

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Închide meniul" : "Deschide meniul"}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm">
          <div className="absolute inset-x-3 top-3 rounded-[2rem] border border-white/70 bg-white p-5 shadow-2xl shadow-slate-950/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0063f7]">
                  Navigare rapidă
                </p>
                <p className="mt-1 text-lg font-black text-slate-950">
                  AlpinistiUtilitari.ro
                </p>
              </div>
              <button
                type="button"
                aria-label="Închide meniul"
                onClick={() => setOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-2xl border border-slate-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {links.map((link) => {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                      "border-slate-200 bg-white text-slate-800 hover:border-[#0063f7]/30 hover:text-[#0063f7]",
                    ].join(" ")}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="size-4" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 rounded-[1.6rem] bg-[linear-gradient(135deg,#0063f7,#0a3c9e)] p-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                Cerere rapidă
              </p>
              <p className="mt-2 text-sm leading-6 text-white/90">
                Completezi o singură solicitare și revenim cu executanții potriviți.
              </p>
              <Link
                href="/cere-oferta"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-bold text-slate-950"
              >
                Cere ofertă acum
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
