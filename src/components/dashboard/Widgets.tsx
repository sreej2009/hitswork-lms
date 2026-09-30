import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Flame, Lock, type LucideIcon } from 'lucide-react';
import type { AccentKey } from '../../types';
import type { Achievement, LearnerStats } from '../../data/achievements';
import { lastSevenDaysMinutes, learningStreakDays, weeklyGoal } from '../../data/learning';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { formatDuration } from '../../lib/format';
import { Button } from '../ui/Button';
import { easeOutSoft } from '../ui/Reveal';
import { ProgressBar } from './ProgressBar';

export function DashboardCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-[20px] border border-line bg-white p-5 shadow-card sm:p-6', className)}>{children}</div>;
}

export function StatCard({ icon: Icon, value, label, accent }: { icon: LucideIcon; value: string; label: string; accent: AccentKey }) {
  const style = accents[accent];
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 rounded-[20px] border border-line bg-white p-4 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:p-5"
    >
      <span className={cn('grid size-12 shrink-0 place-items-center rounded-2xl', style.soft, style.text)}>
        <Icon aria-hidden className="size-[22px]" strokeWidth={1.9} />
      </span>
      <div className="min-w-0">
        <p className="font-display text-2xl leading-none font-extrabold tracking-[-0.02em] text-ink">{value}</p>
        <p className="mt-1.5 truncate text-sm text-muted">{label}</p>
      </div>
    </motion.div>
  );
}

/** Weekday labels for the last seven days, ending today. */
function lastSevenDayLabels(today = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  });
}

export function StreakCard() {
  const labels = lastSevenDayLabels();
  const max = Math.max(...lastSevenDaysMinutes);
  return (
    <DashboardCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-sans text-sm font-semibold text-muted">Learning Streak</h2>
          <p className="mt-1.5 flex items-center gap-2 font-display text-[1.75rem] leading-none font-extrabold text-ink">
            {learningStreakDays} Days
            <Flame aria-hidden className="size-6 text-orange-500" fill="currentColor" strokeWidth={1.5} />
          </p>
        </div>
      </div>
      <p className="mt-2.5 text-sm text-body">Keep learning to maintain your streak.</p>
      <ol className="mt-5 grid grid-cols-7 gap-1.5" aria-label="Activity over the last 7 days">
        {labels.map((label, i) => {
          const minutes = lastSevenDaysMinutes[i];
          const isToday = i === 6;
          return (
            <li key={`${label}-${i}`} className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  'grid size-8 place-items-center rounded-full bg-brand-gradient text-white',
                  isToday && 'ring-4 ring-brand-100',
                )}
                style={{ opacity: 0.45 + 0.55 * (minutes / max) }}
                title={`${label}: ${minutes} min`}
              >
                <CheckCircle2 aria-hidden className="size-4" strokeWidth={2.4} />
              </span>
              <span className={cn('text-[11px] font-medium', isToday ? 'text-brand-700' : 'text-muted')}>
                {label}
                <span className="sr-only">: {minutes} minutes</span>
              </span>
            </li>
          );
        })}
      </ol>
    </DashboardCard>
  );
}

export function WeeklyGoalCard({ continueHref }: { continueHref: string }) {
  const { targetMinutes, completedMinutes } = weeklyGoal;
  const remaining = Math.max(0, targetMinutes - completedMinutes);
  return (
    <DashboardCard>
      <h2 className="font-sans text-sm font-semibold text-muted">Weekly Goal</h2>
      <p className="mt-1.5 font-display text-[1.75rem] leading-none font-extrabold text-ink">
        {formatDuration(completedMinutes)}{' '}
        <span className="text-base font-semibold text-muted">/ {formatDuration(targetMinutes)}</span>
      </p>
      <ProgressBar value={(completedMinutes / targetMinutes) * 100} label="Weekly goal progress" className="mt-4" />
      <p className="mt-3 text-sm text-body">
        {remaining > 0 ? `${formatDuration(remaining)} remaining this week` : 'Goal reached — great work!'}
      </p>
      <Button href={continueHref} variant="soft" arrow fullWidth className="mt-5">
        Keep Going
      </Button>
    </DashboardCard>
  );
}

export function AchievementBadge({ achievement, stats }: { achievement: Achievement; stats: LearnerStats }) {
  const value = achievement.measure(stats);
  const earned = value >= achievement.target;
  const style = accents[achievement.accent];
  const Icon = achievement.icon;
  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-[20px] border bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover',
        earned ? 'border-line' : 'border-dashed border-line-strong',
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'grid size-11 place-items-center rounded-2xl',
            earned ? cn(style.gradient, 'text-white shadow-[0_8px_18px_-8px_rgb(15_23_42/0.35)]') : 'bg-canvas text-subtle',
          )}
        >
          <Icon aria-hidden className="size-5" strokeWidth={1.9} />
        </span>
        {earned ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <CheckCircle2 aria-hidden className="size-3.5" strokeWidth={2.4} />
            Earned
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-subtle">
            <Lock aria-hidden className="size-3.5" strokeWidth={2.2} />
            Locked
          </span>
        )}
      </div>
      <p className="mt-4 text-[15px] font-semibold text-ink">{achievement.title}</p>
      <p className="mt-1 text-sm text-muted">{achievement.description}</p>
      <div className="min-h-3 flex-1" />
      {earned ? (
        <p className={cn('text-sm font-semibold', style.text)}>{achievement.earnedLabel(stats)}</p>
      ) : (
        <div>
          <div className="mb-1.5 flex justify-between text-xs text-muted">
            <span>Progress</span>
            <span className="tabular-nums">
              {Math.min(Math.floor(value), achievement.target)} / {achievement.target}
            </span>
          </div>
          <ProgressBar value={(value / achievement.target) * 100} label={`${achievement.title} progress`} size="sm" />
        </div>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOutSoft }}
      className="flex flex-col items-center rounded-[20px] border border-line bg-white px-6 py-14 text-center shadow-card sm:py-16"
    >
      <span className="grid size-16 place-items-center rounded-full bg-linear-to-br from-brand-50 to-grape-100 text-brand-600 ring-8 ring-white">
        <Icon aria-hidden className="size-7" strokeWidth={1.7} />
      </span>
      <h2 className="mt-6 text-xl font-bold tracking-[-0.01em]">{title}</h2>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-body">{text}</p>
      {action && <div className="mt-7">{action}</div>}
    </motion.div>
  );
}
