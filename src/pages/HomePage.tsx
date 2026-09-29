import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { CategoryStrip } from '../sections/CategoryStrip';
import { CTASection } from '../sections/CTASection';
import { FeaturedCourses } from '../sections/FeaturedCourses';
import { Hero } from '../sections/Hero';
import { TopCategories } from '../sections/TopCategories';
import { TrendingCourses } from '../sections/TrendingCourses';
import { UpgradeBanner } from '../sections/UpgradeBanner';
import { WhyChoose } from '../sections/WhyChoose';

export function HomePage() {
  useDocumentTitle('Hitswork — Online Learning Platform');
  return (
    <>
      <Hero />
      <CategoryStrip />
      <FeaturedCourses />
      <UpgradeBanner />
      <TopCategories />
      <WhyChoose />
      <TrendingCourses />
      <CTASection />
    </>
  );
}
