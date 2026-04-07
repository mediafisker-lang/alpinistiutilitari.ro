"use client";

import { Facebook, MessageCircleMore, Users } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { useVoteSession } from "@/components/use-vote-session";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { CommunityLink } from "@/types/database";

function iconForType(type: CommunityLink["type"]) {
  if (type === "whatsapp") {
    return MessageCircleMore;
  }

  if (type === "facebook_group") {
    return Users;
  }

  return Facebook;
}

export function CommunitySection({ links }: { links: CommunityLink[] }) {
  const { isLoggedIn } = useVoteSession();

  function openLink(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleProtectedLinkClick(url: string) {
    if (isLoggedIn) {
      openLink(url);
      return;
    }

    window.alert("Necesita Logare/Inregistrare");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section id="comunitate" className="scroll-mt-24 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow="Comunitate"
          title="Canale discutii, informatii comunitate, vanzari/bazar."
          description="Aici gasesti principalele canale de comunicare ale comunitatii."
        />
        {links.length ? (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {links.map((link) => {
                const Icon = iconForType(link.type);

                return (
                  <Card key={link.id} className="flex h-full flex-col justify-between p-5 sm:p-6">
                    <div>
                      <Icon
                        className={`size-7 sm:size-8 ${
                          link.type === "whatsapp"
                            ? "text-emerald-600"
                            : link.type === "facebook_group"
                              ? "text-sky-600"
                              : "text-[#1877f2]"
                        }`}
                      />
                      <CardTitle className="mt-4 sm:mt-5">{link.label}</CardTitle>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleProtectedLinkClick(link.url)}
                      className="mt-5 sm:mt-6"
                    >
                      <Button variant="secondary" className="w-full">
                        Deschide linkul
                      </Button>
                    </button>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <Card className="mt-8">
            <CardTitle>Linkurile comunitatii nu sunt publicate inca</CardTitle>
            <CardDescription className="mt-3">
              Dupa ce adaugi linkurile reale in `community_links`, ele vor aparea automat aici.
            </CardDescription>
          </Card>
        )}
      </div>
    </section>
  );
}
