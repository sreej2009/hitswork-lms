import {
  Award,
  BookOpen,
  Compass,
  Heart,
  LayoutDashboard,
  LayoutGrid,
  Presentation,
  Settings,
  Trophy,
  UserRound,
} from 'lucide-react';
import { useInstructor } from '../../context/InstructorContext';
import { useLearning } from '../../context/LearningContext';
import { useStore } from '../../context/StoreContext';
import { SidebarNav, type ShellSidebarProps, type SidebarGroup } from './SidebarNav';

/** Student area navigation. */
export function DashboardSidebar(props: ShellSidebarProps) {
  const { wishlist } = useStore();
  const { certificates } = useLearning();
  const { isInstructor } = useInstructor();

  const groups: SidebarGroup[] = [
    {
      items: [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, end: true },
        { label: 'My Learning', href: '/my-learning', icon: BookOpen },
        { label: 'Wishlist', href: '/wishlist', icon: Heart, count: wishlist.size },
        { label: 'Certificates', href: '/certificates', icon: Award, count: certificates.length },
        { label: 'Achievements', href: '/achievements', icon: Trophy },
      ],
    },
    {
      label: 'Explore',
      items: [
        { label: 'Courses', href: '/courses', icon: Compass },
        { label: 'Categories', href: '/#categories', icon: LayoutGrid },
        isInstructor
          ? { label: 'Instructor Dashboard', href: '/instructor', icon: Presentation }
          : { label: 'Teach on Hitswork', href: '/teach', icon: Presentation },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'Profile', href: '/profile', icon: UserRound },
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return <SidebarNav label="Dashboard" groups={groups} {...props} />;
}
