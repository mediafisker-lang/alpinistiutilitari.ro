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

export type CompactLeadStatus = "noua" | "in_lucru" | "rezolvata";

async function requirePublicLeadsAccess() {
  if (!(await hasPublicLeadsAccess())) {
    throw new Error("Sesiunea a expirat. Autentifică-te din nou.");
  }
}

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

export async function updatePublicLeadStatusAction(
  leadId: string,
  status: CompactLeadStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requirePublicLeadsAccess();
    if (!leadId || !["noua", "in_lucru", "rezolvata"].includes(status)) {
      return { ok: false, error: "Status invalid." };
    }

    await prisma.leadRequest.update({
      where: { id: leadId },
      data: { status },
    });
    revalidatePath("/admin-cereri");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Statusul nu a putut fi salvat.",
    };
  }
}

export async function deletePublicLeadsAction(
  leadIds: string[],
): Promise<{ ok: true; deleted: number } | { ok: false; error: string }> {
  try {
    await requirePublicLeadsAccess();
    const uniqueIds = [...new Set(leadIds.map((id) => id.trim()).filter(Boolean))];
    if (!uniqueIds.length) {
      return { ok: false, error: "Selectează cel puțin o cerere." };
    }

    const result = await prisma.leadRequest.deleteMany({
      where: { id: { in: uniqueIds } },
    });
    revalidatePath("/admin-cereri");
    return { ok: true, deleted: result.count };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Cererile nu au putut fi șterse.",
    };
  }
}
