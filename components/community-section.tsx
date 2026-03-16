"use client";

import Link from "next/link";
import { Facebook, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchCurrentClientIp } from "@/lib/client-ip";
import { readVoteAuth, subscribeVoteAuth, writeVoteAuth } from "@/lib/vote-auth";
import type { CommunityLink } from "@/types/database";

function iconForType(type: CommunityLink["type"]) {
  if (type === "whatsapp") {
    return MessageCircleMore;
  }

  return Facebook;
}

export function CommunitySection({ links }: { links: CommunityLink[] }) {
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [currentIp, setCurrentIp] = useState("");

  useEffect(() => {
    let isMounted = true;

    void fetchCurrentClientIp().then((ip) => {
      if (!isMounted) {
        return;
      }

      setCurrentIp(ip);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const syncSession = () => {
      const session = readVoteAuth(currentIp);
      setLoggedInEmail(session?.email ?? "");
      setPassword(session?.password ?? "");
    };

    syncSession();
    return subscribeVoteAuth(syncSession);
  }, [currentIp]);

  function openLink(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleProtectedLinkClick(url: string) {
    const session = readVoteAuth(currentIp);

    if (session?.email && session?.password) {
      openLink(url);
      return;
    }

    setPendingUrl(url);
    setShowAuthPrompt(true);
    setShowLoginForm(false);
    setLoginError("");
  }

  async function handleLogin() {
    setLoginLoading(true);
    setLoginError("");

    const response = await fetch("/api/votes/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loggedInEmail,
        password,
      }),
    });

    const payload = (await response.json()) as {
      success?: boolean;
      email?: string;
      message?: string;
    };

    if (payload.success && payload.email) {
      const ipToUse = currentIp || (await fetchCurrentClientIp());
      if (ipToUse && ipToUse !== currentIp) {
        setCurrentIp(ipToUse);
      }
      writeVoteAuth({
        email: payload.email,
        password,
      }, ipToUse);
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
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow="Comunitate"
          title="Canale simple pentru discutii si anunturi"
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
                      <Icon className="size-7 text-emerald-600 sm:size-8" />
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
                  Trebuie sa fii logat ca sa poti trimite o sesizare.
                </CardTitle>
                <CardDescription className="mt-3 text-amber-900">
                  Pentru trimitere, intra in cont sau mergi la inscriere daca nu ai parola inca.
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
                    href="/#inscriere"
                    className="rounded-xl border border-amber-300 bg-white px-4 py-3 text-center text-sm font-semibold text-amber-950 transition hover:bg-amber-100"
                  >
                    Inscriere
                  </Link>
                </div>

                {showLoginForm ? (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-white p-4">
                    <div className="grid gap-3">
                      <Input
                        type="email"
                        value={loggedInEmail}
                        onChange={(event) => setLoggedInEmail(event.target.value)}
                        placeholder="Email"
                      />
                      <Input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Parola"
                      />
                      <button
                        type="button"
                        onClick={handleLogin}
                        disabled={loginLoading}
                        className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {loginLoading ? "Se verifica..." : "Login"}
                      </button>
                      {loginError ? <p className="text-sm text-rose-700">{loginError}</p> : null}
                    </div>
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
