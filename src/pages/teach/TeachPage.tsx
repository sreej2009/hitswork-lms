import { usePageMeta } from '../../hooks/usePageMeta';
import { CourseCreatorPreview } from '../../sections/teach/CourseCreatorPreview';
import { EarningsSection } from '../../sections/teach/EarningsSection';
import { InstructorStories } from '../../sections/teach/InstructorStories';
import { InstructorToolkit } from '../../sections/teach/InstructorToolkit';
import { TeachCTA, TeachFaq } from '../../sections/teach/TeachClosing';
import { TeachHero } from '../../sections/teach/TeachHero';
import { HowItWorks, TeachBenefits, TeachStats, WhyTeach } from '../../sections/teach/TeachOverview';

export function TeachPage() {
  usePageMeta(
    'Teach on Hitswork — Share Your Knowledge With the World',
    'Become a Hitswork instructor, create engaging online courses, reach learners worldwide, and grow your teaching business.',
  );

  return (
    <>
      <TeachHero />
      <TeachStats />
      <WhyTeach />
      <HowItWorks />
      <InstructorToolkit />
      <EarningsSection />
      <InstructorStories />
      <CourseCreatorPreview />
      <TeachBenefits />
      <TeachFaq />
      <TeachCTA />
    </>
  );
}
