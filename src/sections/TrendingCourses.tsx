import { studentsViewing } from '../data/courses';
import { CarouselControls, CourseCarousel, useCarousel } from '../components/course/CourseCarousel';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TextLink } from '../components/ui/TextLink';

export function TrendingCourses() {
  const carousel = useCarousel();
  return (
    <Section labelledBy="trending-title">
      <Reveal>
        <SectionHeader
          id="trending-title"
          title="Students are viewing"
          subtitle="Popular courses trending right now"
          action={
            <>
              <TextLink href="/courses" className="mr-2">
                View All
              </TextLink>
              <CarouselControls carousel={carousel} label="courses" className="max-sm:hidden" />
            </>
          }
        />
      </Reveal>
      <Reveal delay={0.08} className="mt-10">
        <CourseCarousel courses={studentsViewing} carousel={carousel} label="Courses students are viewing" />
      </Reveal>
    </Section>
  );
}
