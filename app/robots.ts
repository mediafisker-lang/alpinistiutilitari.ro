import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();
  const host = (() => {
    try {
      return new URL(baseUrl).host;
    } catch {
      return undefined;
    }
  })();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/admin/login", "/admin-cereri", "/multumim"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host,
  };
}
