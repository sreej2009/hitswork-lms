import { NavLink } from 'react-router';
import {
  Award,
  BookOpen,
  Compass,
  Heart,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Presentation,
  Settings,
  Trophy,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { useStore } from '../../context/StoreContext';
import { cn } from '../../lib/cn';
import { useSignOut } from '../layout/UserMenu';
import { Logo } from '../ui/Logo';

interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Match only the exact path */
  end?: boolean;
  count?: number;
}

interface DashboardSidebarProps {
  /** Icon-only rail */
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  /** Called after navigating (closes the mobile drawer) */
  onNavigate?: () => void;
}

export function DashboardSidebar({ collapsed, onToggleCollapsed, onNavigate }: DashboardSidebarProps) {
  const { wishlist } = useStore();
  const { certificates } = useLearning();
  const signOut = useSignOut();

  const groups: { label?: string; items: SidebarItem[] }[] = [
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
        { label: 'Teach on Hitswork', href: '/teach', icon: Presentation },
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

  const itemBase = cn(
    'group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-colors duration-200',
    collapsed ? 'size-11 justify-center' : 'px-3 py-2.5',
  );
  const itemClass = (active: boolean) =>
    cn(itemBase, active ? 'bg-brand-50 text-brand-700' : 'text-body hover:bg-canvas hover:text-ink');

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-[72px] shrink-0 items-center', collapsed ? 'justify-center' : 'justify-between pr-2 pl-5')}>
        <Logo markOnly={collapsed} className={collapsed ? 'ml-2' : undefined} />
      </div>

      <nav aria-label="Dashboard" className={cn('min-h-0 flex-1 overflow-y-auto pb-4', collapsed ? 'px-3.5' : 'px-3')}>
        {groups.map((group, index) => (
          <div key={group.label ?? 'main'} className={cn(index > 0 && 'mt-5 border-t border-line pt-5')}>
            {group.label &&
              (collapsed ? (
                <span className="sr-only">{group.label}</span>
              ) : (
                <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.12em] text-subtle uppercase">{group.label}</p>
              ))}
            <ul className="space-y-1">
              {group.items.map(({ label, href, icon: Icon, end, count }) => (
                <li key={label}>
                  <NavLink
                    to={href}
                    end={end}
                    onClick={onNavigate}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) => itemClass(isActive && !href.includes('#'))}
                  >
                    <Icon aria-hidden className="size-[19px] shrink-0" strokeWidth={1.9} />
                    {collapsed ? <span className="sr-only">{label}</span> : <span className="flex-1 truncate">{label}</span>}
                    {!collapsed && !!count && (
                      <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-muted ring-1 ring-line">
                        {count}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={cn('shrink-0 border-t border-line py-3', collapsed ? 'px-3.5' : 'px-3')}>
        {onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : undefined}
            className={cn(itemClass(false), 'mb-1 w-full')}
          >
            {collapsed ? (
              <PanelLeftOpen aria-hidden className="size-[19px]" strokeWidth={1.9} />
            ) : (
              <>
                <PanelLeftClose aria-hidden className="size-[19px]" strokeWidth={1.9} />
                Collapse
              </>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            signOut();
          }}
          title={collapsed ? 'Sign Out' : undefined}
          className={cn(itemBase, 'w-full text-body hover:bg-rose-50 hover:text-rose-600')}
        >
          <LogOut aria-hidden className="size-[19px] shrink-0" strokeWidth={1.9} />
          {collapsed ? <span className="sr-only">Sign Out</span> : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}
