"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchCurrentClientIp } from "@/lib/client-ip";
import { formatDate } from "@/lib/utils";
import { readVoteAuth, subscribeVoteAuth, writeVoteAuth } from "@/lib/vote-auth";

type Proposal = {
  id: string;
  title: string;
  description: string;
  status: "open" | "closed";
  yes_votes: number;
  no_votes: number;
  comments: {
    id: string;
    resident_name: string;
    vote_choice: "yes" | "no";
    reason: string | null;
    created_at: string;
  }[];
};

type VoteChoice = "yes" | "no";
type FormState = Record<string, { choice: VoteChoice; reason: string }>;

const voteOptions = [
  {
    value: "yes" as const,
    title: "Sunt pentru",
    description: "Sustin propunerea.",
    activeClassName: "border-[#005eb8] bg-blue-50 text-[#005eb8]",
  },
  {
    value: "no" as const,
    title: "Sunt impotriva",
    description: "Nu sunt de acord.",
    activeClassName: "border-[#e31e24] bg-rose-50 text-[#e31e24]",
  },
];

const authTitle = "Nu esti logat/inregistrat.";
const authText = "Intra in cont sau mergi la inregistrare ca sa poti vota.";
const maxCommentLength = 700;

const voteGalleryImages = [
  "/images/cortina/cortina-north-comunitate-11.webp",
  "/images/cortina/cortina-north-comunitate-12.webp",
  "/images/cortina/cortina-north-comunitate-13.webp",
];

