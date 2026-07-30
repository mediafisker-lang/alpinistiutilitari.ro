import type { MetadataRoute } from "next";
import { CANONICAL_SITE_URL } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const privatePaths = ["/api/", "/admin/", "/admin/login", "/admin-cereri", "/multumim"];
  const publicCrawlerRules = [
    "*",
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "PerplexityBot",
    "ClaudeBot",
  ].map((userAgent) => ({
    userAgent,
    allow: "/",
    disallow: privatePaths,
  }));

  return {
    rules: publicCrawlerRules,
    sitemap: `${CANONICAL_SITE_URL}/sitemap.xml`,
    host: new URL(CANONICAL_SITE_URL).host,
  };
}
