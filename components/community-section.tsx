import { Facebook, MessageCircleMore } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { CommunityLink } from "@/types/database";

function iconForType(type: CommunityLink["type"]) {
  if (type === "whatsapp") {
    return MessageCircleMore;
  }

  return Facebook;
}

export function CommunitySection({ links }: { links: CommunityLink[] }) {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Comunitate"
          title="Canale simple pentru discuții și anunțuri"
          description="Aici găsești principalele canale de comunicare ale comunității."
        />
        {links.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {links.map((link) => {
              const Icon = iconForType(link.type);

              return (
                <Card key={link.id}>
                  <Icon className="size-8 text-emerald-600" />
                  <CardTitle className="mt-5">{link.label}</CardTitle>
                  <CardDescription className="mt-3">
                    Deschide canalul într-o filă nouă.
                  </CardDescription>
                  <a href={link.url} target="_blank" rel="noreferrer" className="mt-6 inline-block">
                    <Button variant="secondary" className="w-full">
                      Deschide linkul
                    </Button>
                  </a>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="mt-8">
            <CardTitle>Linkurile comunității nu sunt publicate încă</CardTitle>
            <CardDescription className="mt-3">
              După ce adaugi linkurile reale în `community_links`, ele vor apărea automat aici.
            </CardDescription>
          </Card>
        )}
      </div>
    </section>
  );
}
