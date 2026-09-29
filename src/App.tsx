import { MotionConfig } from 'framer-motion';
import { StoreProvider } from './context/StoreContext';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { Toast } from './components/ui/Toast';
import { CategoryStrip } from './sections/CategoryStrip';
import { CTASection } from './sections/CTASection';
import { FeaturedCourses } from './sections/FeaturedCourses';
import { Hero } from './sections/Hero';
import { TopCategories } from './sections/TopCategories';
import { TrendingCourses } from './sections/TrendingCourses';
import { UpgradeBanner } from './sections/UpgradeBanner';
import { WhyChoose } from './sections/WhyChoose';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <CategoryStrip />
          <FeaturedCourses />
          <UpgradeBanner />
          <TopCategories />
          <WhyChoose />
          <TrendingCourses />
          <CTASection />
        </main>
        <Footer />
        <Toast />
      </StoreProvider>
    </MotionConfig>
  );
}
