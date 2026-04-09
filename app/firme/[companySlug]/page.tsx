import CompanyPage from "@/app/firma/[slug]/page";
import { buildCompanyProfileCommercialContent } from "@/lib/content/company-profile-commercial";
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

  const profileContent = buildCompanyProfileCommercialContent(company);

  return buildMetadata({
    title: profileContent.metaTitle,
    description: profileContent.metaDescription,
    path: `/firme/${company.slug}`,
    noIndex: !profileContent.shouldIndex,
  });
}

export default async function CanonicalCompanyPage({ params }: Props) {
  const { companySlug } = await params;
  return CompanyPage({ params: Promise.resolve({ slug: companySlug }) });
}
