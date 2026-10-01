import {
  Accessibility,
  Award,
  Compass,
  Hammer,
  Heart,
  ListChecks,
  PlayCircle,
  RefreshCcw,
  Search,
  Target,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import type { Feature, Stat } from '../types';

export const missionPillars: Feature[] = [
  {
    title: 'Accessible Learning',
    description:
      'Affordable courses you can take on any device, at your own pace — so where you live or how busy you are never decides what you can learn.',
    icon: Accessibility,
    accent: 'indigo',
  },
  {
    title: 'Practical Skills',
    description:
      'Courses built around projects and real-world tasks, taught by people who do the work every day, so what you learn carries straight into your job.',
    icon: Wrench,
    accent: 'cyan',
  },
  {
    title: 'Continuous Growth',
    description:
      'Progress tracking, certificates and learning paths that help you keep building, one skill after another, throughout your career.',
    icon: TrendingUp,
    accent: 'purple',
  },
];

export const storyParagraphs = [
  'Careers no longer follow a straight line. Tools change, roles evolve and whole industries reshape themselves in a few years. Staying relevant means learning continuously — not once at the start of a career, but all the way through it.',
  'Yet much of what’s available is either too theoretical to use on Monday morning or too rigid to fit around a working life. People need practical skills they can apply right away, taught by practitioners, in a format that bends to their schedule rather than the other way round.',
  'Hitswork exists to close that gap. We use technology to make quality learning flexible and accessible, and we bring learners, instructors and organizations together on one platform — so experts can share what they know, people can build the skills they need, and teams can grow together.',
];

export const values: Feature[] = [
  {
    title: 'Learn With Purpose',
    description: 'Every course should help learners move toward a meaningful goal.',
    icon: Target,
    accent: 'indigo',
  },
  {
    title: 'Build Practical Skills',
    description: 'Focus on knowledge that can be applied in the real world.',
    icon: Hammer,
    accent: 'cyan',
  },
  {
    title: 'Keep Improving',
    description: 'Learning never stops.',
    icon: RefreshCcw,
    accent: 'green',
  },
  {
    title: 'Put Learners First',
    description: 'Create experiences around learner needs.',
    icon: Heart,
    accent: 'pink',
  },
];

export const platformHighlights: Stat[] = [
  { value: '10K+', label: 'Courses' },
  { value: '50K+', label: 'Learners' },
  { value: '2K+', label: 'Instructors' },
  { value: '120+', label: 'Countries' },
];

export const learnerJourney = [
  {
    title: 'Discover',
    description: 'Explore thousands of courses across development, design, business and more.',
    icon: Search,
  },
  { title: 'Choose', description: 'Compare curricula, reviews and instructors to find the right fit.', icon: Compass },
  { title: 'Learn', description: 'Watch bite-sized lessons at your own pace, on any device.', icon: PlayCircle },
  { title: 'Practice', description: 'Apply what you learn through projects, quizzes and exercises.', icon: ListChecks },
  { title: 'Achieve', description: 'Earn a certificate and take your new skills into your career.', icon: Award },
];
