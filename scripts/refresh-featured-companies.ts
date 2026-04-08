import { PrismaClient } from "@prisma/client";
import { filterCompaniesWithUtilityPortfolio, getCompanySeoScore } from "../lib/company-ranking";

const prisma = new PrismaClient();

async function main() {
  const counties = await prisma.county.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
  });

  for (const county of counties) {
    const companies = await prisma.company.findMany({
      where: {
        countyId: county.id,
        isActive: true,
        isPublished: true,
        verificationStatus: { not: "hidden" },
      },
      include: { services: { include: { service: true } } },
    });

    const ranked = filterCompaniesWithUtilityPortfolio(companies)
      .map((company) => ({ company, score: getCompanySeoScore(company) }))
      .filter((item) => item.score >= 40)
      .sort((left, right) => right.score - left.score)
      .slice(0, 8);

    const featuredIds = new Set(ranked.map((item) => item.company.id));

    await prisma.company.updateMany({
      where: { countyId: county.id },
      data: { isFeatured: false },
    });

    if (featuredIds.size) {
      await prisma.company.updateMany({
        where: { id: { in: [...featuredIds] } },
        data: { isFeatured: true },
      });
    }

    console.log(`${county.name}: ${featuredIds.size} firme recomandate actualizate`);
  }
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
