import { NextResponse } from "next/server";

import { isAdminAuthorizedRequest } from "@/lib/admin-auth";
import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!isAdminAuthorizedRequest(request)) {
    return NextResponse.json({ success: false, message: "Acces admin invalid." }, { status: 401 });
  }

  if (!title || !description) {
    return NextResponse.json(
      { success: false, message: "Completeaza titlul si descrierea." },
      { status: 400 },
    );
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

  const { error } = await supabase.from("vote_proposals").insert({
    title,
    description,
    status: "open",
  });

  if (error) {
    return NextResponse.json(
      { success: false, message: "Propunerea nu a putut fi salvata." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, message: "Propunerea a fost publicata." });
}
