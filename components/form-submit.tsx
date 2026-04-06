"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function FormSubmit({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Se trimite..." : label}
    </Button>
  );
}
