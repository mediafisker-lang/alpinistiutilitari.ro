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
        "inline-flex items-center rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#005eb8]",
        className,
      )}
    >
      {children}
    </span>
  );
}
