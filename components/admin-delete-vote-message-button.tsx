"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function AdminDeleteVoteMessageButton({
  voteId,
}: {
  voteId: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Vrei sa stergi acest mesaj din vot?");
    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/admin/proposal-votes/delete-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: voteId }),
    });

    const payload = (await response.json()) as { success?: boolean; message?: string };
    setMessage(payload.message ?? "");
    setIsSubmitting(false);

    if (payload.success) {
      router.refresh();
    }
  }

  return (
    <div className="mt-3">
      <Button type="button" variant="secondary" size="sm" onClick={handleDelete} disabled={isSubmitting}>
        Sterge mesajul
      </Button>
      {message ? <p className="mt-2 text-xs text-slate-500">{message}</p> : null}
    </div>
  );
}
