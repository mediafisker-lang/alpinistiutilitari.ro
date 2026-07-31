import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border border-[#DCE4E9] bg-white px-4 text-sm text-[#16202A] outline-none ring-0 placeholder:text-[#829AB1] focus:border-[#176B87] focus:shadow-[0_0_0_4px_rgba(23,107,135,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
