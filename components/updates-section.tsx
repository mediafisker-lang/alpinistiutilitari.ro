import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { UpdateItem } from "@/types/database";

export function UpdatesSection({ updates }: { updates: UpdateItem[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        eyebrow="Actualizari"
        title="Actualizari scurte, publice si usor de urmarit"
        description="Aici apar noutatile importante pentru proprietari si rezidenti."
      />
      {updates.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {updates.map((update) => (
            <Link key={update.id} href="/#detalii-etape">
              <Card className="h-full p-5 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md sm:p-6">
                <p className="text-sm text-slate-500">{formatDate(update.created_at)}</p>
                <CardTitle className="mt-4">{update.title}</CardTitle>
                <CardDescription className="mt-3">{update.content}</CardDescription>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="mt-8 p-5 sm:p-6">
          <CardTitle>Nu exista inca actualizari publicate</CardTitle>
          <CardDescription className="mt-3">
            Prima actualizare va aparea aici dupa ce adaugi continut in tabela `updates`.
          </CardDescription>
        </Card>
      )}
    </section>
  );
}
