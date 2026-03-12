import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-[#005eb8] focus:ring-4 focus:ring-blue-100",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";

export { Input };
