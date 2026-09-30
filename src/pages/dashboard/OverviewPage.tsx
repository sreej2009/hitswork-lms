import { useMemo, useState, type ReactNode } from 'react';
import { Award, BookOpen, CheckCircle2, Clock3, Compass } from 'lucide-react';
import { achievements, featuredAchievementIds } from '../../data/achievements';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { firstName } from '../../lib/auth';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { LearningProgressCard } from '../../components/dashboard/LearningProgressCard';
import { AchievementBadge, EmptyState, StatCard, StreakCard, WeeklyGoalCard } from '../../components/dashboard/Widgets';
import { Button } from '../../components/ui/Button';
import { RevealGroup, RevealItem } from '../../components/ui/Reveal';
import { TextLink } from '../../components/ui/TextLink';

function greeting(hour = new Date().getHours()) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function SectionTitle({ id, title, subtitle, action }: { id: string; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id={id} className="text-xl font-bold tracking-[-0.02em] sm:text-[1.375rem]">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-body">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function OverviewPage() {
  useDocumentTitle('Dashboard — Hitswork');
  const { user } = useAuth();
  const { myCourses, stats } = useLearning();
  // Fixed for the visit, so the greeting doesn't change while the page is open.
  const [hello] = useState(greeting);

  const continueLearning = useMemo(() => {
    const inProgress = myCourses.filter((c) => c.status === 'in-progress');
    const notStarted = myCourses.filter((c) => c.status === 'not-started');
    return [...inProgress, ...notStarted].slice(0, 3);
  }, [myCourses]);
  const recentlyLearned = useMemo(
    () =>
      myCourses
        .filter((c) => c.record.lastAccessedAt && !continueLearning.includes(c))
        .slice(0, 3),
    [myCourses, continueLearning],
  );
  const continueHref = continueLearning[0] ? `/learn/${continueLearning[0].course.id}` : '/courses';
  const featured = achievements.filter((a) => featuredAchievementIds.includes(a.id));

  return (
    <>
      <DashboardHeader title={`${hello}, ${firstName(user?.name ?? 'there')} 👋`} subtitle="Ready to continue learning?" />

      <section aria-label="Learning stats">
        <RevealGroup className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
          <RevealItem>
            <StatCard icon={BookOpen} value={String(stats.inProgressCourses)} label="Courses in Progress" accent="blue" />
          </RevealItem>
          <RevealItem>
            <StatCard icon={CheckCircle2} value={String(stats.completedCourses)} label="Completed Courses" accent="green" />
          </RevealItem>
          <RevealItem>
            <StatCard icon={Clock3} value={`${stats.learningHours}h`} label="Learning Hours" accent="purple" />
          </RevealItem>
          <RevealItem>
            <StatCard icon={Award} value={String(stats.certificates)} label="Certificates" accent="orange" />
          </RevealItem>
        </RevealGroup>
      </section>

      <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-8">
        <div className="min-w-0 space-y-10">
          <section aria-labelledby="continue-title">
            <SectionTitle
              id="continue-title"
              title="Continue Learning"
              subtitle="Pick up where you left off."
              action={myCourses.length > 0 && <TextLink href="/my-learning">View all</TextLink>}
            />
            {continueLearning.length === 0 ? (
              <EmptyState
                icon={Compass}
                title="Start your first course"
                text="Courses you enroll in will appear here, ready to pick up where you left off."
                action={
                  <Button href="/courses" arrow>
                    Explore Courses
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {continueLearning.map((item) => (
                  <LearningProgressCard key={item.course.id} item={item} variant="feature" />
                ))}
              </div>
            )}
          </section>

          {recentlyLearned.length > 0 && (
            <section aria-labelledby="recent-title">
              <SectionTitle id="recent-title" title="Recently Learned" />
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {recentlyLearned.map((item) => (
                  <LearningProgressCard key={item.course.id} item={item} variant="compact" />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside aria-label="Your goals" className="grid content-start gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <StreakCard />
          <WeeklyGoalCard continueHref={continueHref} />
        </aside>
      </div>

      <section aria-labelledby="achievements-title" className="mt-12">
        <SectionTitle
          id="achievements-title"
          title="Your Achievements"
          action={<TextLink href="/achievements">View all</TextLink>}
        />
        <RevealGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((achievement) => (
            <RevealItem key={achievement.id} className="h-full">
              <AchievementBadge achievement={achievement} stats={stats} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
