import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Language",
    value: "ro",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/articole",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/articole/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/firma/:slug",
        destination: "/firme/:slug",
        permanent: true,
      },
      {
        source: "/judet/:countySlug",
        destination: "/:countySlug",
        permanent: true,
      },
      {
        source: "/judet/:countySlug/oras/:citySlug",
        destination: "/:countySlug/:citySlug",
        permanent: true,
      },
      {
        source: "/judet/:countySlug/:citySlug",
        destination: "/:countySlug/:citySlug",
        permanent: true,
      },
      {
        source: "/despre",
        destination: "/despre-noi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
