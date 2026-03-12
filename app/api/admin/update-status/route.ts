import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";

const payloadSchema = z.object({
  id: z.string().uuid(),
  table: z.enum(["residents", "issues"]),
  status: z.string().min(2),
  key: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Cerere invalidă.",
      },
      { status: 400 },
    );
  }

  if (!process.env.ADMIN_ACCESS_KEY || parsed.data.key !== process.env.ADMIN_ACCESS_KEY) {
    return NextResponse.json(
      {
        success: false,
        message: "Cheie de admin invalidă.",
      },
      { status: 401 },
    );
  }

  if (!hasAdminSupabaseEnv()) {
    return NextResponse.json(
      {
        success: false,
        message: "Lipsește configurarea Supabase pentru admin.",
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

  const { error } = await supabase
    .from(parsed.data.table)
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Statusul nu a putut fi actualizat.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Status actualizat.",
  });
}
