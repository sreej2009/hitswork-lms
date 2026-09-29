import { MessageSquareText, PlayCircle, Star, Users } from 'lucide-react';
import { getInstructor, instructorSlug } from '../../data/instructors';
import { formatCompact, formatNumber } from '../../lib/format';
import { AppLink } from '../ui/AppLink';
import { Avatar } from '../ui/Avatar';
import { TextLink } from '../ui/TextLink';

export function InstructorCard({ name }: { name: string }) {
  const instructor = getInstructor(name);
  const href = `/instructors/${instructorSlug(name)}`;
  const stats = [
    { icon: Star, value: instructor.rating.toFixed(1), label: 'Instructor Rating' },
    { icon: Users, value: formatCompact(instructor.students), label: 'Students' },
    { icon: PlayCircle, value: formatNumber(instructor.courses), label: instructor.courses === 1 ? 'Course' : 'Courses' },
    { icon: MessageSquareText, value: formatCompact(instructor.reviews), label: 'Reviews' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-card sm:p-7">
      <div aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="relative flex items-center gap-5">
        <Avatar name={name} size="xl" className="ring-4 ring-brand-50" />
        <div className="min-w-0">
          <AppLink
            href={href}
            className="font-display text-xl font-bold tracking-[-0.01em] text-ink transition-colors hover:text-brand-700"
          >
            {instructor.name}
          </AppLink>
          <p className="mt-1 text-sm text-muted">{instructor.title}</p>
        </div>
      </div>

      <dl className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="rounded-xl bg-canvas px-4 py-3.5 ring-1 ring-line">
            <dt className="flex items-center gap-1.5 text-xs text-muted">
              <Icon aria-hidden className="size-3.5 text-brand-600" strokeWidth={2.2} />
              {label}
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <TextLink href={href} className="relative mt-6">
        View Instructor Profile
      </TextLink>
    </div>
  );
}
