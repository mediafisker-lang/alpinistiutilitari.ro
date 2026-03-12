"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { readVoteAuth, subscribeVoteAuth, writeVoteAuth } from "@/lib/vote-auth";

type Proposal = {
  id: string;
  title: string;
  description: string;
  status: "open" | "closed";
  created_at: string;
  yes_votes: number;
  no_votes: number;
  comments: { id: string; resident_name: string; vote_choice: "yes" | "no"; reason: string | null }[];
};

type FormState = Record<string, { choice: "yes" | "no"; reason: string }>;

export function VoteazaSchimbarileSection() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupEmail, setSetupEmail] = useState("");
  const [setupPhone, setSetupPhone] = useState("");
  const [setupPasswordValue, setSetupPasswordValue] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [setupMessage, setSetupMessage] = useState("");
  const [setupError, setSetupError] = useState("");
  const [forms, setForms] = useState<FormState>({});
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null);
  const [showSetupForm, setShowSetupForm] = useState(false);

  async function loadProposals() {
    const response = await fetch("/api/votes/proposals", { cache: "no-store" });
    const payload = (await response.json()) as { proposals?: Proposal[] };
    setProposals(payload.proposals ?? []);
  }

  useEffect(() => {
    void loadProposals();
    const interval = setInterval(() => {
      void loadProposals();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const syncSession = () => {
      const session = readVoteAuth();
      if (!session) {
        return;
      }

      setEmail(session.email);
      setPassword(session.password);
    };

    syncSession();
    return subscribeVoteAuth(syncSession);
  }, []);

  async function handleSetupPassword() {
    setSetupMessage("");
    setSetupError("");

    const response = await fetch("/api/votes/set-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: setupEmail,
        phone: setupPhone,
        password: setupPasswordValue,
      }),
    });

    const payload = (await response.json()) as { success?: boolean; message?: string };

    if (payload.success) {
      const normalizedEmail = setupEmail.trim().toLowerCase();
      setSetupMessage(payload.message ?? "Parola a fost salvata.");
      setEmail(normalizedEmail);
      setPassword(setupPasswordValue);
      writeVoteAuth({
        email: normalizedEmail,
        password: setupPasswordValue,
      });
      setSetupPasswordValue("");
      setShowSetupForm(false);
      return;
    }

    setSetupError(payload.message ?? "Nu am putut salva parola.");
  }

  async function submitVote(proposalId: string) {
    const form = forms[proposalId];
    if (!form?.choice) {
      setError("Alege Da sau Nu inainte sa trimiti votul.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Introdu emailul si parola folosite la inscriere pentru a vota.");
      return;
    }

    setError("");
    setMessage("");

    const response = await fetch("/api/votes/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
      setMessage(payload.message ?? "Vot inregistrat.");
      writeVoteAuth({
        email: email.trim().toLowerCase(),
        password,
      });
      await loadProposals();
      setForms((current) => ({
        ...current,
        [proposalId]: { choice: form.choice, reason: "" },
      }));
      return;
    }

    setError(payload.message ?? "Nu am putut inregistra votul.");
  }

  function openVotingPanel(proposalId: string) {
    setActiveProposalId(proposalId);
    setShowSetupForm(false);
    setMessage("");
    setError("");
    setSetupMessage("");
    setSetupError("");
  }

  return (
    <section id="voteaza" className="bg-[#f5f7fb]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Voteaza"
          title="Voteaza rapid pe subiectele active din comunitate"
          description="Am restructurat zona de vot intr-un stil mai comercial: vezi instant propunerea, scorul curent si formularul de actiune."
        />

        <div className="mt-8 space-y-6">
          {proposals.map((proposal) => {
            const currentForm = forms[proposal.id] ?? { choice: "yes", reason: "" };
            const isVotingOpen = activeProposalId === proposal.id;

            return (
              <Card key={proposal.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-0">
                <div className="border-b border-slate-200 bg-white p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="mb-3 inline-flex rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#005eb8]">
                        Propunere activa
                      </div>
                      <CardTitle className="text-3xl font-extrabold tracking-tight">
                        {proposal.title}
                      </CardTitle>
                      <CardDescription className="mt-3 text-base">{proposal.description}</CardDescription>
                    </div>
                    {proposal.status === "open" ? (
                      <Button className="min-w-36" onClick={() => openVotingPanel(proposal.id)}>
                        Votez!
                      </Button>
                    ) : null}
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                      <p className="text-sm font-semibold text-[#005eb8]">Voturi pentru</p>
                      <p className="mt-2 text-4xl font-extrabold text-[#005eb8]">{proposal.yes_votes}</p>
                    </div>
                    <div className="rounded-xl border border-rose-100 bg-rose-50 p-5">
                      <p className="text-sm font-semibold text-[#e31e24]">Voturi impotriva</p>
                      <p className="mt-2 text-4xl font-extrabold text-[#e31e24]">{proposal.no_votes}</p>
                    </div>
                  </div>
                </div>

                {proposal.status === "open" && isVotingOpen ? (
                  <div className="bg-slate-50 p-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h3 className="text-2xl font-extrabold text-slate-950">Autentifica-te pentru a vota</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            Introdu emailul si parola alese la inscriere, apoi selecteaza rapid optiunea dorita.
                          </p>
                        </div>
                        <Link
                          href="#inscriere"
                          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#005eb8] px-5 text-sm font-semibold text-white transition hover:bg-[#004799]"
                        >
                          Vreau sa ma inscriu
                        </Link>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor={`vote-email-${proposal.id}`}>Email</Label>
                          <Input
                            id={`vote-email-${proposal.id}`}
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Ex: nume@email.ro"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`vote-password-${proposal.id}`}>Parola</Label>
                          <Input
                            id={`vote-password-${proposal.id}`}
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Parola aleasa la inscriere"
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() =>
                            setForms((current) => ({
                              ...current,
                              [proposal.id]: { ...currentForm, choice: "yes" },
                            }))
                          }
                          className={`h-11 rounded-xl px-5 text-sm font-semibold ${
                            currentForm.choice === "yes"
                              ? "bg-[#005eb8] text-white"
                              : "border border-slate-200 bg-white text-slate-900"
                          }`}
                        >
                          Sunt pentru
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setForms((current) => ({
                              ...current,
                              [proposal.id]: { ...currentForm, choice: "no" },
                            }))
                          }
                          className={`h-11 rounded-xl px-5 text-sm font-semibold ${
                            currentForm.choice === "no"
                              ? "bg-[#e31e24] text-white"
                              : "border border-slate-200 bg-white text-slate-900"
                          }`}
                        >
                          Sunt impotriva
                        </button>
                      </div>

                      <div className="mt-6">
                        <Label htmlFor={`reason-${proposal.id}`}>Motivul tau</Label>
                        <Textarea
                          id={`reason-${proposal.id}`}
                          value={currentForm.reason}
                          onChange={(event) =>
                            setForms((current) => ({
                              ...current,
                              [proposal.id]: { ...currentForm, reason: event.target.value },
                            }))
                          }
                          placeholder="Scrie pe scurt motivul tau."
                          className="mt-2"
                        />
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button onClick={() => submitVote(proposal.id)}>Trimite votul</Button>
                        <Button variant="secondary" onClick={() => setShowSetupForm((current) => !current)}>
                          Mi-am facut inscrierea inainte de parola
                        </Button>
                      </div>

                      {message ? (
                        <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-[#005eb8]">
                          {message}
                        </p>
                      ) : null}
                      {error ? (
                        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                          {error}
                        </p>
                      ) : null}

                      {showSetupForm ? (
                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                          <h4 className="text-base font-extrabold text-slate-950">
                            Seteaza parola daca ai o inscriere mai veche
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            Foloseste emailul si telefonul deja salvate pentru a activa parola de vot.
                          </p>

                          <div className="mt-5 space-y-4">
                            <div>
                              <Label htmlFor="setup-email">Email</Label>
                              <Input
                                id="setup-email"
                                type="email"
                                value={setupEmail}
                                onChange={(event) => setSetupEmail(event.target.value)}
                                placeholder="Emailul folosit la inscriere"
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="setup-phone">Telefon</Label>
                              <Input
                                id="setup-phone"
                                value={setupPhone}
                                onChange={(event) => setSetupPhone(event.target.value)}
                                placeholder="Telefonul folosit la inscriere"
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="setup-password">Parola noua</Label>
                              <Input
                                id="setup-password"
                                type="password"
                                value={setupPasswordValue}
                                onChange={(event) => setSetupPasswordValue(event.target.value)}
                                placeholder="Alege o parola de cel putin 8 caractere"
                                className="mt-2"
                              />
                            </div>
                            <Button onClick={handleSetupPassword}>Seteaza parola pentru vot</Button>
                          </div>

                          {setupMessage ? (
                            <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-[#005eb8]">
                              {setupMessage}
                            </p>
                          ) : null}
                          {setupError ? (
                            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                              {setupError}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {proposal.status === "closed" ? (
                  <p className="mx-6 my-6 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                    Votul pentru acest subiect este inchis.
                  </p>
                ) : null}

                <div className="border-t border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-extrabold text-slate-950">Mesaje din comunitate</h3>
                  <div className="mt-4 space-y-3">
                    {proposal.comments.length ? (
                      proposal.comments.map((comment) => (
                        <div key={comment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-950">{comment.resident_name}</p>
                            <span
                              className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                                comment.vote_choice === "yes"
                                  ? "bg-blue-50 text-[#005eb8]"
                                  : "bg-rose-50 text-[#e31e24]"
                              }`}
                            >
                              {comment.vote_choice === "yes" ? "Da" : "Nu"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {comment.reason || "Fara mesaj adaugat."}
                          </p>
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
          {!proposals.length ? (
            <Card className="rounded-2xl">
              <CardTitle>Nu exista inca subiecte active pentru vot</CardTitle>
              <CardDescription className="mt-3">
                Cand administratorul adauga un subiect nou din panoul de administrare, acesta va aparea aici.
              </CardDescription>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  );
}
