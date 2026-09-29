import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Star, TrendingUp } from 'lucide-react';
import { courseFilters, featuredCollections, pickCourses, type CourseFilterId } from '../data/courses';
import { CourseGrid } from '../components/course/CourseGrid';
import { FilterPills, type FilterOption } from '../components/course/FilterPills';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TextLink } from '../components/ui/TextLink';

const filterIcons = { popular: Flame, new: Sparkles, rated: Star, trending: TrendingUp };

const filterOptions: FilterOption<CourseFilterId>[] = courseFilters.map((filter) => ({
  ...filter,
  icon: filterIcons[filter.id],
}));

const PANEL_ID = 'featured-courses';

export function FeaturedCourses() {
  const [filter, setFilter] = useState<CourseFilterId>('popular');
  const courses = useMemo(() => pickCourses(featuredCollections[filter]), [filter]);

  return (
    <Section id="courses" labelledBy="featured-title" className="pt-16 sm:pt-20 lg:pt-24">
      <Reveal>
        <SectionHeader
          id="featured-title"
          title="Featured Courses"
          subtitle="Explore our most popular and highly-rated courses"
          action={
            <TextLink href="/courses" className="max-sm:hidden">
              View All
            </TextLink>
          }
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-7 sm:mt-8">
        <FilterPills
          options={filterOptions}
          value={filter}
          onChange={setFilter}
          controls={PANEL_ID}
          label="Filter featured courses"
        />
      </Reveal>

      <Reveal delay={0.1} className="mt-8">
        <div id={PANEL_ID} role="tabpanel" aria-labelledby={`${PANEL_ID}-tab-${filter}`}>
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <CourseGrid courses={courses} mobileLimit={4} />
          </motion.div>
        </div>
      </Reveal>

      <Button variant="secondary" size="lg" arrow fullWidth href="/courses" className="mt-8 sm:hidden">
        View All Courses
      </Button>
    </Section>
  );
}
