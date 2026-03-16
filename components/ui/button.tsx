import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005eb8] focus-visible:ring-offset-2 ring-offset-white active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default:
          "border border-white/30 bg-[linear-gradient(120deg,#ef233c_0%,#a8347b_42%,#005eb8_100%)] text-white shadow-[0_18px_34px_rgba(0,94,184,0.24)] hover:-translate-y-0.5 hover:brightness-[1.02] hover:shadow-[0_22px_40px_rgba(0,94,184,0.28)]",
        secondary:
          "border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] text-slate-900 shadow-[0_12px_24px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-[0_18px_30px_rgba(0,94,184,0.12)]",
        outline:
          "border border-[#005eb8]/25 bg-[linear-gradient(180deg,#ffffff_0%,#eef5ff_100%)] text-[#005eb8] shadow-[0_12px_24px_rgba(0,94,184,0.08)] hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-[0_18px_28px_rgba(0,94,184,0.14)]",
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
