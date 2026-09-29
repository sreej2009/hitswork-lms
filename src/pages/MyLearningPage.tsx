import { useMemo } from 'react';
import { BookOpen, CalendarCheck, PlayCircle } from 'lucide-react';
import type { Course } from '../types';
import { courses } from '../data/courses';
import { useStore } from '../context/StoreContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDate } from '../lib/format';
import { AppLink } from '../components/ui/AppLink';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { PageHeader } from '../components/ui/PageHeader';
import { RevealGroup, RevealItem } from '../components/ui/Reveal';
import { SmartImage } from '../components/ui/SmartImage';

function LearningCard({ course, purchasedAt }: { course: Course; purchasedAt?: string }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <AppLink href={`/course/${course.id}`} tabIndex={-1} aria-hidden className="relative aspect-[16/10] overflow-hidden bg-brand-50">
        <SmartImage
          photoId={course.image}
          alt=""
          width={480}
          ratio={16 / 10}
          widths={[360, 480, 720]}
          sizes="(min-width: 1200px) 300px, (min-width: 640px) 50vw, 100vw"
          className="size-full transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-xs ring-1 ring-emerald-100">
          {course.price === 0 ? 'Enrolled' : 'Purchased'}
        </span>
      </AppLink>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 min-h-[2.75rem] font-display text-base leading-snug font-bold">
          <AppLink href={`/course/${course.id}`} className="transition-colors hover:text-brand-700">
            {course.title}
          </AppLink>
        </h2>
        <p className="mt-1.5 text-sm text-muted">{course.instructor}</p>
        {purchasedAt && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <CalendarCheck aria-hidden className="size-3.5" strokeWidth={2} />
            Purchased {formatDate(purchasedAt.slice(0, 10))}
          </p>
        )}

        <div aria-hidden className="min-h-4 flex-1" />
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-ink">Not started</span>
            <span className="text-muted">0% complete</span>
          </div>
          <div
            role="progressbar"
            aria-label={`${course.title} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            className="mt-2 h-1.5 rounded-full bg-brand-50"
          />
        </div>
        <Button href={`/learn/${course.id}`} icon={PlayCircle} fullWidth className="mt-5">
          Start Course
        </Button>
      </div>
    </article>
  );
}

export function MyLearningPage() {
  useDocumentTitle('My Learning — Hitswork');
  const { enrolled, orders } = useStore();

  // Most recent purchase date per course.
  const purchasedAt = useMemo(() => {
    const map = new Map<string, string>();
    for (const order of [...orders].reverse()) for (const id of order.courseIds) map.set(id, order.placedAt);
    return map;
  }, [orders]);

  const myCourses = useMemo(
    () =>
      courses
        .filter((course) => enrolled.has(course.id))
        .sort((a, b) => (purchasedAt.get(b.id) ?? '').localeCompare(purchasedAt.get(a.id) ?? '')),
    [enrolled, purchasedAt],
  );

  return (
    <>
      <PageHeader
        title="My Learning"
        subtitle="Pick up where you left off, or start something new."
        meta={
          myCourses.length > 0 && (
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-ink shadow-xs ring-1 ring-line">
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
              {myCourses.length} {myCourses.length === 1 ? 'course' : 'courses'}
            </p>
          )
        }
      />
      <Container className="py-10 lg:py-12">
        {myCourses.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border border-line bg-white px-6 py-16 text-center shadow-card sm:py-20">
            <span className="grid size-20 place-items-center rounded-full bg-linear-to-br from-brand-50 to-grape-100 text-brand-600 ring-8 ring-white">
              <BookOpen aria-hidden className="size-9" strokeWidth={1.6} />
            </span>
            <h2 className="mt-7 text-2xl font-extrabold tracking-[-0.02em]">No courses yet</h2>
            <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-body">
              Courses you purchase or enroll in will appear here.
            </p>
            <Button href="/courses" size="lg" arrow className="mt-8">
              Explore Courses
            </Button>
          </div>
        ) : (
          <RevealGroup className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {myCourses.map((course) => (
              <RevealItem key={course.id} className="h-full">
                <LearningCard course={course} purchasedAt={purchasedAt.get(course.id)} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Container>
    </>
  );
}
