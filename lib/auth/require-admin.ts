import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/current-admin";

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
