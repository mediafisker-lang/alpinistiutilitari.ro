"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function AdminDeleteProposalButton({ proposalId }: { proposalId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDelete() {
    if (!window.confirm("Vrei sa stergi aceasta propunere de vot?")) {
      return;
    }

    setIsDeleting(true);
    setMessage("");

    const response = await fetch("/api/admin/proposals/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: proposalId }),
    });

    const payload = (await response.json()) as { success?: boolean; message?: string };
    setMessage(payload.message ?? "");
    setIsDeleting(false);

    if (payload.success) {
      router.refresh();
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Se sterge..." : "Sterge propunerea"}
      </Button>
      {message ? <p className="text-xs text-slate-500">{message}</p> : null}
    </div>
  );
}
