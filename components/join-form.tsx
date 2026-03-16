"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRef, useState } from "react";

import { FormSubmit } from "@/components/form-submit";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { buildingOptions } from "@/lib/constants";

type FormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const initialState: FormState = {};

export function JoinForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>(initialState);
  const [submittedAt, setSubmittedAt] = useState(() => Date.now());
  const [mobileStep, setMobileStep] = useState<1 | 2>(1);

  async function action(formData: FormData) {
    const response = await fetch("/api/join", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as FormState;
    setState(payload);

    if (payload.success) {
      formRef.current?.reset();
      setSubmittedAt(Date.now());
      setMobileStep(1);
    }
  }

  return (
    <Card id="inscriere" className="scroll-mt-24 rounded-[2rem] p-5 sm:p-6">
      <CardTitle>Inscrie-te si ramai conectat la ce se intampla in complex</CardTitle>
      <CardDescription className="mt-3">
        Completezi rapid datele de baza, apoi primesti acces mai usor la actualizari, sesizari, vot si canalele interne ale comunitatii.
      </CardDescription>
      <form ref={formRef} action={action} className="mt-6 space-y-5">
        <input type="hidden" name="submitted_at" value={submittedAt} />
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4 md:hidden">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-extrabold ${
                mobileStep === 1 ? "bg-[#005eb8] text-white" : "bg-white text-[#005eb8]"
              }`}
            >
              1
            </div>
            <div className="h-px flex-1 bg-blue-200" />
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-extrabold ${
                mobileStep === 2 ? "bg-[#005eb8] text-white" : "bg-white text-[#005eb8]"
              }`}
            >
              2
            </div>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-950">
            {mobileStep === 1 ? "Pasul 1: date de baza" : "Pasul 2: contact si activare acces"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Formularul este impartit pe mobil ca sa il completezi mai repede.
          </p>
        </div>

        <div className={mobileStep === 1 ? "space-y-5" : "hidden md:block md:space-y-5"}>
          <div>
            <Label htmlFor="full_name">Nume complet</Label>
            <Input
              id="full_name"
              name="full_name"
              placeholder="Ex: Andrei Popescu"
              autoComplete="name"
              required
            />
            {state.errors?.full_name ? (
              <p className="mt-2 text-sm text-rose-600">{state.errors.full_name[0]}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="resident_type">Sunt</Label>
            <Select id="resident_type" name="resident_type" defaultValue="proprietar" required>
              <option value="proprietar">Proprietar</option>
              <option value="chirias">Chirias</option>
            </Select>
            {state.errors?.resident_type ? (
              <p className="mt-2 text-sm text-rose-600">{state.errors.resident_type[0]}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="building">Cladire / corp</Label>
            <Select id="building" name="building" defaultValue="" required>
              <option value="" disabled>
                Selecteaza cladirea
              </option>
              {buildingOptions.map((building) => (
                <option key={building} value={building}>
                  {building}
                </option>
              ))}
            </Select>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Selecteaza cladirea pentru care vrei sa primesti actualizari si informatii relevante.
            </p>
            {state.errors?.building ? (
              <p className="mt-2 text-sm text-rose-600">{state.errors.building[0]}</p>
            ) : null}
          </div>

          <div className="md:hidden">
            <Button type="button" size="lg" className="w-full" onClick={() => setMobileStep(2)}>
              Continua catre contact
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className={mobileStep === 2 ? "space-y-5" : "hidden md:block md:space-y-5"}>
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileStep(1)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#005eb8]"
            >
              <ArrowLeft className="size-4" />
              Inapoi la datele de baza
            </button>
          </div>

          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Ex: 07xx xxx xxx"
              autoComplete="tel"
              inputMode="tel"
              maxLength={20}
              required
            />
            {state.errors?.phone ? (
              <p className="mt-2 text-sm text-rose-600">{state.errors.phone[0]}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Ex: nume@email.ro"
              autoComplete="email"
              inputMode="email"
              required
            />
            {state.errors?.email ? (
              <p className="mt-2 text-sm text-rose-600">{state.errors.email[0]}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="password">Parola</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Alege o parola pentru vot si acces ulterior"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Vei folosi aceasta parola impreuna cu emailul tau atunci cand votezi propunerile publicate in interfata.
            </p>
            {state.errors?.password ? (
              <p className="mt-2 text-sm text-rose-600">{state.errors.password[0]}</p>
            ) : null}
          </div>

          <div className="surface-3d rounded-3xl bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-950">Ce primesti dupa inscriere</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Totul ramane intr-un singur loc, usor de urmarit si usor de folosit.
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li>- Primesti actualizari clare despre initiativa si noutatile importante</li>
              <li>- Poti trimite sesizari si urmari mai usor ce se intampla</li>
              <li>- Dupa confirmarea inscrierii, poti primi acces in grupul de WhatsApp al comunitatii</li>
              <li>- Poti participa la consultari si voturi privind propunerile si schimbarile discutate in cadrul initiativei sau al asociatiei</li>
            </ul>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Datele tale sunt folosite doar pentru comunicari legate de complex, initiativa asociatiei si gestionarea sesizarilor.
            </p>
          </div>

          <label className="surface-3d flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <input
              type="checkbox"
              name="consent"
              value="true"
              required
              className="mt-1 size-4 rounded border-slate-300"
            />
            <span>
              Sunt de acord ca datele mele sa fie folosite pentru comunicari legate de initiativa asociatiei, actualizari, sesizari si accesul la canalele de comunicare ale comunitatii. Am citit politica de confidentialitate.{" "}
              <Link href="/privacy" className="font-medium text-emerald-700 underline">
                Politica de confidentialitate
              </Link>
            </span>
          </label>
          {state.errors?.consent ? (
            <p className="text-sm text-rose-600">{state.errors.consent[0]}</p>
          ) : null}

          {state.message ? (
            state.success ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-5 text-emerald-800">
                <p className="text-lg font-semibold sm:text-xl">Inscriere trimisa cu succes</p>
                <p className="mt-2 text-base leading-7">
                  Multumim. Datele tale au fost inregistrate. Dupa validare, vei putea primi actualizari relevante pentru cladirea ta si informatii despre pasii urmatori.
                </p>
              </div>
            ) : (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {state.message}
              </p>
            )
          ) : null}

          <FormSubmit label="Vreau sa ma inscriu" />
          <p className="text-sm leading-6 text-slate-500">
            Inscrierea dureaza putin. Dupa validare, vei putea primi acces la informatiile relevante pentru cladirea ta si la canalele de comunicare ale comunitatii.
          </p>
        </div>
      </form>
    </Card>
  );
}
