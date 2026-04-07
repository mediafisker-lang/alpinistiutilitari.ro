import { NextResponse } from "next/server";
import type { ZodIssue } from "zod";

import { verifyPassword } from "@/lib/password";
import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";
import { issueSchema, validateAntiSpam } from "@/lib/validations";

function flattenErrors(issues: ZodIssue[]) {
  return issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = typeof issue.path[0] === "symbol" ? "form" : String(issue.path[0] ?? "form");
    acc[key] = [...(acc[key] ?? []), issue.message];
    return acc;
  }, {});
}

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSize = 5 * 1024 * 1024;
const maxImages = 3;

function buildIssueTitle(category: string, description: string) {
  const compactDescription = description.replace(/\s+/g, " ").trim();
  const shortDescription = compactDescription.length > 64
    ? `${compactDescription.slice(0, 61)}...`
    : compactDescription;

  return `${category}: ${shortDescription}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const authEmail = String(formData.get("auth_email") ?? "")
    .trim()
    .toLowerCase();
  const authPassword = String(formData.get("auth_password") ?? "");
  const photoEntries = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const parsed = issueSchema.safeParse({
    contact_name: formData.get("contact_name"),
    contact_phone: formData.get("contact_phone"),
    category: formData.get("category"),
    description: formData.get("description"),
    website: formData.get("website"),
    submitted_at: formData.get("submitted_at"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Verifică datele introduse și încearcă din nou.",
        errors: flattenErrors(parsed.error.issues),
      },
      { status: 400 },
    );
  }

  if (photoEntries.length > maxImages) {
    return NextResponse.json(
      {
        success: false,
        message: "Poți atașa cel mult 3 poze.",
        errors: { photos: ["Poți atașa cel mult 3 poze."] },
      },
      { status: 400 },
    );
  }

  for (const file of photoEntries) {
    if (!allowedImageTypes.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Pozele trebuie să fie JPG, PNG sau WEBP.",
          errors: { photos: ["Pozele trebuie să fie JPG, PNG sau WEBP."] },
        },
        { status: 400 },
      );
    }

    if (file.size > maxImageSize) {
      return NextResponse.json(
        {
          success: false,
          message: "Fiecare poză poate avea maximum 5 MB.",
          errors: { photos: ["Fiecare poză poate avea maximum 5 MB."] },
        },
        { status: 400 },
      );
    }
  }

  if (parsed.data.website || !validateAntiSpam(parsed.data.submitted_at)) {
    return NextResponse.json(
      {
        success: false,
        message: "Trimiterea a fost blocată de filtrul anti-spam.",
      },
      { status: 400 },
    );
  }

  if (!hasAdminSupabaseEnv()) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Formularul este pregătit, dar lipsește configurarea Supabase pentru salvare.",
      },
      { status: 503 },
    );
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        message: "Conexiunea la baza de date nu este disponibilă.",
      },
      { status: 503 },
    );
  }

  if (!authEmail || !authPassword) {
    return NextResponse.json(
      {
        success: false,
        message: "Trebuie sa fii logat ca sa poti trimite o sesizare.",
      },
      { status: 401 },
    );
  }

  const { data: residents } = await supabase
    .from("residents")
    .select("id, password_hash")
    .eq("email", authEmail)
    .order("created_at", { ascending: false })
    .limit(1);

  const resident = residents?.[0];

  if (!resident?.password_hash || !verifyPassword(authPassword, resident.password_hash)) {
    return NextResponse.json(
      {
        success: false,
        message: "Trebuie sa fii logat ca sa poti trimite o sesizare.",
      },
      { status: 401 },
    );
  }

  const attachmentUrls: string[] = [];

  for (const file of photoEntries) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `issues/${crypto.randomUUID()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("issue-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          success: false,
          message: "Nu am putut încărca pozele. Încearcă din nou.",
          errors: { photos: ["Nu am putut încărca pozele. Încearcă din nou."] },
        },
        { status: 500 },
      );
    }

    const { data } = supabase.storage.from("issue-images").getPublicUrl(filePath);
    attachmentUrls.push(data.publicUrl);
  }

  const { error } = await supabase.from("issues").insert({
    contact_name: parsed.data.contact_name,
    contact_phone: parsed.data.contact_phone || null,
    contact_email: null,
    category: parsed.data.category,
    title: buildIssueTitle(parsed.data.category, parsed.data.description),
    description: parsed.data.description,
    attachment_urls: attachmentUrls,
    status: "noua",
  });

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Nu am putut salva sesizarea. Încearcă din nou.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Sesizarea a fost trimisă. Revenim rapid cu informații dacă se impune. Mulțumim!",
  });
}
