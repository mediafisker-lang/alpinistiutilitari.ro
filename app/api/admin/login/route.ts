import { NextResponse } from "next/server";
import { z } from "zod";

import {
  areAdminCredentialsValid,
  createAdminSessionToken,
  getAdminSessionCookieName,
} from "@/lib/admin-auth";

const schema = z.object({
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Cerere invalida." }, { status: 400 });
  }

  if (!areAdminCredentialsValid(parsed.data.password)) {
    return NextResponse.json(
      { success: false, message: "Parola introdusa este incorecta." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true, message: "Autentificare reusita." });
  response.cookies.set({
    name: getAdminSessionCookieName(),
    value: createAdminSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
