import CompanyPage from "@/app/firma/[slug]/page";
import { getCompany } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ companySlug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { companySlug } = await params;
  const company = await getCompany(companySlug);

  if (!company) {
    return buildMetadata({
      title: "Firma indisponibila",
      description: "Profilul firmei cautate nu exista.",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${company.name} - ${company.city.name}, ${company.county.name}`,
    description: company.descriptionShort,
    path: `/firme/${company.slug}`,
  });
}

export default async function CanonicalCompanyPage({ params }: Props) {
  const { companySlug } = await params;
  return CompanyPage({ params: Promise.resolve({ slug: companySlug }) });
}
