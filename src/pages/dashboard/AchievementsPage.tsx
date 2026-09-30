import { achievements } from '../../data/achievements';
import { useLearning } from '../../context/LearningContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { AchievementBadge } from '../../components/dashboard/Widgets';
import { RevealGroup, RevealItem } from '../../components/ui/Reveal';

export function AchievementsPage() {
  useDocumentTitle('Achievements — Hitswork');
  const { stats } = useLearning();
  const earned = achievements.filter((a) => a.measure(stats) >= a.target).length;

  return (
    <>
      <DashboardHeader
        title="Achievements"
        subtitle={`${earned} of ${achievements.length} earned — milestones from your learning on Hitswork.`}
      />
      <RevealGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement) => (
          <RevealItem key={achievement.id} className="h-full">
            <AchievementBadge achievement={achievement} stats={stats} />
          </RevealItem>
        ))}
      </RevealGroup>
    </>
  );
}
