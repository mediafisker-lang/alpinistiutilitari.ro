import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyPassword } from "@/lib/password";
import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";

const schema = z.object({
  proposalId: z.string().uuid(),
  email: z.string().trim().toLowerCase().email("Email invalid."),
  password: z.string().min(8, "Parola trebuie să aibă cel puțin 8 caractere."),
  choice: z.enum(["yes", "no"]),
  reason: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Verifică datele introduse și încearcă din nou." }, { status: 400 });
  }

  if (!hasAdminSupabaseEnv()) {
    return NextResponse.json({ success: false, message: "Votarea nu este disponibilă acum." }, { status: 503 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ success: false, message: "Conexiunea la baza de date nu este disponibilă." }, { status: 503 });
  }

  const { data: residents } = await supabase
    .from("residents")
    .select("id, full_name, password_hash")
    .eq("email", parsed.data.email)
    .order("created_at", { ascending: false })
    .limit(1);

  const resident = residents?.[0];

  if (!resident?.password_hash || !verifyPassword(parsed.data.password, resident.password_hash)) {
    return NextResponse.json({ success: false, message: "Emailul sau parola nu sunt corecte." }, { status: 401 });
  }

  const { data: proposal } = await supabase
    .from("vote_proposals")
    .select("id, status")
    .eq("id", parsed.data.proposalId)
    .maybeSingle();

  if (!proposal || proposal.status !== "open") {
    return NextResponse.json({ success: false, message: "Acest subiect nu mai este deschis pentru vot." }, { status: 400 });
  }

  const { error } = await supabase.from("proposal_votes").upsert(
    {
      proposal_id: parsed.data.proposalId,
      resident_id: resident.id,
      vote_choice: parsed.data.choice,
      reason: parsed.data.reason || null,
    },
    { onConflict: "proposal_id,resident_id" },
  );

  if (error) {
    return NextResponse.json({ success: false, message: "Nu am putut înregistra votul." }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Votul tău a fost înregistrat." });
}
