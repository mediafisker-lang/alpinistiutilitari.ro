import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  descriptionClassName,
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  descriptionClassName?: string;
}) {
  return (
    <div className={`max-w-2xl space-y-4 ${className ?? ""}`.trim()}>
      <Badge>{eyebrow}</Badge>
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h2>
        <p className={`text-base leading-7 text-slate-600 ${descriptionClassName ?? ""}`.trim()}>
          {description}
        </p>
      </div>
    </div>
  );
}
