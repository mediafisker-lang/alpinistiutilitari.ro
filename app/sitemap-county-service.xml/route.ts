import { getCountyServiceSitemapEntries, renderUrlSet } from "@/lib/sitemaps";

export async function GET() {
  return new Response(renderUrlSet(await getCountyServiceSitemapEntries()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
