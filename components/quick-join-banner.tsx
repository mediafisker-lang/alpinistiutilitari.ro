import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function QuickJoinBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <div className="surface-3d overflow-hidden rounded-[2rem] border border-white/40 bg-[linear-gradient(120deg,#081326_0%,#0b2a56_45%,#7b1631_100%)] px-6 py-6 text-white shadow-[0_24px_60px_rgba(8,19,38,0.28)] sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
              <Sparkles className="size-3.5" />
              Acces rapid in comunitate
            </div>
            <p className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Inscrie-te acum si intra direct in fluxul real de informatii, vot si sesizari.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/80 sm:text-base">
              Dureaza sub un minut si vezi imediat ce se intampla in complex, fara sa mai cauti prin grupuri si mesaje pierdute.
            </p>
          </div>
          <a href="#inscriere">
            <Button
              size="lg"
              className="min-w-52 border border-white/30 bg-white text-slate-950 shadow-[0_18px_36px_rgba(0,0,0,0.18)] hover:bg-white/95"
            >
              Vreau sa ma inscriu
              <ArrowRight className="size-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
