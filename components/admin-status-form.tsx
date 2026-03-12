"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type Props = {
  id: string;
  table: "residents" | "issues";
  currentValue: string;
  options: { label: string; value: string }[];
  adminKey: string;
};

export function AdminStatusForm({
  id,
  table,
  currentValue,
  options,
  adminKey,
}: Props) {
  const [value, setValue] = useState(currentValue);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        table,
        status: value,
        key: adminKey,
      }),
    });

    const payload = (await response.json()) as { message?: string; success?: boolean };
    setMessage(payload.message ?? "Actualizarea a eșuat.");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Select value={value} onChange={(event) => setValue(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Button type="submit" variant="secondary" size="sm" disabled={loading}>
        {loading ? "Se salvează..." : "Salvează"}
      </Button>
      {message ? <p className="text-xs text-slate-500">{message}</p> : null}
    </form>
  );
}
