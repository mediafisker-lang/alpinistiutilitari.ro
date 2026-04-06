import { CheckCircle2, Circle } from "lucide-react";

import { ProgressDetailsPanel } from "@/components/progress-details-panel";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { AssociationProgress } from "@/types/database";

export function ProgressSection({ items }: { items: AssociationProgress[] }) {
  return (
    <section id="stadiu" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="Stadiul legal al asociatiei"
        title="Documentatia este pregatita. Acum suntem in etapa operationala."
        description="Mai jos vezi pe scurt pasii parcursi si punctul in care se afla acum demersul."
        className="max-w-5xl"
        titleClassName="lg:whitespace-nowrap"
      />
      {items.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="h-full p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                {item.completed ? (
                  <CheckCircle2 className="size-6 text-emerald-600" />
                ) : (
                  <Circle className="size-6 text-slate-300" />
                )}
                <span className="text-sm font-semibold text-slate-500">Pasul {item.step_order}</span>
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
            Sectiunea este pregatita. Dupa ce adaugi pasii reali in baza de date, vor aparea
            automat aici.
          </CardDescription>
        </Card>
      )}
      <ProgressDetailsPanel />
    </section>
  );
}
