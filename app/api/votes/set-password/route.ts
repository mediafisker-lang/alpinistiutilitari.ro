import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/password";
import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";
import { votePasswordSetupSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = votePasswordSetupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Verifică datele introduse și încearcă din nou." },
      { status: 400 },
    );
  }

  if (!hasAdminSupabaseEnv()) {
    return NextResponse.json(
      { success: false, message: "Setarea parolei nu este disponibilă acum." },
      { status: 503 },
    );
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { success: false, message: "Conexiunea la baza de date nu este disponibilă." },
      { status: 503 },
    );
  }

  const { data: residents } = await supabase
    .from("residents")
    .select("id, password_hash")
    .eq("email", parsed.data.email)
    .eq("phone", parsed.data.phone)
    .order("created_at", { ascending: false })
    .limit(1);

  const resident = residents?.[0];

  if (!resident) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Nu am găsit o înscriere care să corespundă cu emailul și telefonul introduse.",
      },
      { status: 404 },
    );
  }

  if (resident.password_hash) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Pentru această înscriere există deja o parolă salvată. Dacă nu o mai știi, schimbarea parolei trebuie făcută separat din administrare.",
      },
      { status: 409 },
    );
  }

  const { error } = await supabase
    .from("residents")
    .update({ password_hash: hashPassword(parsed.data.password) })
    .eq("id", resident.id);

  if (error) {
    return NextResponse.json(
      { success: false, message: "Nu am putut salva parola. Încearcă din nou." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Parola a fost salvată. Acum poți vota cu emailul și parola ta.",
  });
}
