import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "field-3d flex h-11 w-full rounded-xl px-4 text-sm text-[#f6ebd3] placeholder:text-[#bea987] outline-none",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";

export { Input };
