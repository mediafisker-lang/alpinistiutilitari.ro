import { BenefitsSection } from "@/components/benefits-section";
import { CommunitySection } from "@/components/community-section";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { IssueForm } from "@/components/issue-form";
import { JoinForm } from "@/components/join-form";
import { ProgressSection } from "@/components/progress-section";
import { SectionHeading } from "@/components/section-heading";
import { UpdatesSection } from "@/components/updates-section";
import { VoteazaSchimbarileSection } from "@/components/voteaza-schimbarile-section";
import { getCommunityLinks, getPublicProgress, getPublicUpdates } from "@/lib/data";

export default async function HomePage() {
  const [progress, links, updates] = await Promise.all([
    getPublicProgress(),
    getCommunityLinks(),
    getPublicUpdates(),
  ]);

  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <SectionHeading
            eyebrow="Acțiune"
            title="Alege rapid ce vrei să faci"
            description="Te înscrii dacă vrei să fii ținut la curent. Trimiți o sesizare dacă vrei să semnalezi o problemă concretă."
          />
          <div className="mt-8 space-y-5">
            <JoinForm />
            <IssueForm />
          </div>
        </div>
      </section>
      <ProgressSection items={progress} />
      <HowItWorksSection />
      <VoteazaSchimbarileSection />
      <CommunitySection links={links} />
      <UpdatesSection updates={updates} />
    </>
  );
}
