"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { verifyPassword } from "@/lib/auth/password";
import { clearAdminSession, createAdminSession } from "@/lib/auth/session";
import { requireAdmin } from "@/lib/auth/require-admin";
import { runPlacesImport } from "@/lib/integrations/google-places-import";
import {
  adminLoginSchema,
  articleSchema,
  citySchema,
  companySchema,
  countySchema,
  faqSchema,
  leadMetaSchema,
  leadNoteSchema,
  leadStatusSchema,
  serviceSchema,
} from "@/lib/schemas/admin";

export type AdminActionState = {
  success?: boolean;
  message?: string;
};

export async function adminLoginAction(formData: FormData): Promise<void> {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
  });

  if (!parsed.success) {
    redirect(`/admin/login?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Date invalide")}`);
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!admin || !verifyPassword(parsed.data.password, admin.passwordHash)) {
    redirect("/admin/login?error=Emailul%20sau%20parola%20nu%20sunt%20corecte.");
  }

  await clearAdminSession();
  await createAdminSession(admin.id);
  redirect("/admin");
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

export async function upsertCountyAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const parsed = countySchema.safeParse({
    id: formData.get("id")?.toString(),
    name: formData.get("name")?.toString(),
    slug: formData.get("slug")?.toString() || slugify(formData.get("name")?.toString() ?? ""),
    shortCode: formData.get("shortCode")?.toString(),
    intro: formData.get("intro")?.toString(),
    seoTitle: formData.get("seoTitle")?.toString(),
    seoDescription: formData.get("seoDescription")?.toString(),
  });

  if (!parsed.success) return;

  const { id, ...data } = parsed.data;
  if (id) {
    await prisma.county.update({ where: { id }, data });
  } else {
    await prisma.county.create({ data });
  }

  revalidatePath("/admin/judete");
  revalidatePath("/judete");
}

export async function upsertCityAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const parsed = citySchema.safeParse({
    id: formData.get("id")?.toString(),
    countyId: formData.get("countyId")?.toString(),
    name: formData.get("name")?.toString(),
    slug: formData.get("slug")?.toString() || slugify(formData.get("name")?.toString() ?? ""),
    intro: formData.get("intro")?.toString(),
    seoTitle: formData.get("seoTitle")?.toString(),
    seoDescription: formData.get("seoDescription")?.toString(),
  });

  if (!parsed.success) return;

  const { id, ...data } = parsed.data;
  if (id) {
    await prisma.city.update({ where: { id }, data });
  } else {
    await prisma.city.create({ data });
  }

  revalidatePath("/admin/orase");
  revalidatePath("/orase");
}

export async function upsertServiceAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse({
    id: formData.get("id")?.toString(),
    name: formData.get("name")?.toString(),
    slug: formData.get("slug")?.toString() || slugify(formData.get("name")?.toString() ?? ""),
    category: formData.get("category")?.toString(),
    shortName: formData.get("shortName")?.toString(),
    shortDescription: formData.get("shortDescription")?.toString(),
    longDescription: formData.get("longDescription")?.toString(),
    seoTitle: formData.get("seoTitle")?.toString(),
    seoDescription: formData.get("seoDescription")?.toString(),
    seoIntro: formData.get("seoIntro")?.toString(),
  });

  if (!parsed.success) return;

  const { id, ...data } = parsed.data;
  if (id) {
    await prisma.service.update({ where: { id }, data });
  } else {
    await prisma.service.create({ data });
  }

  revalidatePath("/admin/servicii");
  revalidatePath("/");
}

export async function upsertArticleAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const parsed = articleSchema.safeParse({
    id: formData.get("id")?.toString(),
    title: formData.get("title")?.toString(),
    slug: formData.get("slug")?.toString() || slugify(formData.get("title")?.toString() ?? ""),
    excerpt: formData.get("excerpt")?.toString(),
    content: formData.get("content")?.toString(),
    seoTitle: formData.get("seoTitle")?.toString(),
    seoDescription: formData.get("seoDescription")?.toString(),
    isPublished: formData.get("isPublished")?.toString() as "on" | "true" | undefined,
  });

  if (!parsed.success) return;

  const { id, isPublished, ...data } = parsed.data;
  const payload = {
    ...data,
    isPublished: Boolean(isPublished),
    publishedAt: Boolean(isPublished) ? new Date() : undefined,
  };

  if (id) {
    await prisma.article.update({ where: { id }, data: payload });
  } else {
    await prisma.article.create({ data: payload });
  }

  revalidatePath("/admin/articole");
  revalidatePath("/blog");
  revalidatePath("/cum-functioneaza");
}

export async function upsertFaqAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = faqSchema.safeParse({
    id: formData.get("id")?.toString(),
    pageType: formData.get("pageType")?.toString(),
    pageRefId: formData.get("pageRefId")?.toString(),
    countyId: formData.get("countyId")?.toString(),
    cityId: formData.get("cityId")?.toString(),
    serviceId: formData.get("serviceId")?.toString(),
    articleId: formData.get("articleId")?.toString(),
    question: formData.get("question")?.toString(),
    answer: formData.get("answer")?.toString(),
    sortOrder: formData.get("sortOrder")?.toString(),
  });

  if (!parsed.success) return;

  const { id, ...data } = parsed.data;
  const payload = {
    ...data,
    pageRefId: data.pageRefId || null,
    countyId: data.countyId || null,
    cityId: data.cityId || null,
    serviceId: data.serviceId || null,
    articleId: data.articleId || null,
  };

  if (id) {
    await prisma.fAQ.update({ where: { id }, data: payload });
  } else {
    await prisma.fAQ.create({ data: payload });
  }

  revalidatePath("/admin/faq");
}

export async function upsertCompanyAction(
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const parsed = companySchema.safeParse({
    id: formData.get("id")?.toString(),
    name: formData.get("name")?.toString(),
    slug: formData.get("slug")?.toString() || slugify(formData.get("name")?.toString() ?? ""),
    countyId: formData.get("countyId")?.toString(),
    cityId: formData.get("cityId")?.toString(),
    descriptionShort: formData.get("descriptionShort")?.toString(),
    descriptionLong: formData.get("descriptionLong")?.toString(),
    phone: formData.get("phone")?.toString(),
    email: formData.get("email")?.toString(),
    website: formData.get("website")?.toString(),
    address: formData.get("address")?.toString(),
    verificationStatus: formData.get("verificationStatus")?.toString(),
    isPublished: formData.get("isPublished")?.toString() as "on" | "true" | undefined,
    isFeatured: formData.get("isFeatured")?.toString() as "on" | "true" | undefined,
  });

  if (!parsed.success) return;

  const { id, isPublished, isFeatured, ...data } = parsed.data;
  const payload = {
    ...data,
    isPublished: Boolean(isPublished),
    isFeatured: Boolean(isFeatured),
    manuallyEditedAt: new Date(),
  };

  if (id) {
    await prisma.company.update({ where: { id }, data: payload });
  } else {
    await prisma.company.create({ data: { ...payload, sourceType: "manual" } });
  }

  revalidatePath("/admin/firme");
  revalidatePath("/firme");
}

export async function runPlacesImportAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const county = formData.get("county")?.toString() || undefined;
  const city = formData.get("city")?.toString() || undefined;
  const query = formData.get("query")?.toString() || undefined;

  await runPlacesImport({ county, city, query, prismaClient: prisma });

  revalidatePath("/admin/import");
  revalidatePath("/admin/firme");
  revalidatePath("/firme");
}