export function VoteazaSchimbarileSection() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [forms, setForms] = useState<FormState>({});
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [currentIp, setCurrentIp] = useState("");

  async function loadProposals() {
    const response = await fetch("/api/votes/proposals", { cache: "no-store" });
    const payload = (await response.json()) as { proposals?: Proposal[] };
    setProposals(payload.proposals ?? []);
  }

  useEffect(() => {
    void loadProposals();
    const interval = setInterval(() => void loadProposals(), 8000);
    return () => clearInterval(interval);
  }, []);

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
      setEmail(session?.email ?? "");
      setPassword(session?.password ?? "");

      if (session?.email && session?.password) {
        setShowAuthPrompt(false);
        setShowLoginForm(false);
        setLoginError("");
      }
    };

    syncSession();
    return subscribeVoteAuth(syncSession);
  }, [currentIp]);

  function openVotingPanel(proposalId: string) {
    setActiveProposalId(proposalId);
    setMessage("");
    setError("");
    setLoginError("");
    const session = readVoteAuth(currentIp);
    setShowAuthPrompt(!session?.email || !session?.password);
    setShowLoginForm(false);
  }

  async function handleInlineLogin() {
    setLoginLoading(true);
    setLoginError("");

    const response = await fetch("/api/votes/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const payload = (await response.json()) as { success?: boolean; email?: string; message?: string };

    if (payload.success && payload.email) {
      const ipToUse = currentIp || (await fetchCurrentClientIp());
      if (ipToUse && ipToUse !== currentIp) {
        setCurrentIp(ipToUse);
      }

      writeVoteAuth({ email: payload.email, password }, ipToUse);
      setShowAuthPrompt(false);
      setShowLoginForm(false);
      setLoginLoading(false);
      return;
    }

    setLoginError(payload.message ?? "Nu am putut face autentificarea.");
    setLoginLoading(false);
  }

  async function submitVote(proposalId: string) {
    const form = forms[proposalId];
    if (!form?.choice) {
      setError("Alege optiunea de vot inainte sa trimiti.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setShowAuthPrompt(true);
      setShowLoginForm(false);
      setError("");
      return;
    }

    setError("");
    setMessage("");

    const response = await fetch("/api/votes/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proposalId,
        email,
        password,
        choice: form.choice,
        reason: form.reason,
      }),
    });

    const payload = (await response.json()) as { success?: boolean; message?: string };

    if (payload.success) {
      const ipToUse = currentIp || (await fetchCurrentClientIp());
      if (ipToUse && ipToUse !== currentIp) {
        setCurrentIp(ipToUse);
      }

      writeVoteAuth({ email: email.trim().toLowerCase(), password }, ipToUse);
      setMessage("Multumim pentru ca ati votat, parerea dvs conteaza!");
      setForms((current) => ({
        ...current,
        [proposalId]: { choice: form.choice, reason: "" },
      }));
      await loadProposals();
      return;
    }

    setError(payload.message ?? "Nu am putut inregistra votul.");
  }

  const activeProposals = proposals.filter((proposal) => proposal.status === "open");

  return (
    <section id="voteaza" className="bg-[#f5f7fb]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-4">
          <Badge>Voteaza propuneri</Badge>
          <div className="space-y-3">
            <h2 className="max-w-5xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Voteaza usor, vezi rezultatele si lasa un comentariu optional.
            </h2>
            <p className="text-base leading-7 text-slate-600">
              Fiecare comentariu afiseaza numele rezidentului si data/ora publicarii.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {voteGalleryImages.map((imageSrc, index) => (
              <div key={imageSrc} className="relative h-36 overflow-hidden rounded-2xl border border-slate-200">
                <Image
                  src={imageSrc}
                  alt={`Cortina North vot si comunitate ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {activeProposals.map((proposal, index) => {
            const currentForm = forms[proposal.id] ?? { choice: "yes" as VoteChoice, reason: "" };
            const isVotingOpen = activeProposalId === proposal.id;
            const previewImage = voteGalleryImages[index % voteGalleryImages.length];

            return (
              <Card key={proposal.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-0">
                <div className="border-b border-slate-200 bg-white p-4 sm:p-6">
                  <div className="grid gap-4 md:grid-cols-[160px_minmax(0,1fr)] md:items-start">
                    <div className="relative h-28 overflow-hidden rounded-xl border border-slate-200 md:h-32">
                      <Image
                        src={previewImage}
                        alt={`Imagine propunere ${proposal.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 160px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
                    </div>
                    <div>
                      <div className="mb-3 inline-flex rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#005eb8]">
                        Propunere activa
                      </div>
                      <CardTitle className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                        {proposal.title}
                      </CardTitle>
                      <CardDescription className="mt-3 text-sm leading-7 sm:text-base">
                        {proposal.description}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="mt-4 grid max-w-xs grid-cols-2 gap-2">
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                      <p className="text-xs font-semibold text-[#005eb8]">Pentru</p>
                      <p className="mt-1 text-xl font-extrabold text-[#005eb8]">{proposal.yes_votes}</p>
                    </div>
                    <div className="rounded-xl border border-rose-100 bg-rose-50 p-3">
                      <p className="text-xs font-semibold text-[#e31e24]">Impotriva</p>
                      <p className="mt-1 text-xl font-extrabold text-[#e31e24]">{proposal.no_votes}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button className="w-full sm:min-w-44 sm:w-auto" onClick={() => openVotingPanel(proposal.id)}>
                      Voteaza
                    </Button>
                  </div>
                </div>

                {isVotingOpen ? (
                  <div className="bg-slate-50 p-4 sm:p-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                      {showAuthPrompt ? (
                        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-5">
                          <p className="text-base font-semibold text-amber-950">{authTitle}</p>
                          <p className="mt-2 text-sm leading-6 text-amber-900">{authText}</p>
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
                                  value={email}
                                  onChange={(event) => setEmail(event.target.value)}
                                  placeholder="Email"
                                />
                                <Input
                                  type="password"
                                  value={password}
                                  onChange={(event) => setPassword(event.target.value)}
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
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            {voteOptions.map((option) => {
                              const isActive = currentForm.choice === option.value;

                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() =>
                                    setForms((current) => ({
                                      ...current,
                                      [proposal.id]: { ...currentForm, choice: option.value },
                                    }))
                                  }
                                  className={`rounded-2xl border p-4 text-left transition ${
                                    isActive
                                      ? option.activeClassName
                                      : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="text-base font-semibold">{option.title}</p>
                                      <p className="mt-2 text-sm leading-6 text-slate-500">{option.description}</p>
                                    </div>
                                    {isActive ? (
                                      <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                                    ) : (
                                      <Circle className="mt-0.5 size-5 shrink-0 text-slate-300" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                            <label htmlFor={`reason-${proposal.id}`} className="text-sm font-semibold text-slate-900">
                              Comentariu (optional)
                            </label>
                            <Textarea
                              id={`reason-${proposal.id}`}
                              value={currentForm.reason}
                              onChange={(event) =>
                                setForms((current) => ({
                                  ...current,
                                  [proposal.id]: { ...currentForm, reason: event.target.value },
                                }))
                              }
                              placeholder="Poti lasa un comentariu care va fi afisat cu numele tau si data/ora."
                              className="mt-2"
                              maxLength={maxCommentLength}
                            />
                            <p className="mt-2 text-xs text-slate-500">
                              {currentForm.reason.length}/{maxCommentLength} caractere
                            </p>
                          </div>

                          <div className="pt-1">
                            <Button className="w-full sm:w-auto" onClick={() => submitVote(proposal.id)}>
                              Trimite votul
                            </Button>
                          </div>

                          {message ? (
                            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                              {message}
                            </p>
                          ) : null}
                          {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                <div className="border-t border-slate-200 bg-white p-4 sm:p-6">
                  <h3 className="text-lg font-extrabold text-slate-950">Mesaje din comunitate</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Fiecare comentariu afiseaza numele rezidentului si data/ora publicarii.
                  </p>
                  <div className="mt-4 space-y-3">
                    {proposal.comments.length ? (
                      proposal.comments.map((comment) => (
                        <div key={comment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-950">{comment.resident_name}</p>
                              <p className="text-xs text-slate-500">{formatDate(comment.created_at)}</p>
                            </div>
                            <span
                              className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                                comment.vote_choice === "yes" ? "bg-blue-50 text-[#005eb8]" : "bg-rose-50 text-[#e31e24]"
                              }`}
                            >
                              {comment.vote_choice === "yes" ? "Da" : "Nu"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{comment.reason || "Fara mesaj adaugat."}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Nu exista inca mesaje pentru acest subiect.</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {!activeProposals.length ? (
            <Card className="rounded-2xl">
              <CardTitle>Nu exista inca propuneri active pentru vot</CardTitle>
              <CardDescription className="mt-3">
                Cand administratorul adauga un subiect nou si il marcheaza activ, acesta va aparea aici.
              </CardDescription>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  );
}
