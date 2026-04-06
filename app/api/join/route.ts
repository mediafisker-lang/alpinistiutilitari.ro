import { NextResponse } from "next/server";
import type { ZodIssue } from "zod";

import { hashPassword } from "@/lib/password";
import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";
import { residentSchema, validateAntiSpam } from "@/lib/validations";

function flattenErrors(issues: ZodIssue[]) {
  return issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = typeof issue.path[0] === "symbol" ? "form" : String(issue.path[0] ?? "form");
    acc[key] = [...(acc[key] ?? []), issue.message];
    return acc;
  }, {});
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = residentSchema.safeParse({
    full_name: formData.get("full_name"),
    building: formData.get("building"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
    resident_type: formData.get("resident_type"),
    consent: formData.get("consent") === "true",
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

  const { error } = await supabase.from("residents").insert({
    full_name: parsed.data.full_name,
    building: parsed.data.building,
    phone: parsed.data.phone,
    email: parsed.data.email,
    password_hash: hashPassword(parsed.data.password),
    resident_type: parsed.data.resident_type,
    consent: parsed.data.consent,
    status: "nou",
  });

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Nu am putut salva înscrierea. Încearcă din nou.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Înscrierea a fost trimisă. Mulțumim.",
  });
}
