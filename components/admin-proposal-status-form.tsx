"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export function AdminProposalStatusForm({
  id,
  currentValue,
}: {
  id: string;
  currentValue: "open" | "closed";
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentValue);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/admin/proposals/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    const payload = (await response.json()) as { success?: boolean; message?: string };
    setMessage(payload.message ?? "");
    if (payload.success) {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Select value={status} onChange={(event) => setStatus(event.target.value as "open" | "closed")}>
        <option value="open">Deschis</option>
        <option value="closed">Închis</option>
      </Select>
      <Button type="submit" variant="secondary" size="sm">
        Salvează
      </Button>
      {message ? <p className="text-xs text-slate-500">{message}</p> : null}
    </form>
  );
}
