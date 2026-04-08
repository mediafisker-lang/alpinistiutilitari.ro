import { prisma } from "@/lib/db";
import { getAdminSessionToken } from "@/lib/auth/session";

export async function getCurrentAdmin() {
  const token = await getAdminSessionToken();

  if (!token) return null;

  try {
    const session = await prisma.adminSession.findUnique({
      where: { token },
      include: { adminUser: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session.adminUser;
  } catch {
    return null;
  }
}
