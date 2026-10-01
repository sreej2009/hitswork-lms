import { usePageMeta } from '../../hooks/usePageMeta';
import { GradientCTA } from '../../components/ui/GradientCTA';
import { AboutHero } from '../../sections/about/AboutHero';
import {
  Ecosystem,
  LearnerJourney,
  OurMission,
  OurStory,
  OurValues,
  PlatformHighlights,
} from '../../sections/about/AboutSections';

export function AboutPage() {
  usePageMeta(
    'About Hitswork — Learn, Build & Grow',
    'Hitswork is a modern learning platform that helps people build practical skills, discover new opportunities and keep growing throughout their careers.',
  );
  return (
    <>
      <AboutHero />
      <OurMission />
      <OurStory />
      <OurValues />
      <PlatformHighlights />
      <LearnerJourney />
      <Ecosystem />
      <GradientCTA
        id="about-cta-title"
        title="Keep Learning. Keep Building."
        text="Your next skill could open your next opportunity."
        primary={{ label: 'Explore Courses', href: '/courses' }}
      />
    </>
  );
}
