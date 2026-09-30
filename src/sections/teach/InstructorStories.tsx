import { BookOpen, Quote, Star, Users } from 'lucide-react';
import { featuredInstructors, type FeaturedInstructor } from '../../data/teach';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { Reveal, RevealGroup, RevealItem } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SmartImage } from '../../components/ui/SmartImage';
import { TextLink } from '../../components/ui/TextLink';

function InstructorStoryCard({ instructor }: { instructor: FeaturedInstructor }) {
  const accent = accents[instructor.accent];
  const stats = [
    { icon: BookOpen, value: String(instructor.courses), label: 'Courses' },
    { icon: Users, value: instructor.students, label: 'Students' },
    { icon: Star, value: instructor.rating.toFixed(1), label: 'Rating' },
  ];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[5/4] overflow-hidden bg-brand-50">
        <SmartImage
          photoId={instructor.photoId}
          alt={`${instructor.name}, ${instructor.specialization}`}
          width={440}
          ratio={5 / 4}
          widths={[360, 440, 660, 880]}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          crop="faces"
          className="size-full transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
        />
        <span
          className={cn(
            'absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold shadow-xs backdrop-blur',
            accent.text,
          )}
        >
          {instructor.specialization}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold tracking-[-0.015em]">{instructor.name}</h3>
        <p className="mt-0.5 text-sm text-muted">{instructor.specialization}</p>

        <blockquote className="relative mt-4 flex-1 text-[15px] leading-relaxed text-body">
          <Quote aria-hidden className="mb-2 size-5 text-brand-200" fill="currentColor" strokeWidth={0} />
          {instructor.quote}
        </blockquote>

        <dl className="mt-6 grid grid-cols-3 divide-x divide-line rounded-2xl bg-canvas py-3 ring-1 ring-line">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col-reverse items-center gap-0.5 text-center">
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="flex items-center gap-1 font-display text-base font-extrabold text-ink">
                <Icon
                  aria-hidden
                  className={cn('size-3.5', label === 'Rating' ? 'text-amber-400' : 'text-brand-500')}
                  fill={label === 'Rating' ? 'currentColor' : 'none'}
                  strokeWidth={label === 'Rating' ? 0 : 2.2}
                />
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export function InstructorStories() {
  return (
    <Section id="instructors" labelledBy="instructors-title">
      <Reveal>
        <SectionHeader
          id="instructors-title"
          eyebrow="Success Stories"
          title="Meet Our Instructors"
          subtitle="Practitioners who turned their experience into courses learners love."
          action={<TextLink href="/teach/stories">View Instructor Stories</TextLink>}
        />
      </Reveal>
      <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredInstructors.map((instructor, index) => (
          <RevealItem
            key={instructor.name}
            className={cn('h-full', index === 2 && 'sm:max-lg:col-span-2 sm:max-lg:mx-auto sm:max-lg:w-1/2')}
          >
            <InstructorStoryCard instructor={instructor} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
