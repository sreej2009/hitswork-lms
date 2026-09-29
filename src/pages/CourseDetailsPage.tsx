import { useRef, type ReactNode } from 'react';
import { useParams } from 'react-router';
import { motion } from 'framer-motion';
import {
  ChartColumnIncreasing,
  Check,
  ChevronRight,
  Clock,
  Globe,
  Layers,
  PlayCircle,
  RefreshCw,
  SearchX,
  Users,
} from 'lucide-react';
import type { Course, CourseDetail } from '../types';
import { categoryHref } from '../data/categories';
import { useStore } from '../context/StoreContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { categoryIdFor, getCourse, relatedCourses } from '../lib/courseDetail';
import { accents } from '../lib/accents';
import { accentForCategory } from '../data/categories';
import { cn } from '../lib/cn';
import { formatCompact, formatMonth, formatNumber } from '../lib/format';
import { CurriculumAccordion } from '../components/course-detail/CurriculumAccordion';
import { InstructorCard } from '../components/course-detail/InstructorCard';
import { MobilePurchaseBar } from '../components/course-detail/MobilePurchaseBar';
import { PurchaseCard } from '../components/course-detail/PurchaseCard';
import { ReviewsSection } from '../components/course-detail/ReviewsSection';
import { CourseGrid } from '../components/course/CourseGrid';
import { AppLink } from '../components/ui/AppLink';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { RatingStars } from '../components/ui/RatingStars';
import { Reveal, easeOutSoft } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SmartImage } from '../components/ui/SmartImage';
import { TextLink } from '../components/ui/TextLink';

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Breadcrumbs({ course, detail }: { course: Course; detail: CourseDetail | null }) {
  const categoryId = categoryIdFor(course);
  const items: { label: string; href?: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    {
      label: course.category,
      href: categoryId ? categoryHref(categoryId) : `/courses?q=${encodeURIComponent(course.category)}`,
    },
  ];
  if (detail) items.push({ label: detail.subcategory });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight aria-hidden className="size-3.5 text-slate-500" strokeWidth={2.2} />}
            {item.href ? (
              <AppLink href={item.href} className="rounded-sm text-slate-400 transition-colors hover:text-white">
                {item.label}
              </AppLink>
            ) : (
              <span aria-current="page" className="font-medium text-brand-200">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function HeroContent({ course, detail }: { course: Course; detail: CourseDetail | null }) {
  const purchased = useStore().enrolled.has(course.id);
  const accent = accents[accentForCategory(course.category)];
  const tagline =
    detail?.tagline ??
    `${course.hours} hours of on-demand video with ${course.instructor}. Learn at your own pace with lifetime access and a certificate of completion.`;

  const meta = [
    { icon: Clock, label: `${course.hours} hours` },
    ...(detail
      ? [
          { icon: Layers, label: `${detail.totals.sections} sections` },
          { icon: PlayCircle, label: `${detail.totals.lectures} lectures` },
        ]
      : []),
    { icon: ChartColumnIncreasing, label: course.level },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easeOutSoft }}
      className="text-slate-300"
    >
      <Breadcrumbs course={course} detail={detail} />

      {/* Course image on smaller screens; on desktop it lives in the floating purchase card */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 lg:hidden">
        <SmartImage
          photoId={course.image}
          alt={course.imageAlt}
          width={900}
          ratio={16 / 9}
          widths={[480, 720, 960]}
          sizes="(min-width: 1024px) 0px, 100vw"
          priority
          className="aspect-video w-full"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 lg:mt-7">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/15">
          <span aria-hidden className={cn('size-1.5 rounded-full', accent.gradient)} />
          {course.category}
        </span>
        {course.badge && (
          <span className="rounded-full bg-amber-300 px-2.5 py-1 text-[11px] leading-none font-bold text-amber-950">
            {course.badge}
          </span>
        )}
        {purchased && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] leading-none font-bold text-emerald-300 ring-1 ring-emerald-400/30">
            <Check aria-hidden className="size-3" strokeWidth={3} />
            {course.price === 0 ? 'Enrolled' : 'Purchased'}
          </span>
        )}
      </div>

      <h1 className="mt-4 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.03em] text-white sm:text-[2.5rem] lg:text-[2.75rem]">
        {course.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">{tagline}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="flex items-center gap-2">
          <span className="font-bold text-amber-300">{course.rating.toFixed(1)}</span>
          <RatingStars rating={course.rating} size={16} />
          <a href="#reviews" className="text-brand-200 underline-offset-4 hover:underline">
            ({formatNumber(course.reviews)} ratings)
          </a>
        </span>
        <span className="flex items-center gap-1.5">
          <Users aria-hidden className="size-4 text-slate-400" strokeWidth={2} />
          {formatCompact(course.students)} students
        </span>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2">
        {meta.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-1.5 text-sm text-slate-200 ring-1 ring-white/10"
          >
            <Icon aria-hidden className="size-4 text-brand-300" strokeWidth={2} />
            {label}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <p>
          Created by{' '}
          <a href="#instructor" className="font-semibold text-brand-200 underline-offset-4 hover:text-white hover:underline">
            {course.instructor}
          </a>
        </p>
        {detail && (
          <>
            <p className="flex items-center gap-1.5 text-slate-400">
              <RefreshCw aria-hidden className="size-3.5" strokeWidth={2.2} />
              Last updated {formatMonth(detail.lastUpdated)}
            </p>
            <p className="flex items-center gap-1.5 text-slate-400">
              <Globe aria-hidden className="size-3.5" strokeWidth={2.2} />
              {detail.language}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Content sections
// ---------------------------------------------------------------------------

function DetailSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <Reveal>
      <section id={id} aria-labelledby={`${id ?? title}-heading`}>
        <h2
          id={`${id ?? title}-heading`}
          className="text-[1.5rem] leading-tight font-bold tracking-[-0.02em] sm:text-[1.75rem]"
        >
          {title}
        </h2>
        <div className="mt-5">{children}</div>
      </section>
    </Reveal>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-body">
          <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-brand-500" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function CourseNotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center sm:py-32">
      <span className="grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <SearchX aria-hidden className="size-7" strokeWidth={1.9} />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl">We couldn’t find that course</h1>
      <p className="mt-3 max-w-md text-[17px] leading-relaxed text-body">
        It may have been renamed or removed. Browse the catalog to find something similar.
      </p>
      <Button href="/courses" arrow className="mt-8">
        Browse Courses
      </Button>
    </Container>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function CourseDetailsPage() {
  const { id } = useParams();
  const result = getCourse(id);
  useDocumentTitle(result ? `${result.course.title} — Hitswork` : 'Course not found — Hitswork');
  const inlineCardRef = useRef<HTMLDivElement>(null);

  if (!result) return <CourseNotFound />;
  const { course, detail } = result;
  const related = relatedCourses(course);

  return (
    <>
      <Container>
        {/*
          Row 1 is the dark hero, row 2 the main content. The purchase card spans both rows in the
          right column, so it floats over the hero and then stays pinned while the content scrolls.
        */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_368px] lg:gap-x-10 xl:grid-cols-[minmax(0,1fr)_384px] xl:gap-x-14">
          {/* Full-bleed hero background */}
          <div
            aria-hidden
            className="col-span-full row-start-1 mx-[calc(50%-50vw)] bg-night bg-[radial-gradient(55%_90%_at_85%_0%,rgb(124_58_237/0.38),transparent_70%),radial-gradient(45%_70%_at_0%_100%,rgb(79_70_229/0.28),transparent_70%)]"
          />
          <div className="col-start-1 row-start-1 py-8 sm:py-10 lg:py-14">
            <HeroContent course={course} detail={detail} />
          </div>

          <aside aria-label="Purchase options" className="relative col-start-2 row-span-2 row-start-1 hidden pt-10 pb-16 lg:block">
            <div className="sticky top-24">
              <PurchaseCard course={course} variant="sidebar" />
            </div>
          </aside>

          <div className="col-start-1 row-start-2 min-w-0 space-y-14 pt-8 pb-16 sm:pt-10 lg:pt-12 lg:pb-20">
            <div className="lg:hidden">
              <PurchaseCard ref={inlineCardRef} course={course} variant="inline" />
            </div>

            {detail && (
              <>
                <DetailSection id="learn" title="What you'll learn">
                  <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7">
                    <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                      {detail.learn.map((item) => (
                        <li key={item} className="flex gap-3 text-[15px] leading-snug text-body">
                          <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                            <Check aria-hidden className="size-3.5" strokeWidth={3} />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </DetailSection>

                <DetailSection id="curriculum" title="Course Content">
                  <CurriculumAccordion sections={detail.curriculum} totals={detail.totals} totalHours={course.hours} />
                </DetailSection>

                <DetailSection id="requirements" title="Requirements">
                  <BulletList items={detail.requirements} />
                </DetailSection>

                <DetailSection id="description" title="Course Description">
                  <div className="space-y-4 text-[15.5px] leading-[1.75] text-body">
                    {detail.description.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </div>
                </DetailSection>

                <DetailSection id="audience" title="Who this course is for">
                  <div className="rounded-2xl border border-brand-100 bg-linear-to-br from-brand-50/80 via-white to-grape-50/80 p-6 sm:p-7">
                    <p className="text-sm font-semibold text-ink">This course is for:</p>
                    <div className="mt-4">
                      <BulletList items={detail.audience} />
                    </div>
                  </div>
                </DetailSection>
              </>
            )}

            <DetailSection id="instructor" title="Instructor">
              <InstructorCard name={course.instructor} />
            </DetailSection>

            <DetailSection id="reviews" title="Student Reviews">
              <ReviewsSection course={course} reviews={detail?.reviews ?? []} />
            </DetailSection>
          </div>
        </div>
      </Container>

      <section aria-labelledby="related-title" className="border-t border-line bg-canvas py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeader
              id="related-title"
              title="Students Also Bought"
              action={
                <TextLink href={categoryIdFor(course) ? categoryHref(categoryIdFor(course)!) : '/courses'}>
                  View All
                </TextLink>
              }
            />
          </Reveal>
          <Reveal delay={0.05} className="mt-8">
            <CourseGrid courses={related} />
          </Reveal>
        </Container>
      </section>

      <MobilePurchaseBar course={course} cardRef={inlineCardRef} />
    </>
  );
}
