import type { Metadata } from "next";

export const siteUrl = "https://www.cortinanorth.ro";
export const siteName = "Cortina North";

export const defaultTitle =
  "Cortina North Bucuresti Ilfov | Comunitate, sesizari, vot si actualizari";

export const defaultDescription =
  "Portalul comunitatii Cortina North din Bucuresti si Ilfov. Gasesti actualizari, sesizari, voturi, stadiul asociatiei si acces la grupurile interne ale comunitatii.";

export const defaultKeywords = [
  "Cortina North",
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
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonicalUrl,
      siteName,
      locale: "ro_RO",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
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
  };
}
