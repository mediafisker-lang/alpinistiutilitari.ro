"use client";

import Link from "next/link";
import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { FormSubmit } from "@/components/form-submit";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchCurrentClientIp } from "@/lib/client-ip";
import { readVoteAuth, subscribeVoteAuth, writeVoteAuth } from "@/lib/vote-auth";

type FormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

type PreviewItem = {
  file: File;
  url: string;
};

const initialState: FormState = {};

const categories = [
  "Curățenie",
  "Reparații",
  "Siguranță",
  "Parcare",
  "Comunicare",
  "Altceva",
];

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImages = 3;
const maxImageSize = 5 * 1024 * 1024;

export function IssueForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<FormState>(initialState);
  const [submittedAt, setSubmittedAt] = useState(() => Date.now());
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [localPhotoError, setLocalPhotoError] = useState("");
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [loggedInPassword, setLoggedInPassword] = useState("");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [currentIp, setCurrentIp] = useState("");

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);

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
      setLoggedInPassword(session?.password ?? "");
      if (session?.email && session?.password) {
        setShowAuthPrompt(false);
        setShowLoginForm(false);
        setLoginError("");
      }
    };

    syncSession();
    return subscribeVoteAuth(syncSession);
  }, [currentIp]);

  async function action(formData: FormData) {
    if (!loggedInEmail || !loggedInPassword) {
      setShowAuthPrompt(true);
      setShowLoginForm(false);
      setState({
        success: false,
        message: "Trebuie sa fii logat ca sa poti trimite o sesizare.",
      });
      return;
    }

    formData.set("auth_email", loggedInEmail);
    formData.set("auth_password", loggedInPassword);

    const response = await fetch("/api/issues", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as FormState;
    setState(payload);

    if (response.status === 401) {
      setShowAuthPrompt(true);
      setShowLoginForm(false);
      return;
    }

    if (payload.success) {
      formRef.current?.reset();
      setSubmittedAt(Date.now());
      previews.forEach((item) => URL.revokeObjectURL(item.url));
      setPreviews([]);
      setLocalPhotoError("");
      startTransition(() => {
        router.refresh();
      });
    }
  }

  async function handleInlineLogin() {
    setLoginLoading(true);
    setLoginError("");

    const response = await fetch("/api/votes/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
      if (ipToUse && ipToUse !== currentIp) {
        setCurrentIp(ipToUse);
      }
      writeVoteAuth({
        email: payload.email,
        password: loginPassword,
      }, ipToUse);
      setLoginLoading(false);
      setShowLoginForm(false);
      setShowAuthPrompt(false);
      setLoginEmail("");
      setLoginPassword("");
      setState(initialState);
      return;
    }

    setLoginError(payload.message ?? "Nu am putut face autentificarea.");
    setLoginLoading(false);
    setShowLoginForm(true);
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    previews.forEach((item) => URL.revokeObjectURL(item.url));

    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      setPreviews([]);
      setLocalPhotoError("");
      return;
    }

    if (files.length > maxImages) {
      event.target.value = "";
      setPreviews([]);
      setLocalPhotoError("Poți atașa cel mult 3 poze.");
      return;
    }

    for (const file of files) {
      if (!allowedImageTypes.has(file.type)) {
        event.target.value = "";
        setPreviews([]);
        setLocalPhotoError("Pozele trebuie să fie JPG, PNG sau WEBP.");
        return;
      }

      if (file.size > maxImageSize) {
        event.target.value = "";
        setPreviews([]);
        setLocalPhotoError("Fiecare poză poate avea maximum 5 MB.");
        return;
      }
    }

    setLocalPhotoError("");
    setPreviews(files.map((file) => ({ file, url: URL.createObjectURL(file) })));
  }

  function removePreview(indexToRemove: number) {
    const nextPreviews = previews.filter((_, index) => index !== indexToRemove);
    const removedPreview = previews[indexToRemove];
    if (removedPreview) {
      URL.revokeObjectURL(removedPreview.url);
    }

    setPreviews(nextPreviews);
    setLocalPhotoError("");

    const dataTransfer = new DataTransfer();
    nextPreviews.forEach((item) => dataTransfer.items.add(item.file));
    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
    }
  }

  return (
    <Card className="rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6">
      <CardTitle>Trimite o sesizare</CardTitle>
      <CardDescription className="mt-2 text-sm leading-5 sm:mt-3">
        Spune pe scurt problema. Formular compact pentru trimitere rapidă.
      </CardDescription>
      <form ref={formRef} action={action} className="mt-4 space-y-3 sm:mt-6 sm:space-y-5">
        <input type="hidden" name="submitted_at" value={submittedAt} />
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
        <input type="hidden" name="auth_email" value={loggedInEmail} readOnly />
        <input type="hidden" name="auth_password" value={loggedInPassword} readOnly />

        <div>
          <Label htmlFor="contact_name" className="mb-1.5 text-xs sm:mb-2 sm:text-sm">
            Nume
          </Label>
          <Input
            id="contact_name"
            name="contact_name"
            placeholder="Ex: Maria Ionescu"
            autoComplete="name"
            className="h-10 sm:h-11"
            required
          />
          {state.errors?.contact_name && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.contact_name[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contact_phone" className="mb-1.5 text-xs sm:mb-2 sm:text-sm">
            Telefon (opțional)
          </Label>
          <Input
            id="contact_phone"
            name="contact_phone"
            placeholder="Ex: 07xx xxx xxx"
            autoComplete="tel"
            inputMode="tel"
            maxLength={20}
            className="h-10 sm:h-11"
          />
          {state.errors?.contact_phone && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.contact_phone[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category" className="mb-1.5 text-xs sm:mb-2 sm:text-sm">
            Categorie
          </Label>
          <Select id="category" name="category" defaultValue="Curățenie" className="h-10 sm:h-11" required>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          {state.errors?.category && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.category[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description" className="mb-1.5 text-xs sm:mb-2 sm:text-sm">
            Descriere
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Scrie clar ce se întâmplă, unde apare problema și de când o observi."
            maxLength={1000}
            className="min-h-24 sm:min-h-32"
            required
          />
          {state.errors?.description && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.description[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="photos" className="mb-1.5 text-xs sm:mb-2 sm:text-sm">
            Poze
          </Label>
          <Input
            ref={fileInputRef}
            id="photos"
            name="photos"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={handlePhotoChange}
            className="h-10 sm:h-11"
          />
          <p className="mt-1.5 text-[11px] text-slate-500 sm:mt-2 sm:text-xs">
            Opțional. Poți atașa până la 3 poze, maximum 5 MB fiecare.
          </p>
          {previews.length ? (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {previews.map((item, index) => (
                <div
                  key={item.url}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <img
                    src={item.url}
                    alt={`Preview poză ${index + 1}`}
                    className="h-24 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePreview(index)}
                    className="absolute right-2 top-2 rounded-full bg-slate-950/80 px-2 py-1 text-xs font-medium text-white"
                  >
                    Șterge
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          {localPhotoError ? (
            <p className="mt-2 text-sm text-rose-600">{localPhotoError}</p>
          ) : null}
          {state.errors?.photos && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.photos[0]}</p>
          )}
        </div>

        {state.message && (
          state.success ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-800 sm:rounded-3xl sm:px-5 sm:py-5">
              <p className="text-base font-semibold sm:text-xl">Sesizarea a fost trimisă</p>
              <p className="mt-1.5 text-sm leading-6 sm:mt-2 sm:text-base sm:leading-7">
                Revenim rapid cu informații dacă se impune. Mulțumim!
              </p>
            </div>
          ) : (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {state.message}
            </p>
          )
        )}

        {showAuthPrompt ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-5">
            <p className="text-base font-semibold text-amber-950">
              Trebuie sa fii logat ca sa poti trimite o sesizare.
            </p>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              Pentru trimitere, intra in cont sau mergi la inscriere daca nu ai parola inca.
            </p>

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
                  <button
                    type="button"
                    onClick={handleInlineLogin}
                    disabled={loginLoading}
                    className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loginLoading ? "Se verifica..." : "Intra si trimite"}
                  </button>
                  {loginError ? <p className="text-sm text-rose-700">{loginError}</p> : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <FormSubmit label="Trimite sesizarea" />
      </form>
    </Card>
  );
}
