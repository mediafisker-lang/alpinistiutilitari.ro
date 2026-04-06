"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", {
      method: "POST",
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button type="button" variant="secondary" onClick={handleLogout} disabled={loading}>
      {loading ? "Se iese..." : "Iesi din admin"}
    </Button>
  );
}
