import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminAuthorizedRequest } from "@/lib/admin-auth";
import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";

const payloadSchema = z.object({
  id: z.string().uuid(),
  table: z.enum(["residents", "issues"]),
  status: z.string().min(2),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Cerere invalida.",
      },
      { status: 400 },
    );
  }

  if (!isAdminAuthorizedRequest(request)) {
    return NextResponse.json(
      {
        success: false,
        message: "Acces admin invalid.",
      },
      { status: 401 },
    );
  }

  if (!hasAdminSupabaseEnv()) {
    return NextResponse.json(
      {
        success: false,
        message: "Lipseste configurarea Supabase pentru admin.",
      },
      { status: 503 },
    );
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        message: "Conexiunea la baza de date nu este disponibila.",
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
