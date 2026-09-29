import { useMemo, useState } from 'react';
import { BookOpen, Clock, Heart, PlayCircle, ShoppingCart, type LucideIcon } from 'lucide-react';
import { courses } from '../data/courses';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { firstName } from '../lib/auth';
import { CourseGrid } from '../components/course/CourseGrid';
import { AppLink } from '../components/ui/AppLink';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SmartImage } from '../components/ui/SmartImage';
import { TextLink } from '../components/ui/TextLink';

function StatCard({ icon: Icon, label, value, href }: { icon: LucideIcon; label: string; value: string; href: string }) {
  return (
    <AppLink
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-gradient group-hover:text-white">
        <Icon aria-hidden className="size-[22px]" strokeWidth={1.9} />
      </span>
      <span>
        <span className="block font-display text-2xl leading-none font-extrabold text-ink">{value}</span>
        <span className="mt-1.5 block text-sm text-muted">{label}</span>
      </span>
    </AppLink>
  );
}

export function DashboardPage() {
  useDocumentTitle('Dashboard — Hitswork');
  const { user } = useAuth();
  const { enrolled, cart, wishlist } = useStore();
  // Accounts created in the last 10 minutes get a first-visit greeting.
  const [isNewAccount] = useState(() => !!user && Date.now() - Date.parse(user.joinedAt) < 10 * 60_000);

  const myCourses = useMemo(() => courses.filter((course) => enrolled.has(course.id)), [enrolled]);
  const hours = myCourses.reduce((sum, course) => sum + course.hours, 0);
  const recommended = useMemo(
    () =>
      courses
        .filter((course) => !enrolled.has(course.id))
        .sort((a, b) => b.students - a.students)
        .slice(0, 4),
    [enrolled],
  );

  return (
    <>
      <PageHeader
        title={`${isNewAccount ? 'Welcome to Hitswork' : 'Welcome back'}, ${firstName(user?.name ?? 'learner')}`}
        subtitle="Here’s what’s happening with your learning."
      />
      <Container className="space-y-14 py-10 lg:py-12">
        <section aria-label="Your stats" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={BookOpen} label="Courses enrolled" value={String(myCourses.length)} href="/my-learning" />
          <StatCard icon={Clock} label="Hours of content" value={`${hours}h`} href="/my-learning" />
          <StatCard icon={ShoppingCart} label="In your cart" value={String(cart.size)} href="/cart" />
          <StatCard icon={Heart} label="On your wishlist" value={String(wishlist.size)} href="/cart" />
        </section>

        <section aria-labelledby="continue-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="continue-title" className="text-2xl font-bold tracking-[-0.02em]">
              Continue learning
            </h2>
            {myCourses.length > 0 && <TextLink href="/my-learning">View all</TextLink>}
          </div>
          {myCourses.length === 0 ? (
            <div className="mt-5 flex flex-col items-start gap-4 rounded-2xl border border-dashed border-line-strong bg-canvas p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink">You haven’t started a course yet</p>
                <p className="mt-1 text-sm text-body">Browse the catalog and pick something to learn today.</p>
              </div>
              <Button href="/courses" arrow>
                Explore Courses
              </Button>
            </div>
          ) : (
            <ul className="mt-5 grid gap-4 lg:grid-cols-2">
              {myCourses.slice(0, 4).map((course) => (
                <li key={course.id} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card">
                  <div className="aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                    <SmartImage photoId={course.image} alt="" width={224} ratio={16 / 10} className="size-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm leading-snug font-semibold text-ink">{course.title}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-brand-50" />
                      <span className="text-xs text-muted">0%</span>
                    </div>
                  </div>
                  <Button href={`/learn/${course.id}`} size="sm" variant="soft" icon={PlayCircle} aria-label={`Start ${course.title}`}>
                    Start
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="recommended-title">
          <Reveal>
            <SectionHeader
              id="recommended-title"
              title="Recommended for you"
              subtitle="Popular courses you haven’t taken yet"
              action={<TextLink href="/courses">Browse all</TextLink>}
            />
          </Reveal>
          <div className="mt-8">
            <CourseGrid courses={recommended} />
          </div>
        </section>
      </Container>
    </>
  );
}
