"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { clearAdminSession, createAdminSession } from "@/lib/auth/session";
import { requireAdmin } from "@/lib/auth/require-admin";
import { isUnifiedAccessPasswordValid } from "@/lib/public-leads-access";
import {
  adminLoginSchema,
  leadMetaSchema,
  leadNoteSchema,
  leadStatusSchema,
} from "@/lib/schemas/admin";

export type AdminActionState = {
  success?: boolean;
  message?: string;
};

export async function adminLoginAction(formData: FormData): Promise<void> {
  const parsed = adminLoginSchema.safeParse({
    password: formData.get("password")?.toString(),
  });

  if (!parsed.success) {
    redirect(`/admin/login?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Date invalide")}`);
  }

  if (!isUnifiedAccessPasswordValid(parsed.data.password)) {
    redirect("/admin/login?error=Parola%20nu%20este%20corecta.");
  }

  const admin =
    (await prisma.adminUser.findFirst({
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    })) ??
    (await prisma.adminUser.create({
      data: {
        email: "admin@alpinistiutilitari.ro",
        passwordHash: hashPassword(parsed.data.password),
        role: "admin",
      },
    }));

  await clearAdminSession();
  await createAdminSession(admin.id);
  redirect("/admin/cereri");
}

export async function adminLogoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateLeadStatusAction(
  formData: FormData,
): Promise<void> {
  const admin = await requireAdmin();
  const parsed = leadStatusSchema.safeParse({
    leadRequestId: formData.get("leadRequestId")?.toString(),
    status: formData.get("status")?.toString(),
  });

  if (!parsed.success) {
    return;
  }

  await prisma.leadRequest.update({
    where: { id: parsed.data.leadRequestId },
    data: {
      status: parsed.data.status,
      events: {
        create: {
          type: "status_changed",
          payloadJson: { status: parsed.data.status, by: admin.email },
        },
      },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/cereri");
  revalidatePath(`/admin/cereri/${parsed.data.leadRequestId}`);

}

export async function addLeadNoteAction(
  formData: FormData,
): Promise<void> {
  const admin = await requireAdmin();
  const parsed = leadNoteSchema.safeParse({
    leadRequestId: formData.get("leadRequestId")?.toString(),
    note: formData.get("note")?.toString(),
  });

  if (!parsed.success) return;

  await prisma.leadRequestNote.create({
    data: {
      leadRequestId: parsed.data.leadRequestId,
      adminUserId: admin.id,
      note: parsed.data.note,
    },
  });

  await prisma.leadRequestEvent.create({
    data: {
      leadRequestId: parsed.data.leadRequestId,
      type: "note_added",
      payloadJson: { by: admin.email },
    },
  });

  revalidatePath(`/admin/cereri/${parsed.data.leadRequestId}`);
}

export async function updateLeadMetaAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const parsed = leadMetaSchema.safeParse({
    leadRequestId: formData.get("leadRequestId")?.toString(),
    clientContacted: formData.get("clientContacted")?.toString() as "on" | undefined,
    executantsContacted: formData.get("executantsContacted")?.toString() as "on" | undefined,
    resultSummary: formData.get("resultSummary")?.toString(),
  });

  if (!parsed.success) return;

  await prisma.leadRequest.update({
    where: { id: parsed.data.leadRequestId },
    data: {
      clientContacted: Boolean(parsed.data.clientContacted),
      executantsContacted: Boolean(parsed.data.executantsContacted),
      resultSummary: parsed.data.resultSummary || null,
      events: {
        create: {
          type: "lead_meta_updated",
          payloadJson: {
            clientContacted: Boolean(parsed.data.clientContacted),
            executantsContacted: Boolean(parsed.data.executantsContacted),
            by: admin.email,
          },
        },
      },
    },
  });

  revalidatePath(`/admin/cereri/${parsed.data.leadRequestId}`);
}
