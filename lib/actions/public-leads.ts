"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  grantPublicLeadsAccess,
  hasPublicLeadsAccess,
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

export async function deleteSelectedPublicLeadsAction(formData: FormData): Promise<void> {
  const isUnlocked = await hasPublicLeadsAccess();
  if (!isUnlocked) {
    redirect("/admin-cereri?error=Trebuie%20sa%20te%20autentifici%20din%20nou.");
  }

  const selectedDate = formData.get("date")?.toString().trim() ?? "";
  const leadIds = formData
    .getAll("leadIds")
    .map((value) => value.toString().trim())
    .filter(Boolean);

  if (!leadIds.length) {
    const params = new URLSearchParams();
    if (selectedDate) {
      params.set("date", selectedDate);
    }
    params.set("error", "Selectează cel puțin o cerere.");
    redirect(`/admin-cereri?${params.toString()}`);
  }

  await prisma.leadRequest.deleteMany({
    where: {
      id: {
        in: leadIds,
      },
    },
  });

  revalidatePath("/admin-cereri");

  const params = new URLSearchParams();
  if (selectedDate) {
    params.set("date", selectedDate);
  }
  params.set("success", "Cererile selectate au fost șterse.");
  redirect(`/admin-cereri?${params.toString()}`);
}
