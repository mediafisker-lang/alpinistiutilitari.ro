import { PrismaClient } from "@prisma/client";
import { serviceCatalog } from "../lib/data/service-catalog";

const prisma = new PrismaClient();

async function main() {
  for (const service of serviceCatalog) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        category: service.category,
        shortDescription: service.shortDescription,
        longDescription: service.longDescription,
        seoTitle: `${service.name} in Romania`,
        seoDescription: service.shortDescription,
        icon: service.icon,
        isActive: true,
      },
      create: {
        name: service.name,
        slug: service.slug,
        category: service.category,
        shortDescription: service.shortDescription,
        longDescription: service.longDescription,
        seoTitle: `${service.name} in Romania`,
        seoDescription: service.shortDescription,
        icon: service.icon,
        isActive: true,
      },
    });
  }

  const count = await prisma.service.count({ where: { isActive: true } });
  console.log(`Sync servicii finalizat: ${count} servicii active.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
