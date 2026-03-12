import { NextResponse } from "next/server";

import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";

export async function POST(request: Request) {
  const formData = await request.formData();
  const key = String(formData.get("key") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!process.env.ADMIN_ACCESS_KEY || key !== process.env.ADMIN_ACCESS_KEY) {
    return NextResponse.json({ success: false, message: "Cheie de admin invalidă." }, { status: 401 });
  }

  if (!title || !description) {
    return NextResponse.json({ success: false, message: "Completează titlul și descrierea." }, { status: 400 });
  }

  if (!hasAdminSupabaseEnv()) {
    return NextResponse.json({ success: false, message: "Lipsește configurarea Supabase pentru admin." }, { status: 503 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ success: false, message: "Conexiunea la baza de date nu este disponibilă." }, { status: 503 });
  }

  const { error } = await supabase.from("vote_proposals").insert({
    title,
    description,
    status: "open",
  });

  if (error) {
    return NextResponse.json({ success: false, message: "Propunerea nu a putut fi salvată." }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Propunerea a fost publicată." });
}
