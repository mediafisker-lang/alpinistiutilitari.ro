"use client";

import Image from "next/image";
import { Facebook, MessageCircleMore, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { useVoteSession } from "@/components/use-vote-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { fetchCurrentClientIp } from "@/lib/client-ip";
import { writeVoteAuth } from "@/lib/vote-auth";
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

const communityCoverImages = [
  "/images/cortina/cortina-north-comunitate-01.webp",
  "/images/cortina/cortina-north-comunitate-02.webp",
  "/images/cortina/cortina-north-comunitate-03.webp",
];

export function CommunitySection({ links }: { links: CommunityLink[] }) {
  const { currentIp, isLoggedIn } = useVoteSession();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  function openLink(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleProtectedLinkClick(url: string) {
    if (isLoggedIn) {
      openLink(url);
      return;
    }

    setPendingUrl(url);
    setShowAuthPrompt(true);
    setShowLoginForm(false);
    setLoginError("");
  }

  async function handleInlineLogin() {
    setLoginLoading(true);
    setLoginError("");

    const response = await fetch("/api/votes/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    const payload = (await response.json()) as {
      success?: boolean;
      email?: string;
      message?: string;
    };

    if (payload.success && payload.email) {
      const ipToUse = currentIp || (await fetchCurrentClientIp());
      writeVoteAuth(
        {
          email: payload.email,
          password: loginPassword,
        },
        ipToUse,
      );
      setLoginLoading(false);
      setShowAuthPrompt(false);
      setShowLoginForm(false);
      setLoginError("");

      if (pendingUrl) {
        openLink(pendingUrl);
        setPendingUrl("");
      }
      return;
    }

    setLoginError(payload.message ?? "Nu am putut face autentificarea.");
    setLoginLoading(false);
    setShowLoginForm(true);
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
              {links.map((link, index) => {
                const Icon = iconForType(link.type);
                const imageSrc = communityCoverImages[index % communityCoverImages.length];

                return (
                  <Card key={link.id} className="flex h-full flex-col justify-between p-5 sm:p-6">
                    <div>
                      <div className="relative h-36 overflow-hidden rounded-xl border border-slate-200">
                        <Image
                          src={imageSrc}
                          alt={`Canal comunitate ${link.label}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
                      </div>
                      <Icon
                        className={`mt-4 size-7 sm:size-8 ${
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

            {showAuthPrompt ? (
              <Card className="mt-6 border-amber-200 bg-amber-50">
                <CardTitle className="text-amber-950">
                  Trebuie sa fii logat ca sa poti vota.
                </CardTitle>
                <CardDescription className="mt-3 text-amber-900">
                  Intra in cont sau mergi la inregistrare daca nu ai parola inca.
                </CardDescription>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowLoginForm((current) => !current)}
                    className="rounded-xl bg-[#005eb8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004799]"
                  >
                    Login
                  </button>
                  <Link
                    href="/inregistrare"
                    className="rounded-xl border border-amber-300 bg-white px-4 py-3 text-center text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
                  >
                    Inregistreaza-te
                  </Link>
                </div>

                {showLoginForm ? (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-white p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        type="email"
                        value={loginEmail}
                        onChange={(event) => setLoginEmail(event.target.value)}
                        placeholder="Email"
                      />
                      <Input
                        type="password"
                        value={loginPassword}
                        onChange={(event) => setLoginPassword(event.target.value)}
                        placeholder="Parola"
                      />
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={handleInlineLogin}
                        disabled={loginLoading}
                        className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {loginLoading ? "Se verifica..." : "Login"}
                      </button>
                    </div>
                    {loginError ? <p className="mt-3 text-sm text-rose-700">{loginError}</p> : null}
                  </div>
                ) : null}
              </Card>
            ) : null}
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
