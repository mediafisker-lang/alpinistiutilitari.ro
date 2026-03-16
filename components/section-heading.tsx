import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  return (
    <div className={`max-w-2xl space-y-3 sm:space-y-4 ${className ?? ""}`.trim()}>
      <Badge>{eyebrow}</Badge>
      <div className="space-y-3">
        <h2
          className={`text-[1.95rem] font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl ${
            titleClassName ?? ""
          }`.trim()}
        >
          {title}
        </h2>
        <p className={`text-[15px] leading-7 text-slate-600 sm:text-base ${descriptionClassName ?? ""}`.trim()}>
          {description}
        </p>
      </div>
    </div>
  );
}
