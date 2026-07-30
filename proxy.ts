import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CANONICAL_SITE_URL } from "@/lib/utils";

export function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const hostname = (forwardedHost ?? request.nextUrl.hostname)
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const pathname = request.nextUrl.pathname;
  let canonicalPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (canonicalPath === "/despre") {
    canonicalPath = "/despre-noi";
  } else if (canonicalPath === "/articole") {
    canonicalPath = "/blog";
  } else if (canonicalPath.startsWith("/articole/")) {
    canonicalPath = canonicalPath.replace(/^\/articole\//, "/blog/");
  } else if (canonicalPath.startsWith("/firma/")) {
    canonicalPath = canonicalPath.replace(/^\/firma\//, "/firme/");
  } else {
    const cityAlias = canonicalPath.match(/^\/judet\/([^/]+)\/(?:oras\/)?([^/]+)$/);
    const countyAlias = canonicalPath.match(/^\/judet\/([^/]+)$/);

    if (cityAlias) {
      canonicalPath = `/${cityAlias[1]}/${cityAlias[2]}`;
    } else if (countyAlias) {
      canonicalPath = `/${countyAlias[1]}`;
    }
  }

  const needsCanonicalRedirect =
    hostname === "www.alpinistiutilitari.ro" ||
    forwardedProto === "http" ||
    canonicalPath !== pathname;

  if (needsCanonicalRedirect) {
    const destination = new URL(
      `${canonicalPath}${request.nextUrl.search}`,
      CANONICAL_SITE_URL,
    );
    return NextResponse.redirect(destination, 301);
  }

  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
    const token = request.cookies.get("au_admin_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
