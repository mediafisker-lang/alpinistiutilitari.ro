"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminResetPasswordForm({
  residentId,
  adminKey,
}: {
  residentId: string;
  adminKey: string;
}) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/reset-resident-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        residentId,
        password,
        key: adminKey,
      }),
    });

    const payload = (await response.json()) as { success?: boolean; message?: string };
    setMessage(payload.message ?? "Actualizarea a eșuat.");

    if (payload.success) {
      setPassword("");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Parolă nouă"
        minLength={8}
        required
      />
      <Button type="submit" variant="secondary" size="sm" disabled={loading}>
        {loading ? "Se salvează..." : "Resetează parola"}
      </Button>
      {message ? <p className="text-xs text-slate-500">{message}</p> : null}
    </form>
  );
}
