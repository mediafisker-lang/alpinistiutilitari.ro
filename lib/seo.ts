import type { Metadata } from "next";

export const siteUrl = "https://cortinanorth.ro";
export const siteName = "Cortina North";

export const defaultTitle =
  "Cortina North Pipera | Comunitate, sesizari si vot";

export const defaultDescription =
  "Portalul comunitatii Cortina North Pipera, Ilfov: sesizari, vot, stadiu asociatie si acces rapid la grupuri de comunicare pentru rezidenti.";

export const defaultKeywords = [
  "Cortina North",
  "cortinanorth",
  "cotina",
  "complex Cortina",
  "complex Pipera",
  "apartamente Pipera",
  "complex de lux",
  "Cortina SPA",
  "Cortina wellness",
  "Cortina welleness",
  "Cortina North Bucuresti",
  "Cortina North Ilfov",
  "Cortina North comunitate",
  "Cortina North asociatie",
  "asociatie proprietari Cortina North",
  "sesizari Cortina North",
  "vot Cortina North",
  "stadiu asociatie Cortina North",
  "comunitate rezidenti Bucuresti",
  "comunitate rezidenti Ilfov",
  "portal rezidenti Cortina North",
  "grup WhatsApp Cortina North",
  "grup Facebook Cortina North",
];

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const resolvedTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const resolvedDescription = description ?? defaultDescription;
  const canonicalUrl = new URL(path, siteUrl).toString();

  return {
    metadataBase: new URL(siteUrl),
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "ro-RO": canonicalUrl,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonicalUrl,
      siteName,
      locale: "ro_RO",
      type: "website",
      images: [
        {
          url: "/images/cortina/cortina-north-pipera-hero.webp",
          alt: "Cortina North Pipera - complex rezidential",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: ["/images/cortina/cortina-north-pipera-hero.webp"],
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: ["/icon.svg"],
      apple: [{ url: "/icon.svg" }],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    category: "community",
    other: {
      "x-seo-keyphrases": [...defaultKeywords, ...keywords].join(", "),
    },
  };
}
