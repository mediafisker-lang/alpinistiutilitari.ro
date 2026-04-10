import { loadEnvConfig } from "@next/env";
import { PrismaClient, type Prisma } from "@prisma/client";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");
const DAYS_OLD = 30;
const cutoffDate = new Date(Date.now() - DAYS_OLD * 24 * 60 * 60 * 1000);

async function main() {
  const unpublishedGooglePlacesWhere: Prisma.CompanyWhereInput = {
    sourceType: "google_places" as const,
    isPublished: false,
    verificationStatus: { in: ["hidden", "pending"] },
    leadRequests: { none: {} },
    leadSelections: { none: {} },
  };

  const [companiesToDelete, importEventsToDelete, importRunsToDelete] = await Promise.all([
    prisma.company.count({ where: unpublishedGooglePlacesWhere }),
    prisma.companyImportEvent.count({
      where: {
        createdAt: { lt: cutoffDate },
        OR: [{ status: { startsWith: "skipped_" } }, { status: "failed" }],
      },
    }),
    prisma.companyImportRun.count({
      where: {
        startedAt: { lt: cutoffDate },
        status: { in: ["completed", "failed"] },
      },
    }),
  ]);

  console.log("Audit cleanup:");
  console.log(`- Companii nepublicate Google Places (fără usage): ${companiesToDelete}`);
  console.log(`- CompanyImportEvent vechi (${DAYS_OLD}+ zile): ${importEventsToDelete}`);
  console.log(`- CompanyImportRun vechi (${DAYS_OLD}+ zile): ${importRunsToDelete}`);

  if (!APPLY) {
    console.log("\nRulează cu --apply pentru curățarea efectivă.");
    return;
  }

  const [deletedCompanies, deletedEvents, deletedRuns] = await Promise.all([
    prisma.company.deleteMany({ where: unpublishedGooglePlacesWhere }),
    prisma.companyImportEvent.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        OR: [{ status: { startsWith: "skipped_" } }, { status: "failed" }],
      },
    }),
    prisma.companyImportRun.deleteMany({
      where: {
        startedAt: { lt: cutoffDate },
        status: { in: ["completed", "failed"] },
      },
    }),
  ]);

  console.log("\nCleanup aplicat:");
  console.log(`- Companii șterse: ${deletedCompanies.count}`);
  console.log(`- Evenimente import șterse: ${deletedEvents.count}`);
  console.log(`- Rulări import șterse: ${deletedRuns.count}`);
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
