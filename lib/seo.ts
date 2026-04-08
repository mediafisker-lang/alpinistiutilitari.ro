import type { Metadata } from "next";
import { absoluteUrl, getSiteUrl } from "@/lib/utils";

const DEFAULT_SOCIAL_IMAGE = "/alpinisti_utilitari_1.jpg";
const DEFAULT_SOCIAL_IMAGE_ALT =
  "AlpinistiUtilitari.ro - platforma de firme pentru lucrari la inaltime";

function resolveUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return absoluteUrl(value);
}

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  image?: string;
};

export function buildMetadata({
  title,
  description,
  path = "",
  noIndex = false,
  image,
}: MetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const socialImageUrl = resolveUrl(image ?? DEFAULT_SOCIAL_IMAGE);

  return {
    metadataBase: new URL(getSiteUrl()),
    applicationName: "AlpinistiUtilitari.ro",
    title,
    description,
    keywords: [
      "alpinism utilitar",
      "alpinisti utilitari",
      "lucrari la inaltime",
      "firme alpinism utilitar",
      "servicii la inaltime Romania",
    ],
    category: "business",
    referrer: "origin-when-cross-origin",
    authors: [{ name: "AlpinistiUtilitari.ro" }],
    creator: "AlpinistiUtilitari.ro",
    publisher: "AlpinistiUtilitari.ro",
    alternates: {
      canonical,
      languages: {
        "ro-RO": canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "AlpinistiUtilitari.ro",
      locale: "ro_RO",
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: DEFAULT_SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: socialImageUrl,
          alt: DEFAULT_SOCIAL_IMAGE_ALT,
        },
      ],
    },
    other: {
      "content-language": "ro",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AlpinistiUtilitari.ro",
    url: absoluteUrl(),
    description:
      "Platforma nationala pentru cautare rapida de firme de alpinism utilitar in Romania.",
    areaServed: "Romania",
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ label: string; href?: string }>,
) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: item.href ? absoluteUrl(item.href) : undefined,
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    description: company.description,
    url: absoluteUrl(company.path),
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
    url: absoluteUrl(article.path),
    image: article.image ? [absoluteUrl(article.image)] : undefined,
    author: {
      "@type": "Organization",
      name: "AlpinistiUtilitari.ro",
    },
    publisher: {
      "@type": "Organization",
      name: "AlpinistiUtilitari.ro",
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
