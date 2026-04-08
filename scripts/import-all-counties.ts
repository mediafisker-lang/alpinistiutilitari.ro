import { execFileSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import { romanianCounties } from "../lib/data/romanian-counties";

const prisma = new PrismaClient();
const MINIMUM_RATING = 4;
const TARGET_PER_COUNTY = 5;

function runSingleImport(args: string[]) {
  if (process.platform === "win32") {
    execFileSync("cmd.exe", ["/c", "npx", "tsx", "scripts/import-places.ts", ...args], {
      cwd: process.cwd(),
      stdio: "inherit",
      env: process.env,
    });
    return;
  }

  execFileSync("npx", ["tsx", "scripts/import-places.ts", ...args], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  });
}

async function getPublishedCountyCount(countySlug: string) {
  const county = await prisma.county.findUnique({ where: { slug: countySlug } });
  if (!county) return 0;

  return prisma.company.count({
    where: {
      countyId: county.id,
      isActive: true,
      isPublished: true,
      verificationStatus: { not: "hidden" },
      ratingValue: { gte: MINIMUM_RATING },
    },
  });
}

async function main() {
  const summary: Array<{ county: string; count: number }> = [];

  for (const county of romanianCounties) {
    console.log(`\n=== ${county.name} ===`);

    runSingleImport([`--county=${county.slug}`, `--minRating=${MINIMUM_RATING}`]);

    let countyCount = await getPublishedCountyCount(county.slug);

    if (countyCount < TARGET_PER_COUNTY) {
      const candidateCities = [county.countySeat, ...(county.extraCities ?? [])];

      for (const cityName of candidateCities) {
        if (countyCount >= TARGET_PER_COUNTY) break;

        console.log(`Completare pe oras: ${cityName}, ${county.name}`);
        runSingleImport([
          `--county=${county.slug}`,
          `--city=${cityName}`,
          `--minRating=${MINIMUM_RATING}`,
        ]);

        countyCount = await getPublishedCountyCount(county.slug);
      }
    }

    summary.push({ county: county.name, count: countyCount });
    console.log(`${county.name}: ${countyCount} firme publicate cu rating >= ${MINIMUM_RATING}`);
  }

  console.log("\n=== Rezumat final ===");
  summary
    .sort((left, right) => left.count - right.count || left.county.localeCompare(right.county, "ro"))
    .forEach((item) => {
      console.log(`${item.county}: ${item.count}`);
    });
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
