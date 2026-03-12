import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyPassword } from "@/lib/password";
import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Email invalid."),
  password: z.string().min(8, "Parola trebuie sa aiba cel putin 8 caractere."),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Verifica datele introduse si incearca din nou." },
      { status: 400 },
    );
  }

  if (!hasAdminSupabaseEnv()) {
    return NextResponse.json(
      { success: false, message: "Autentificarea nu este disponibila acum." },
      { status: 503 },
    );
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { success: false, message: "Conexiunea la baza de date nu este disponibila." },
      { status: 503 },
    );
  }

  const { data: residents } = await supabase
    .from("residents")
    .select("id, full_name, password_hash")
    .eq("email", parsed.data.email)
    .order("created_at", { ascending: false })
    .limit(1);

  const resident = residents?.[0];

  if (!resident?.password_hash || !verifyPassword(parsed.data.password, resident.password_hash)) {
    return NextResponse.json(
      { success: false, message: "Emailul sau parola nu sunt corecte." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    email: parsed.data.email,
    message: "Autentificare reusita.",
  });
}
