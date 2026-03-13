import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";

const schema = z.object({
  id: z.string().uuid(),
  key: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Cerere invalida." }, { status: 400 });
  }

  if (!process.env.ADMIN_ACCESS_KEY || parsed.data.key !== process.env.ADMIN_ACCESS_KEY) {
    return NextResponse.json({ success: false, message: "Cheie de admin invalida." }, { status: 401 });
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
    .from("proposal_votes")
    .update({ reason: null })
    .eq("id", parsed.data.id);

  if (error) {
    return NextResponse.json(
      { success: false, message: "Mesajul nu a putut fi sters." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, message: "Mesaj sters." });
}
