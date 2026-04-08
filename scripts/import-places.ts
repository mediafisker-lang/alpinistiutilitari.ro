import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

function getArgValue(flag: string) {
  const entry = process.argv.find((arg) => arg.startsWith(`--${flag}=`));
  return entry ? entry.split("=")[1] : undefined;
}

async function main() {
  const { runPlacesImport } = await import("../lib/integrations/google-places-import");
  const result = await runPlacesImport({
    county: getArgValue("county"),
    city: getArgValue("city"),
    query: getArgValue("query"),
    minimumRating: Number(getArgValue("minRating") ?? "4"),
  });

  console.log(
    `Import finalizat: ${result.source} | găsite ${result.totalFound} | importate ${result.totalImported} | actualizate ${result.totalUpdated}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
