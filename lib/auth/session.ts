import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";

const ADMIN_SESSION_COOKIE = "au_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function createAdminSession(adminUserId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_MAX_AGE * 1000);

  await prisma.adminSession.create({
    data: {
      adminUserId,
      token,
      expiresAt,
    },
  });

  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
}

export async function getAdminSessionToken() {
  const store = await cookies();
  return store.get(ADMIN_SESSION_COOKIE)?.value ?? null;
}

export async function clearAdminSession() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;

  if (token) {
    await prisma.adminSession.deleteMany({
      where: { token },
    });
  }

  store.delete(ADMIN_SESSION_COOKIE);
}
