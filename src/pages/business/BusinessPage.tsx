import { usePageMeta } from '../../hooks/usePageMeta';
import { BusinessAnalytics } from '../../sections/business/BusinessAnalytics';
import { BusinessCTA, BusinessFaq } from '../../sections/business/BusinessClosing';
import { DashboardPreview, TeamManagement } from '../../sections/business/BusinessDashboard';
import { BusinessHero } from '../../sections/business/BusinessHero';
import {
  AdminFeatures,
  BusinessBenefits,
  BusinessSolutions,
  BusinessTestimonials,
  LearningPaths,
  TrustedBy,
} from '../../sections/business/BusinessOverview';

export function BusinessPage() {
  usePageMeta(
    'Hitswork for Business — Build a Smarter Workforce',
    'Help your teams build new skills with Hitswork for Business. Manage courses, learning paths, employee progress and training from one platform.',
  );

  return (
    <>
      <BusinessHero />
      <TrustedBy />
      <BusinessBenefits />
      <DashboardPreview />
      <LearningPaths />
      <TeamManagement />
      <BusinessAnalytics />
      <AdminFeatures />
      <BusinessSolutions />
      <BusinessTestimonials />
      <BusinessFaq />
      <BusinessCTA />
    </>
  );
}
