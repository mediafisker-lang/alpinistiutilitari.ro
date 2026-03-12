import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { UpdateItem } from "@/types/database";

export function UpdatesSection({ updates }: { updates: UpdateItem[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Actualizări"
        title="Actualizări scurte, publice și ușor de urmărit"
        description="Aici apar noutățile importante pentru proprietari și rezidenți."
      />
      {updates.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {updates.map((update) => (
            <Card key={update.id}>
              <p className="text-sm text-slate-500">{formatDate(update.created_at)}</p>
              <CardTitle className="mt-4">{update.title}</CardTitle>
              <CardDescription className="mt-3">{update.content}</CardDescription>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-8">
          <CardTitle>Nu există încă actualizări publicate</CardTitle>
          <CardDescription className="mt-3">
            Prima actualizare va apărea aici după ce adaugi conținut în tabela `updates`.
          </CardDescription>
        </Card>
      )}
    </section>
  );
}
