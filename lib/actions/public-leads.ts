"use server";

import { redirect } from "next/navigation";
import {
  grantPublicLeadsAccess,
  isPublicLeadsPasswordValid,
  revokePublicLeadsAccess,
} from "@/lib/public-leads-access";

export async function unlockPublicLeadsAction(formData: FormData): Promise<void> {
  const password = formData.get("password")?.toString() ?? "";

  if (!isPublicLeadsPasswordValid(password)) {
    redirect("/admin-cereri?error=Parola%20este%20incorecta.");
  }

  await grantPublicLeadsAccess();
  redirect("/admin-cereri");
}

export async function lockPublicLeadsAction(): Promise<void> {
  await revokePublicLeadsAccess();
  redirect("/admin-cereri");
}

