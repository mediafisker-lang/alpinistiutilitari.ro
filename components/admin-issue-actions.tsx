"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Issue } from "@/types/database";

const categories = [
  "Curatenie",
  "Reparatii",
  "Siguranta",
  "Parcare",
  "Comunicare",
  "Altceva",
];

type Props = {
  issue: Issue;
};

export function AdminIssueActions({ issue }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    contact_name: issue.contact_name,
    contact_phone: issue.contact_phone ?? "",
    contact_email: issue.contact_email ?? "",
    category: issue.category,
    title: issue.title,
    description: issue.description,
  });

  async function handleSave() {
    setIsSaving(true);
    setMessage("");

    const response = await fetch("/api/admin/issues/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: issue.id,
        ...form,
      }),
    });

    const payload = (await response.json()) as { success?: boolean; message?: string };
    setMessage(payload.message ?? "");
    setIsSaving(false);

    if (payload.success) {
      setIsEditing(false);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!window.confirm("Vrei sa stergi aceasta sesizare?")) {
      return;
    }

    setIsDeleting(true);
    setMessage("");

    const response = await fetch("/api/admin/issues/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: issue.id }),
    });

    const payload = (await response.json()) as { success?: boolean; message?: string };
    setMessage(payload.message ?? "");
    setIsDeleting(false);

    if (payload.success) {
      router.refresh();
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => setIsEditing((current) => !current)}>
          {isEditing ? "Inchide editarea" : "Editeaza"}
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Se sterge..." : "Sterge"}
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Input
            value={form.contact_name}
            onChange={(event) => setForm((current) => ({ ...current, contact_name: event.target.value }))}
            placeholder="Nume contact"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={form.contact_phone}
              onChange={(event) => setForm((current) => ({ ...current, contact_phone: event.target.value }))}
              placeholder="Telefon"
            />
            <Input
              value={form.contact_email}
              onChange={(event) => setForm((current) => ({ ...current, contact_email: event.target.value }))}
              placeholder="Email"
            />
          </div>
          <Select
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Titlu"
          />
          <Textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Descriere"
          />
          <Button type="button" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Se salveaza..." : "Salveaza modificarile"}
          </Button>
        </div>
      ) : null}

      {message ? <p className="text-xs text-slate-500">{message}</p> : null}
    </div>
  );
}
