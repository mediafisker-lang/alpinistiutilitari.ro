import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminAuthorizedRequest } from "@/lib/admin-auth";
import { hashPassword } from "@/lib/password";
import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";

const schema = z.object({
  residentId: z.string().uuid(),
  password: z
    .string()
    .min(8, "Parola trebuie sa aiba cel putin 8 caractere.")
    .max(72, "Parola este prea lunga."),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Cerere invalida." }, { status: 400 });
  }

  if (!isAdminAuthorizedRequest(request)) {
    return NextResponse.json({ success: false, message: "Acces admin invalid." }, { status: 401 });
  }

  if (!hasAdminSupabaseEnv()) {
    return NextResponse.json(
      { success: false, message: "Lipseste configurarea Supabase pentru admin." },
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

  const { error } = await supabase
    .from("residents")
    .update({ password_hash: hashPassword(parsed.data.password) })
    .eq("id", parsed.data.residentId);

  if (error) {
    return NextResponse.json(
      { success: false, message: "Parola nu a putut fi actualizata." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, message: "Parola a fost actualizata." });
}
