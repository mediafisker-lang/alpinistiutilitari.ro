"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useVoteSession } from "@/components/use-vote-session";
import { buildingOptions } from "@/lib/constants";

type FormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const initialState: FormState = {};
const phoneRegex = /^[0-9+ ]{8,20}$/;

function validateJoinForm(formData: FormData) {
  const errors: Record<string, string[]> = {};
  const fullName = String(formData.get("full_name") ?? "").trim();
  const residentType = String(formData.get("resident_type") ?? "").trim();
  const building = String(formData.get("building") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/\s+/g, " ").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const consent = formData.get("consent") === "true";

  if (fullName.length < 3) {
    errors.full_name = ["Introdu numele complet."];
  }

  if (!residentType) {
    errors.resident_type = ["Alege statutul."];
  }

  if (!building) {
    errors.building = ["Selecteaza cladirea."];
  }

  if (!phoneRegex.test(phone)) {
    errors.phone = ["Introdu un numar de telefon valid."];
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ["Introdu o adresa de email valida."];
  }

  if (password.length < 8) {
    errors.password = ["Alege o parola de cel putin 8 caractere."];
  }

  if (!consent) {
    errors.consent = ["Acordul pentru prelucrarea datelor este obligatoriu."];
  }

  return errors;
}

export function JoinForm() {
  const router = useRouter();
  const { isLoggedIn, session } = useVoteSession();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>(initialState);
  const [submittedAt, setSubmittedAt] = useState(() => Date.now() - 3000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setIsSubmitting(true);
    setState(initialState);

    const formData = new FormData(form);
    const clientErrors = validateJoinForm(formData);
    if (Object.keys(clientErrors).length > 0) {
      setState({
        success: false,
        message: "Formularul nu este completat corect. Verifica campurile marcate.",
        errors: clientErrors,
      });
      setIsSubmitting(false);
      return;
    }

    const fullName = String(formData.get("full_name") ?? "").trim();
    const firstName = fullName.split(/\s+/)[0] || "vecin";

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as FormState;
      setState(payload);

      if (payload.success) {
        setState({
          success: true,
          message: payload.message ?? "Inregistrare reusita. Te redirectionam...",
        });
        formRef.current?.reset();
        setSubmittedAt(Date.now() - 3000);
        setTimeout(() => {
          router.push(`/inregistrare/succes?nume=${encodeURIComponent(firstName)}`);
        }, 900);
        return;
      }
    } catch {
      setState({
        success: false,
        message: "Nu am putut trimite formularul acum. Incearca din nou.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoggedIn) {
    return (
      <Card id="inscriere" className="scroll-mt-24 rounded-[2rem] p-5 sm:p-6">
        <CardTitle>Esti deja inscris in portal</CardTitle>
        <CardDescription className="mt-3">
          Esti logat cu {session?.email}. Formularul de inscriere nu mai este necesar dupa autentificare.
        </CardDescription>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/sesizari" className="block">
            <Button size="lg" className="w-full">
              Trimite o sesizare
            </Button>
          </Link>
          <Link href="/voteaza" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Mergi la vot
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card
      id="inscriere"
      className="relative scroll-mt-24 overflow-hidden rounded-[2rem] border-2 border-[#cfe2ff] bg-[linear-gradient(180deg,#f4f9ff_0%,#ffffff_58%,#f6fbff_100%)] p-5 shadow-[0_20px_45px_rgba(11,99,206,0.16)] sm:p-7"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#b6d5ff]/50 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-[#dff0ff]/70 blur-2xl" />

      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#005eb8]">Formular rapid</p>
        <CardTitle className="mt-2 text-xl sm:text-2xl">
          Inscriere simpla in comunitate
        </CardTitle>
        <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-5">
          <input type="hidden" name="submitted_at" value={submittedAt} />
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="full_name" className="text-slate-800">
                Nume complet
              </Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Ex: Andrei Popescu"
                autoComplete="name"
                required
                className="bg-white/95"
              />
              {state.errors?.full_name ? (
                <p className="mt-2 text-sm text-rose-600">{state.errors.full_name[0]}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="resident_type" className="text-slate-800">
                Sunt
              </Label>
              <Select
                id="resident_type"
                name="resident_type"
                defaultValue="proprietar"
                required
                className="bg-white/95"
              >
                <option value="proprietar">Proprietar</option>
                <option value="chirias">Chirias</option>
              </Select>
              {state.errors?.resident_type ? (
                <p className="mt-2 text-sm text-rose-600">{state.errors.resident_type[0]}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="building" className="text-slate-800">
                Cladire / corp
              </Label>
              <Select id="building" name="building" defaultValue="" required className="bg-white/95">
                <option value="" disabled>
                  Selecteaza cladirea
                </option>
                {buildingOptions.map((building) => (
                  <option key={building} value={building}>
                    {building}
                  </option>
                ))}
              </Select>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                Alegi cladirea pentru care doresti actualizari.
              </p>
              {state.errors?.building ? (
                <p className="mt-2 text-sm text-rose-600">{state.errors.building[0]}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="phone" className="text-slate-800">
                Telefon
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Ex: 07xx xxx xxx"
                autoComplete="tel"
                inputMode="tel"
                maxLength={20}
                required
                className="bg-white/95"
              />
              {state.errors?.phone ? (
                <p className="mt-2 text-sm text-rose-600">{state.errors.phone[0]}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-800">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Ex: nume@email.ro"
                autoComplete="email"
                inputMode="email"
                required
                className="bg-white/95"
              />
              {state.errors?.email ? (
                <p className="mt-2 text-sm text-rose-600">{state.errors.email[0]}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-800">
                Parola
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minim 8 caractere"
                autoComplete="new-password"
                minLength={8}
                required
                className="bg-white/95"
              />
              <p className="mt-2 text-xs leading-5 text-slate-600">
                O folosesti impreuna cu emailul pentru acces ulterior.
              </p>
              {state.errors?.password ? (
                <p className="mt-2 text-sm text-rose-600">{state.errors.password[0]}</p>
              ) : null}
            </div>
          </div>

          <label className="surface-3d flex items-start gap-3 rounded-2xl border-[#bfd8ff] bg-white/90 p-4 text-sm leading-6 text-slate-700">
            <input
              type="checkbox"
              name="consent"
              value="true"
              required
              className="mt-1 size-4 rounded border-slate-300"
            />
            <span>
              Sunt de acord ca datele mele sa fie folosite pentru comunicari legate de initiativa asociatiei, actualizari, sesizari si acces in canalele comunitatii. Am citit{" "}
              <Link href="/privacy" className="font-semibold text-[#005eb8] underline">
                politica de confidentialitate
              </Link>
              .
            </span>
          </label>
          {state.errors?.consent ? (
            <p className="text-sm text-rose-600">{state.errors.consent[0]}</p>
          ) : null}

          {state.message ? (
            state.success ? (
              <div className="rounded-3xl border-2 border-emerald-300 bg-emerald-50 px-5 py-5 text-emerald-900 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Mesaj oficial</p>
                <p className="mt-2 text-lg font-extrabold sm:text-xl">
                  {state.message}
                </p>
              </div>
            ) : (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {state.message}
              </p>
            )
          ) : null}

          <div className="rounded-2xl border border-[#bfd8ff] bg-white/90 p-4">
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Se trimite..." : "Inregistreaza-te"}
            </Button>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Completarea dureaza putin si iti activeaza accesul la informatiile relevante pentru cladirea ta.
            </p>
          </div>
        </form>
      </div>
    </Card>
  );
}
