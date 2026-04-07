import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6d786] focus-visible:ring-offset-2 ring-offset-[#090806] active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default:
          "border border-[#d7b36a] bg-[linear-gradient(120deg,#b88a2d_0%,#f1cc78_45%,#9b7226_100%)] text-[#201507] shadow-[0_14px_28px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 hover:brightness-[1.03] hover:shadow-[0_20px_36px_rgba(0,0,0,0.5)]",
        secondary:
          "border border-[#8b6a2f] bg-[linear-gradient(180deg,rgba(34,25,13,0.92)_0%,rgba(22,17,10,0.9)_100%)] text-[#f3dfb1] shadow-[0_10px_20px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 hover:border-[#d7b36a] hover:shadow-[0_16px_30px_rgba(0,0,0,0.46)]",
        outline:
          "border border-[#d7b36a] bg-transparent text-[#f3dfb1] shadow-[0_10px_20px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:bg-[#21170d] hover:shadow-[0_14px_28px_rgba(0,0,0,0.44)]",
      },
      size: {
        default: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        sm: "h-9 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
