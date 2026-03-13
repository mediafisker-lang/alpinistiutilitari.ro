"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const payload = (await response.json()) as { success?: boolean; message?: string };
    setMessage(payload.message ?? "");
    setLoading(false);

    if (payload.success) {
      router.refresh();
    }
  }

  return (
    <Card className="mt-8 max-w-md">
      <CardTitle>Autentificare admin</CardTitle>
      <CardDescription className="mt-2">
        Introdu parola unica pentru a accesa administrarea.
      </CardDescription>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="admin-password">Parola</Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Parola admin"
            className="mt-2"
            required
          />
        </div>
        {message ? (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</p>
        ) : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Se verifica..." : "Intra in admin"}
        </Button>
      </form>
    </Card>
  );
}
