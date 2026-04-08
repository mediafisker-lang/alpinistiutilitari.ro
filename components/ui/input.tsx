import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-[#0063f7]/40 focus:shadow-[0_0_0_4px_rgba(0,99,247,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
