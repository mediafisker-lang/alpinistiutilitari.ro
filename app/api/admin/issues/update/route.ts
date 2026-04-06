import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminAuthorizedRequest } from "@/lib/admin-auth";
import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";

const schema = z.object({
  id: z.string().uuid(),
  contact_name: z.string().trim().min(2),
  contact_phone: z.string().trim().max(20).optional().or(z.literal("")),
  contact_email: z.string().trim().email().optional().or(z.literal("")),
  category: z.string().trim().min(2),
  title: z.string().trim().min(3),
  description: z.string().trim().min(10).max(1000),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Date invalide pentru editare." }, { status: 400 });
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
    .from("issues")
    .update({
      contact_name: parsed.data.contact_name,
      contact_phone: parsed.data.contact_phone || null,
      contact_email: parsed.data.contact_email || null,
      category: parsed.data.category,
      title: parsed.data.title,
      description: parsed.data.description,
    })
    .eq("id", parsed.data.id);

  if (error) {
    return NextResponse.json(
      { success: false, message: "Sesizarea nu a putut fi actualizata." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, message: "Sesizarea a fost actualizata." });
}
