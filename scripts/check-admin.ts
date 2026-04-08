import { prisma } from "../lib/db";
import { verifyPassword } from "../lib/auth/password";

async function main() {
  const admin = await prisma.adminUser.findUnique({
    where: { email: "admin@alpinistiutilitari.ro" },
  });

  console.log(
    JSON.stringify(
      {
        exists: Boolean(admin),
        validPassword: admin ? verifyPassword("Admin1234!", admin.passwordHash) : false,
        id: admin?.id ?? null,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
