"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  success?: boolean;
  message?: string;
};

export function AdminProposalForm({ adminKey }: { adminKey: string }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>({});

  async function handleSubmit(formData: FormData) {
    const response = await fetch("/api/admin/proposals", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as FormState;
    setState(payload);

    if (payload.success) {
      router.refresh();
    }
  }

  return (
    <Card>
      <CardTitle>Propune un subiect nou pentru vot</CardTitle>
      <CardDescription className="mt-2">
        Exemplu: schimbarea firmei de pază, reguli noi sau alte decizii care au nevoie de consultare.
      </CardDescription>
      <form action={handleSubmit} className="mt-6 space-y-4">
        <input type="hidden" name="key" value={adminKey} />
        <div>
          <Label htmlFor="proposal_title">Titlu</Label>
          <Input id="proposal_title" name="title" placeholder="Ex: Schimbarea firmei de pază" required />
        </div>
        <div>
          <Label htmlFor="proposal_description">Descriere scurtă</Label>
          <Textarea
            id="proposal_description"
            name="description"
            placeholder="Scrie clar ce se propune și de ce este pus la vot."
            required
          />
        </div>
        {state.message ? (
          <p className={`rounded-2xl px-4 py-3 text-sm ${state.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            {state.message}
          </p>
        ) : null}
        <Button type="submit">Publică propunerea</Button>
      </form>
    </Card>
  );
}
