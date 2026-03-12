"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { FormSubmit } from "@/components/form-submit";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);

  async function action(formData: FormData) {
    const response = await fetch("/api/issues", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as FormState;
    setState(payload);

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
    <Card className="rounded-[2rem] p-5 sm:p-6">
      <CardTitle>Trimite o sesizare</CardTitle>
      <CardDescription className="mt-3">
        Spune pe scurt problema. Dacă lași telefon sau email, putem reveni mai ușor cu un răspuns.
      </CardDescription>
      <form ref={formRef} action={action} className="mt-6 space-y-5">
        <input type="hidden" name="submitted_at" value={submittedAt} />
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

        <div>
          <Label htmlFor="contact_name">Nume</Label>
          <Input
            id="contact_name"
            name="contact_name"
            placeholder="Ex: Maria Ionescu"
            autoComplete="name"
            required
          />
          {state.errors?.contact_name && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.contact_name[0]}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="contact_phone">Telefon</Label>
            <Input
              id="contact_phone"
              name="contact_phone"
              placeholder="Opțional"
              autoComplete="tel"
              inputMode="tel"
              maxLength={20}
            />
            {state.errors?.contact_phone && (
              <p className="mt-2 text-sm text-rose-600">{state.errors.contact_phone[0]}</p>
            )}
          </div>
          <div>
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              placeholder="Opțional"
              autoComplete="email"
              inputMode="email"
            />
            {state.errors?.contact_email && (
              <p className="mt-2 text-sm text-rose-600">{state.errors.contact_email[0]}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="category">Categorie</Label>
          <Select id="category" name="category" defaultValue="Curățenie" required>
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
          <Label htmlFor="title">Titlu</Label>
          <Input id="title" name="title" placeholder="Ex: Acces defect la barieră" required />
          {state.errors?.title && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.title[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Descriere</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Scrie clar ce se întâmplă, unde apare problema și de când o observi."
            maxLength={1000}
            required
          />
          {state.errors?.description && (
            <p className="mt-2 text-sm text-rose-600">{state.errors.description[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="photos">Poze</Label>
          <Input
            ref={fileInputRef}
            id="photos"
            name="photos"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={handlePhotoChange}
          />
          <p className="mt-2 text-xs text-slate-500">
            Opțional. Poți atașa până la 3 poze, maximum 5 MB fiecare.
          </p>
          {previews.length ? (
            <div className="mt-3 grid grid-cols-3 gap-3">
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
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-5 text-emerald-800">
              <p className="text-lg font-semibold sm:text-xl">Sesizarea a fost trimisă</p>
              <p className="mt-2 text-base leading-7">
                Revenim rapid cu informații dacă se impune. Mulțumim!
              </p>
            </div>
          ) : (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {state.message}
            </p>
          )
        )}

        <FormSubmit label="Trimite sesizarea" />
      </form>
    </Card>
  );
}
