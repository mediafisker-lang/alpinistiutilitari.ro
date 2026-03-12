"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/section-heading";

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
      setSetupMessage(payload.message ?? "Parola a fost salvată.");
      setEmail(setupEmail.trim().toLowerCase());
      setPassword(setupPasswordValue);
      setSetupPasswordValue("");
      return;
    }

    setSetupError(payload.message ?? "Nu am putut salva parola.");
  }

  async function submitVote(proposalId: string) {
    const form = forms[proposalId];
    if (!form?.choice) {
      setError("Alege Da sau Nu înainte să trimiți votul.");
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
      setMessage(payload.message ?? "Vot înregistrat.");
      await loadProposals();
      setForms((current) => ({
        ...current,
        [proposalId]: { choice: form.choice, reason: "" },
      }));
      return;
    }

    setError(payload.message ?? "Nu am putut înregistra votul.");
  }

  return (
    <section id="voteaza" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Votează schimbările"
          title="Alege dacă ești de acord sau nu cu subiectele propuse"
          description="Votul se face pe baza emailului și parolei alese la înscriere. Mai jos vezi și motivele lăsate de ceilalți rezidenți."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <Card className="rounded-[2rem]">
            <CardTitle>Date pentru vot</CardTitle>
            <CardDescription className="mt-2">
              Folosește emailul și parola alese la înscriere. Aceste date sunt folosite doar pentru a valida că votul este unic.
            </CardDescription>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="vote-email">Email</Label>
                <Input
                  id="vote-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Ex: nume@email.ro"
                />
              </div>
              <div>
                <Label htmlFor="vote-password">Parolă</Label>
                <Input
                  id="vote-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Parola aleasă la înscriere"
                />
              </div>
            </div>
            {message ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
            {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
          </Card>

          <Card className="rounded-[2rem]">
            <CardTitle>Ți-ai făcut înscrierea înainte de parolă?</CardTitle>
            <CardDescription className="mt-2">
              Dacă ai deja o înscriere veche, îți poți seta acum parola pentru vot folosind emailul și telefonul deja salvate.
            </CardDescription>
            <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
              Acest formular este pentru activarea inițială a parolei. Dacă pentru înscrierea ta există deja o parolă salvată, nu o vei putea suprascrie de aici.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="setup-email">Email</Label>
                <Input
                  id="setup-email"
                  type="email"
                  value={setupEmail}
                  onChange={(event) => setSetupEmail(event.target.value)}
                  placeholder="Emailul folosit la înscriere"
                />
              </div>
              <div>
                <Label htmlFor="setup-phone">Telefon</Label>
                <Input
                  id="setup-phone"
                  value={setupPhone}
                  onChange={(event) => setSetupPhone(event.target.value)}
                  placeholder="Telefonul folosit la înscriere"
                />
              </div>
              <div>
                <Label htmlFor="setup-password">Parolă nouă</Label>
                <Input
                  id="setup-password"
                  type="password"
                  value={setupPasswordValue}
                  onChange={(event) => setSetupPasswordValue(event.target.value)}
                  placeholder="Alege o parolă de cel puțin 8 caractere"
                />
              </div>
              <Button onClick={handleSetupPassword}>Setează parola pentru vot</Button>
            </div>
            {setupMessage ? (
              <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {setupMessage}
              </p>
            ) : null}
            {setupError ? (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {setupError}
              </p>
            ) : null}
          </Card>
        </div>

        <div className="mt-8 space-y-6">
          {proposals.map((proposal) => {
            const currentForm = forms[proposal.id] ?? { choice: "yes", reason: "" };

            return (
              <Card key={proposal.id} className="rounded-[2rem]">
                <CardTitle>{proposal.title}</CardTitle>
                <CardDescription className="mt-3">{proposal.description}</CardDescription>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm font-medium text-emerald-800">Da</p>
                    <p className="mt-1 text-3xl font-semibold text-emerald-900">{proposal.yes_votes}</p>
                  </div>
                  <div className="rounded-2xl bg-rose-50 p-4">
                    <p className="text-sm font-medium text-rose-800">Nu</p>
                    <p className="mt-1 text-3xl font-semibold text-rose-900">{proposal.no_votes}</p>
                  </div>
                </div>

                {proposal.status === "open" ? (
                  <div className="mt-6 space-y-4 rounded-2xl bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          setForms((current) => ({
                            ...current,
                            [proposal.id]: { ...currentForm, choice: "yes" },
                          }))
                        }
                        className={`h-12 rounded-2xl px-5 text-sm font-medium ${
                          currentForm.choice === "yes"
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-slate-900"
                        }`}
                      >
                        Votez Da
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setForms((current) => ({
                            ...current,
                            [proposal.id]: { ...currentForm, choice: "no" },
                          }))
                        }
                        className={`h-12 rounded-2xl px-5 text-sm font-medium ${
                          currentForm.choice === "no"
                            ? "bg-rose-600 text-white"
                            : "bg-white text-slate-900"
                        }`}
                      >
                        Votez Nu
                      </button>
                    </div>

                    <div>
                      <Label htmlFor={`reason-${proposal.id}`}>De ce dorești acest lucru</Label>
                      <Textarea
                        id={`reason-${proposal.id}`}
                        value={currentForm.reason}
                        onChange={(event) =>
                          setForms((current) => ({
                            ...current,
                            [proposal.id]: { ...currentForm, reason: event.target.value },
                          }))
                        }
                        placeholder="Scrie pe scurt motivul tău."
                      />
                    </div>

                    <Button onClick={() => submitVote(proposal.id)}>Trimite votul</Button>
                  </div>
                ) : (
                  <p className="mt-6 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                    Votul pentru acest subiect este închis.
                  </p>
                )}

                <div className="mt-6">
                  <h3 className="text-base font-semibold text-slate-950">Mesaje din comunitate</h3>
                  <div className="mt-4 space-y-3">
                    {proposal.comments.length ? (
                      proposal.comments.map((comment) => (
                        <div key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-slate-950">{comment.resident_name}</p>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                comment.vote_choice === "yes"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {comment.vote_choice === "yes" ? "Da" : "Nu"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {comment.reason || "Fără mesaj adăugat."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Nu există încă mesaje pentru acest subiect.</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
          {!proposals.length ? (
            <Card className="rounded-[2rem]">
              <CardTitle>Nu există încă subiecte active pentru vot</CardTitle>
              <CardDescription className="mt-3">
                Când administratorul adaugă un subiect nou din panoul de administrare, acesta va apărea aici.
              </CardDescription>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  );
}
