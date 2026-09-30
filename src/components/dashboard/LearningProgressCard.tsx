import { Award, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import type { CourseLearning } from '../../context/LearningContext';
import { cn } from '../../lib/cn';
import { formatRelative } from '../../lib/format';
import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';
import { SmartImage } from '../ui/SmartImage';
import { ProgressBar } from './ProgressBar';

interface LearningProgressCardProps {
  item: CourseLearning;
  /**
   * `feature`: large horizontal card (dashboard "Continue Learning").
   * `grid`: vertical card (My Learning).
   * `compact`: small row (dashboard "Recently Learned").
   */
  variant?: 'feature' | 'grid' | 'compact';
}

const learnHref = (item: CourseLearning) => `/learn/${item.course.id}`;

function StatusBadge({ item }: { item: CourseLearning }) {
  if (item.status === 'completed')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
        <CheckCircle2 aria-hidden className="size-3.5" strokeWidth={2.4} />
        Completed
      </span>
    );
  if (item.status === 'not-started')
    return (
      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-muted shadow-xs ring-1 ring-line">
        Not started
      </span>
    );
  return null;
}

function ProgressSummary({ item, size = 'md' }: { item: CourseLearning; size?: 'sm' | 'md' }) {
  const completed = item.status === 'completed';
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className={cn('font-semibold', completed ? 'text-emerald-700' : 'text-ink')}>
          {item.percent}% Complete
        </span>
        <span className="text-xs text-muted">
          {item.completedCount} / {item.totalLessons} lessons
        </span>
      </div>
      <ProgressBar
        value={item.percent}
        label={`${item.course.title} progress`}
        tone={completed ? 'success' : 'brand'}
        size={size}
        className="mt-2"
      />
    </div>
  );
}

function PrimaryAction({ item, fullWidth }: { item: CourseLearning; fullWidth?: boolean }) {
  if (item.status === 'completed' && item.certificate)
    return (
      <Button href={`/certificates/${item.certificate.id}`} variant="soft" icon={Award} fullWidth={fullWidth}>
        View Certificate
      </Button>
    );
  return (
    <Button href={learnHref(item)} arrow fullWidth={fullWidth}>
      {item.status === 'not-started' ? 'Start Learning' : 'Continue Learning'}
    </Button>
  );
}

export function LearningProgressCard({ item, variant = 'grid' }: LearningProgressCardProps) {
  const { course } = item;
  const lastAccessed = item.record.lastAccessedAt ? formatRelative(item.record.lastAccessedAt) : 'Not opened yet';

  if (variant === 'compact') {
    return (
      <AppLink
        href={learnHref(item)}
        className="group flex items-center gap-3.5 rounded-2xl border border-line bg-white p-3 shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        <div className="aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl bg-brand-50">
          <SmartImage photoId={course.image} alt="" width={160} ratio={4 / 3} className="size-full" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-semibold text-ink transition-colors group-hover:text-brand-700">
            {course.title}
          </p>
          <p className="mt-0.5 text-xs text-muted">Last accessed {lastAccessed}</p>
          <div className="mt-2 flex items-center gap-2.5">
            <ProgressBar value={item.percent} label={`${course.title} progress`} size="sm" className="flex-1" />
            <span className="text-xs font-semibold text-ink tabular-nums">{item.percent}%</span>
          </div>
        </div>
      </AppLink>
    );
  }

  if (variant === 'feature') {
    return (
      <article className="group flex flex-col gap-5 rounded-[20px] border border-line bg-white p-4 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:flex-row sm:items-center sm:p-5">
        <AppLink
          href={learnHref(item)}
          tabIndex={-1}
          aria-hidden
          className="relative aspect-video shrink-0 overflow-hidden rounded-2xl bg-brand-50 sm:w-56 lg:w-60"
        >
          <SmartImage
            photoId={course.image}
            alt=""
            width={480}
            ratio={16 / 9}
            widths={[320, 480]}
            sizes="(min-width: 640px) 240px, 100vw"
            className="size-full transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/25">
            <span className="grid size-12 scale-90 place-items-center rounded-full bg-white/95 text-brand-600 opacity-0 shadow-float transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <PlayCircle className="size-6" strokeWidth={2} />
            </span>
          </span>
        </AppLink>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-display text-[17px] leading-snug font-bold">
            <AppLink href={learnHref(item)} className="transition-colors hover:text-brand-700">
              {course.title}
            </AppLink>
          </h3>
          <p className="mt-1 text-sm text-muted">{course.instructor}</p>
          <div className="mt-4">
            <ProgressSummary item={item} />
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 text-sm">
              <p className="text-xs font-medium text-muted">Up next</p>
              <p className="mt-0.5 flex items-center gap-2 font-semibold text-ink">
                <span className="truncate">{item.nextLesson.title}</span>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted">
                  <Clock aria-hidden className="size-3.5" strokeWidth={2} />
                  {item.nextLesson.minutes} min
                </span>
              </p>
            </div>
            <PrimaryAction item={item} />
          </div>
        </div>
      </article>
    );
  }

  // grid
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <AppLink href={learnHref(item)} tabIndex={-1} aria-hidden className="relative aspect-[16/9] overflow-hidden bg-brand-50">
        <SmartImage
          photoId={course.image}
          alt=""
          width={480}
          ratio={16 / 9}
          widths={[360, 480, 720]}
          sizes="(min-width: 1280px) 340px, (min-width: 640px) 50vw, 100vw"
          className="size-full transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 left-3">
          <StatusBadge item={item} />
        </span>
      </AppLink>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[2.75rem] font-display text-base leading-snug font-bold">
          <AppLink href={learnHref(item)} className="transition-colors hover:text-brand-700">
            {course.title}
          </AppLink>
        </h3>
        <p className="mt-1 text-sm text-muted">{course.instructor}</p>
        <div aria-hidden className="min-h-4 flex-1" />
        <ProgressSummary item={item} size="sm" />
        <p className="mt-3 text-xs text-muted">
          {item.status === 'completed' && item.record.completedAt
            ? `Completed ${formatRelative(item.record.completedAt)}`
            : `Last accessed ${lastAccessed}`}
        </p>
        <div className="mt-4">
          <PrimaryAction item={item} fullWidth />
        </div>
      </div>
    </article>
  );
}
