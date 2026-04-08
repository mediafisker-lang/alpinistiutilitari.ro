import { serviceArticleSeeds } from "@/lib/content/service-articles";

type Props = {
  params: Promise<{ slug: string }>;
};

function prettyFromSlug(slug: string) {
  return slug
    .replace(/^ghid-/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function pickAccent(slug: string) {
  const accents = [
    { primary: "#0f172a", secondary: "#0284c7", soft: "#bae6fd" },
    { primary: "#082f49", secondary: "#0369a1", soft: "#cbd5e1" },
    { primary: "#172554", secondary: "#2563eb", soft: "#bfdbfe" },
    { primary: "#083344", secondary: "#0891b2", soft: "#a5f3fc" },
  ];

  const index =
    slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % accents.length;
  return accents[index];
}

export async function GET(_: Request, { params }: Props) {
  const { slug } = await params;
  const article = serviceArticleSeeds.find((item) => item.slug === slug);
  const title = article?.title ?? prettyFromSlug(slug);
  const subtitle = article?.seoDescription ?? "Ghid practic pentru servicii de alpinism utilitar";
  const accent = pickAccent(slug);

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" rx="40" fill="${accent.primary}"/>
      <circle cx="910" cy="140" r="180" fill="${accent.secondary}" opacity="0.16"/>
      <circle cx="1030" cy="520" r="220" fill="${accent.soft}" opacity="0.12"/>
      <rect x="64" y="64" width="280" height="52" rx="26" fill="white" fill-opacity="0.08"/>
      <text x="96" y="97" fill="#7DD3FC" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="4">ALPINISTIUTILITARI.RO</text>
      <text x="64" y="220" fill="white" font-size="62" font-family="Arial, Helvetica, sans-serif" font-weight="800">${title
        .slice(0, 52)
        .replace(/&/g, "&amp;")}</text>
      <text x="64" y="290" fill="#CBD5E1" font-size="28" font-family="Arial, Helvetica, sans-serif">${subtitle
        .slice(0, 86)
        .replace(/&/g, "&amp;")}</text>
      <rect x="64" y="458" width="360" height="92" rx="28" fill="white" fill-opacity="0.07"/>
      <text x="96" y="500" fill="white" font-size="26" font-family="Arial, Helvetica, sans-serif" font-weight="700">Ghid orientat pe servicii</text>
      <text x="96" y="535" fill="#BAE6FD" font-size="22" font-family="Arial, Helvetica, sans-serif">SEO local • cerere ofertă • firme reale</text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

