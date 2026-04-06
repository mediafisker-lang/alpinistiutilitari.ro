import * as React from "react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "field-3d flex h-11 w-full rounded-xl px-4 text-sm text-slate-950 outline-none",
        className,
      )}
      {...props}
    />
  ),
);

Select.displayName = "Select";

export { Select };
