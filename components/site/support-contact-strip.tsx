import { Headphones, MessageCircleMore, Phone } from "lucide-react";

export function SupportContactStrip() {
  return (
    <section
      aria-label="Suport online WhatsApp și telefonic"
      className="mt-8 overflow-hidden rounded-2xl border border-[#176B87]/25 bg-[linear-gradient(135deg,#102A43_0%,#17445C_58%,#176B87_100%)] p-5 text-white shadow-[0_18px_48px_rgba(16,42,67,0.18)] sm:p-6"
    >
      <div className="grid items-center gap-5 lg:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#7FE1B5] ring-1 ring-white/15">
            <Headphones className="size-6" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">
              Ai nevoie de ajutor?
            </p>
            <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
              Suport online WhatsApp / telefonic
            </h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="https://wa.me/40799102030"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(16,185,129,0.28)] transition hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200/50"
          >
            <span className="absolute left-5 size-8 animate-ping rounded-full bg-white/20" aria-hidden="true" />
            <span className="relative flex size-9 items-center justify-center rounded-full bg-white/15">
              <MessageCircleMore className="size-5" />
            </span>
            <span className="relative">WhatsApp online</span>
          </a>
          <a
            href="tel:+40799102030"
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-white/30 bg-white px-5 py-3 text-sm font-bold text-[#102A43] shadow-[0_12px_28px_rgba(2,12,27,0.18)] transition hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-white/30"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#E8F0F3] text-[#176B87]">
              <Phone className="size-5" />
            </span>
            Sună 0799 102 030
          </a>
        </div>
      </div>
    </section>
  );
}
