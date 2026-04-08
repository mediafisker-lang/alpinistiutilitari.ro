type HtmlAudit = {
  url: string;
  status: number;
  title?: string;
  canonical?: string;
  robots?: string;
};

const DEFAULT_PATHS = [
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/judete",
  "/servicii",
  "/bucuresti",
  "/bucuresti/spalare-geamuri-la-inaltime",
  "/firme",
  "/blog",
];

function getArg(name: string) {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

function extractTagContent(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return match?.[1]?.trim();
}

async function auditHtml(baseUrl: string, path: string): Promise<HtmlAudit> {
  const url = new URL(path, baseUrl).toString();
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "alpinistiutilitari-live-audit/1.0",
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return {
      url,
      status: response.status,
    };
  }

  const html = await response.text();
  const title = extractTagContent(html, /<title>([^<]+)<\/title>/i);
  const canonical = extractTagContent(
    html,
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
  );
  const robots = extractTagContent(
    html,
    /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i,
  );

  return {
    url,
    status: response.status,
    title,
    canonical,
    robots,
  };
}

async function main() {
  const base = getArg("base");
  if (!base) {
    console.error('Lipseste argumentul --base=https://domeniu.ro');
    process.exit(1);
  }

  const baseUrl = base.endsWith("/") ? base : `${base}/`;
  console.log(`Audit live pentru: ${baseUrl}`);

  for (const path of DEFAULT_PATHS) {
    try {
      const result = await auditHtml(baseUrl, path);
      console.log(`\n${path}`);
      console.log(`  status: ${result.status}`);
      if (result.title) {
        console.log(`  title: ${result.title}`);
      }
      if (result.canonical) {
        console.log(`  canonical: ${result.canonical}`);
      }
      if (result.robots) {
        console.log(`  robots: ${result.robots}`);
      }
    } catch (error) {
      console.log(`\n${path}`);
      console.log(`  eroare: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
