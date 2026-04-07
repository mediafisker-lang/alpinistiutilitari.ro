import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border border-[#c89a47] bg-[rgba(35,26,14,0.82)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#f1cb79]",
        className,
      )}
    >
      {children}
    </span>
  );
}
