import { NextResponse } from "next/server";
import { z } from "zod";

import { hashPassword } from "@/lib/password";
import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";

const schema = z.object({
  residentId: z.string().uuid(),
  password: z
    .string()
    .min(8, "Parola trebuie să aibă cel puțin 8 caractere.")
    .max(72, "Parola este prea lungă."),
  key: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Cerere invalidă." }, { status: 400 });
  }

  if (!process.env.ADMIN_ACCESS_KEY || parsed.data.key !== process.env.ADMIN_ACCESS_KEY) {
    return NextResponse.json({ success: false, message: "Cheie de admin invalidă." }, { status: 401 });
  }

  if (!hasAdminSupabaseEnv()) {
    return NextResponse.json(
      { success: false, message: "Lipsește configurarea Supabase pentru admin." },
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

  const { error } = await supabase
    .from("residents")
    .update({ password_hash: hashPassword(parsed.data.password) })
    .eq("id", parsed.data.residentId);

  if (error) {
    return NextResponse.json(
      { success: false, message: "Parola nu a putut fi actualizată." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, message: "Parola a fost actualizată." });
}
