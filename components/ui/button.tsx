import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b63ce] focus-visible:ring-offset-2 ring-offset-white active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default:
          "border border-[#0b63ce] bg-[linear-gradient(180deg,#0d72e8_0%,#0b63ce_100%)] text-white shadow-[0_10px_22px_rgba(11,99,206,0.28)] hover:-translate-y-0.5 hover:brightness-[1.02] hover:shadow-[0_16px_30px_rgba(11,99,206,0.32)]",
        secondary:
          "border border-slate-300 bg-[linear-gradient(180deg,#ffffff_0%,#f5f8fb_100%)] text-slate-800 shadow-[0_8px_18px_rgba(15,23,42,0.1)] hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white",
        outline:
          "border border-slate-400 bg-transparent text-slate-800 shadow-[0_6px_14px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-[0_10px_20px_rgba(15,23,42,0.12)]",
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
