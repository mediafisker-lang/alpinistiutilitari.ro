"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { FormSubmit } from "@/components/form-submit";
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
    }
  }

  return (
    <Card id="inscriere" className="scroll-mt-24 rounded-[2rem] p-5 sm:p-6">
      <CardTitle>Înscrie-te și rămâi conectat la ce se întâmplă în complex</CardTitle>
      <CardDescription className="mt-3">
        Completează datele de mai jos ca să primești actualizări importante, să poți trimite sesizări și să participi mai ușor la comunicarea din comunitate.
      </CardDescription>
      <form ref={formRef} action={action} className="mt-6 space-y-5">
        <input type="hidden" name="submitted_at" value={submittedAt} />
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

        <div>
          <Label htmlFor="full_name">Nume complet</Label>
          <Input
            id="full_name"
            name="full_name"
            placeholder="Ex: Andrei Popescu"
            autoComplete="name"
            required
          />
          {state.errors?.full_name && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.full_name[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="resident_type">Sunt</Label>
          <Select id="resident_type" name="resident_type" defaultValue="proprietar" required>
            <option value="proprietar">Proprietar</option>
            <option value="chirias">Chiriaș</option>
          </Select>
          {state.errors?.resident_type && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.resident_type[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="building">Clădire / corp</Label>
          <Select id="building" name="building" defaultValue="" required>
            <option value="" disabled>
              Selectează clădirea
            </option>
            {buildingOptions.map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </Select>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Selectează clădirea pentru care vrei să primești actualizări și informații relevante.
          </p>
          {state.errors?.building && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.building[0]}</p>
          )}
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
          {state.errors?.phone && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.phone[0]}</p>
          )}
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
          {state.errors?.email && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Parolă</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Alege o parolă pentru vot și acces ulterior"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Vei folosi această parolă împreună cu emailul tău atunci când votezi propunerile publicate în interfață.
          </p>
          {state.errors?.password && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <h3 className="text-base font-semibold text-slate-950">Ce primești după înscriere</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <li>- Primești actualizări clare despre inițiativă și noutățile importante</li>
            <li>- Poți trimite sesizări și urmări mai ușor ce se întâmplă</li>
            <li>- După confirmarea înscrierii, poți primi acces în grupul de WhatsApp al comunității</li>
            <li>- Poți participa la consultări și voturi privind propunerile și schimbările discutate în cadrul inițiativei sau al asociației</li>
          </ul>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Datele tale sunt folosite doar pentru comunicări legate de complex, inițiativa asociației și gestionarea sesizărilor.
          </p>
        </div>

        <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <input
            type="checkbox"
            name="consent"
            value="true"
            required
            className="mt-1 size-4 rounded border-slate-300"
          />
          <span>
            Sunt de acord ca datele mele să fie folosite pentru comunicări legate de inițiativa asociației, actualizări, sesizări și accesul la canalele de comunicare ale comunității. Am citit politica de confidențialitate.
            {" "}
            <Link href="/privacy" className="font-medium text-emerald-700 underline">
              Politica de confidențialitate
            </Link>
          </span>
        </label>
        {state.errors?.consent && (
          <p className="text-sm text-rose-600">{state.errors.consent[0]}</p>
        )}

        {state.message && (
          state.success ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-5 text-emerald-800">
              <p className="text-lg font-semibold sm:text-xl">Înscriere trimisă cu succes</p>
              <p className="mt-2 text-base leading-7">
                Mulțumim. Datele tale au fost înregistrate. După validare, vei putea primi actualizări relevante pentru clădirea ta și informații despre pașii următori.
              </p>
            </div>
          ) : (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {state.message}
            </p>
          )
        )}

        <FormSubmit label="Vreau să mă înscriu" />
        <p className="text-sm leading-6 text-slate-500">
          Înscrierea durează puțin. După validare, vei putea primi acces la informațiile relevante pentru clădirea ta și la canalele de comunicare ale comunității.
        </p>
      </form>
    </Card>
  );
}
