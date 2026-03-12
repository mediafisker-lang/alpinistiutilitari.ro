import { CheckCircle2, Circle } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { AssociationProgress } from "@/types/database";

export function ProgressSection({ items }: { items: AssociationProgress[] }) {
  return (
    <section id="stadiu" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Stadiul legal al asociației"
        title="Documentația este pregătită. Acum suntem în etapa operațională."
        description="Mai jos vezi pe scurt pașii parcurși și punctul în care se află acum demersul."
      />
      {items.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="h-full">
              <div className="mb-4 flex items-center gap-3">
                {item.completed ? (
                  <CheckCircle2 className="size-6 text-emerald-600" />
                ) : (
                  <Circle className="size-6 text-slate-300" />
                )}
                <span className="text-sm font-semibold text-slate-500">
                  Pasul {item.step_order}
                </span>
              </div>
              <CardTitle>{item.step_title}</CardTitle>
              <CardDescription className="mt-3">{item.description}</CardDescription>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-8">
          <CardTitle>Stadiul va fi publicat aici</CardTitle>
          <CardDescription className="mt-3">
            Secțiunea este pregătită. După ce adaugi pașii reali în baza de date,
            vor apărea automat aici.
          </CardDescription>
        </Card>
      )}
    </section>
  );
}
