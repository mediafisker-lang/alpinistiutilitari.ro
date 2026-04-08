import { PrismaClient } from "@prisma/client";
import { filterCompaniesWithUtilityPortfolio } from "../lib/company-ranking";

const prisma = new PrismaClient();

async function main() {
  const companies = await prisma.company.findMany({
    where: {
      sourceType: "google_places",
      isActive: true,
      verificationStatus: { not: "hidden" },
    },
    include: {
      county: true,
      city: true,
      coverage: { include: { county: true, city: true } },
      services: { include: { service: true } },
    },
  });

  const allowedIds = new Set(filterCompaniesWithUtilityPortfolio(companies).map((company) => company.id));
  const hideIds = companies.filter((company) => !allowedIds.has(company.id)).map((company) => company.id);
  const keepIds = companies.filter((company) => allowedIds.has(company.id)).map((company) => company.id);

  if (hideIds.length) {
    await prisma.company.updateMany({
      where: { id: { in: hideIds } },
      data: { isPublished: false },
    });
  }

  if (keepIds.length) {
    await prisma.company.updateMany({
      where: { id: { in: keepIds } },
      data: { isPublished: true },
    });
  }

  console.log(`Google Places review: ${keepIds.length} păstrate public, ${hideIds.length} ascunse.`);
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
