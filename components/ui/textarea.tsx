import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-xl border border-[#DCE4E9] bg-white px-4 py-3 text-sm text-[#16202A] outline-none placeholder:text-[#829AB1] focus:border-[#176B87] focus:shadow-[0_0_0_4px_rgba(23,107,135,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
