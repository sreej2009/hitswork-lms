import { BookOpen, Globe, Star, Users } from 'lucide-react';
import type { Instructor } from '../../types/instructor';
import { cn } from '../../lib/cn';
import { LinkedInIcon } from '../icons/SocialIcons';
import { formatCompact } from '../../lib/format';
import { Avatar } from '../ui/Avatar';

/** URL-safe slug used for the public profile, e.g. "Sree Raman" → "sree-raman". */
export const instructorProfileSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'instructor';

const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

interface InstructorProfileCardProps {
  profile: Pick<
    Instructor,
    'name' | 'headline' | 'bio' | 'website' | 'linkedin' | 'specializations' | 'rating' | 'students'
  >;
  courseCount: number;
  className?: string;
}

/** How learners see the instructor: used for the live preview and the public profile page. */
export function InstructorProfileCard({ profile, courseCount, className }: InstructorProfileCardProps) {
  return (
    <article className={cn('overflow-hidden rounded-[20px] border border-line bg-white shadow-card', className)}>
      <div aria-hidden className="h-20 bg-brand-gradient" />
      <div className="px-5 pb-6 sm:px-6">
        <div className="-mt-9 rounded-full bg-white p-1 ring-1 ring-line [width:fit-content]">
          <Avatar name={profile.name || 'Instructor'} size="xl" />
        </div>
        <h3 className="mt-3 text-xl font-bold tracking-[-0.015em]">{profile.name || 'Your name'}</h3>
        <p className="mt-0.5 text-sm text-muted">{profile.headline || 'Your headline'}</p>

        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5">
            <Star aria-hidden className="size-4 text-amber-400" fill="currentColor" strokeWidth={0} />
            <dt className="sr-only">Rating</dt>
            <dd className="font-semibold text-ink">{profile.rating.toFixed(1)} rating</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Users aria-hidden className="size-4 text-brand-500" />
            <dt className="sr-only">Students</dt>
            <dd className="font-semibold text-ink">{formatCompact(profile.students)}+ students</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen aria-hidden className="size-4 text-brand-500" />
            <dt className="sr-only">Courses</dt>
            <dd className="font-semibold text-ink">
              {courseCount} {courseCount === 1 ? 'course' : 'courses'}
            </dd>
          </div>
        </dl>

        {profile.specializations.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Specializations">
            {profile.specializations.map((item) => (
              <li key={item} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                {item}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-[15px] leading-relaxed whitespace-pre-line text-body">
          {profile.bio || 'Tell learners about your experience and teaching style.'}
        </p>

        {(profile.website || profile.linkedin) && (
          <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            {profile.website && (
              <li className="flex min-w-0 items-center gap-2">
                <Globe aria-hidden className="size-4 shrink-0 text-muted" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate font-medium text-brand-600 hover:text-brand-700"
                >
                  {displayUrl(profile.website)}
                </a>
              </li>
            )}
            {profile.linkedin && (
              <li className="flex min-w-0 items-center gap-2">
                <LinkedInIcon className="size-4 shrink-0 text-muted" />
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate font-medium text-brand-600 hover:text-brand-700"
                >
                  {displayUrl(profile.linkedin)}
                </a>
              </li>
            )}
          </ul>
        )}
      </div>
    </article>
  );
}
