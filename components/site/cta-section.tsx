import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CtaSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  primaryAction?: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
};

export function CTASection({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  primaryAction,
  secondaryAction,
}: CtaSectionProps) {
  const resolvedPrimaryHref = primaryAction?.href ?? primaryHref ?? "/";
  const resolvedPrimaryLabel = primaryAction?.label ?? primaryLabel ?? "Vezi mai mult";
  const resolvedSecondaryHref = secondaryAction?.href ?? secondaryHref;
  const resolvedSecondaryLabel = secondaryAction?.label ?? secondaryLabel;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-8 text-white shadow-xl shadow-slate-950/10">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">{eyebrow}</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={resolvedPrimaryHref}>
          <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100">
            {resolvedPrimaryLabel}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
        {resolvedSecondaryHref && resolvedSecondaryLabel ? (
          <Link href={resolvedSecondaryHref}>
            <Button
              size="lg"
              variant="secondary"
              className="border border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              {resolvedSecondaryLabel}
            </Button>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
