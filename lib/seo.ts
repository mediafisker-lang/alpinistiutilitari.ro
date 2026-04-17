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

const defaultSocialImage = "/images/cortina/cortina-north-pipera-hero.webp";

function toAbsoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

function resolveImageUrl(image?: string) {
  if (!image) {
    return defaultSocialImage;
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return toAbsoluteUrl(image.startsWith("/") ? image : `/${image}`);
}

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  noIndex = false,
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
}): Metadata {
  const resolvedTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const resolvedDescription = description ?? defaultDescription;
  const canonicalUrl = toAbsoluteUrl(path);
  const socialImage = resolveImageUrl(image);

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
          url: socialImage,
          alt: "Imagine reprezentativa",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [socialImage],
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

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    description: defaultDescription,
    areaServed: "Romania",
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ label: string; href?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? toAbsoluteUrl(item.href) : undefined,
    })),
  };
}

export function buildCompanyJsonLd(company: {
  name: string;
  description: string;
  path: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  city: string;
  county: string;
  areaServed?: string[];
  ratingValue?: number | null;
  ratingCount?: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    description: company.description,
    url: toAbsoluteUrl(company.path),
    telephone: company.phone ?? undefined,
    email: company.email ?? undefined,
    sameAs: company.website ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address ?? undefined,
      addressLocality: company.city,
      addressRegion: company.county,
      addressCountry: "RO",
    },
    areaServed: company.areaServed?.map((zone) => ({
      "@type": "Place",
      name: zone,
    })),
    aggregateRating:
      typeof company.ratingValue === "number"
        ? {
            "@type": "AggregateRating",
            ratingValue: company.ratingValue.toFixed(1),
            reviewCount: company.ratingCount ?? 1,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  };
}

export function buildArticleJsonLd(article: {
  title: string;
  description: string;
  path: string;
  publishedAt: Date | string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: new Date(article.publishedAt).toISOString(),
    url: toAbsoluteUrl(article.path),
    image: article.image ? [resolveImageUrl(article.image)] : undefined,
    author: {
      "@type": "Organization",
      name: siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
    },
  };
}

export function buildFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildServiceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  areaServed: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: toAbsoluteUrl(input.path),
    areaServed: {
      "@type": "Place",
      name: input.areaServed,
    },
    provider: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
  };
}
