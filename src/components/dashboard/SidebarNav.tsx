import { NavLink } from 'react-router';
import { LogOut, PanelLeftClose, PanelLeftOpen, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useSignOut } from '../layout/UserMenu';
import { Logo } from '../ui/Logo';

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Match only the exact path */
  end?: boolean;
  count?: number;
  /** Call-to-action styling, e.g. "Create New Course" */
  highlight?: boolean;
}

export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

/** Props every sidebar receives from the dashboard shell. */
export interface ShellSidebarProps {
  /** Icon-only rail */
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  /** Called after navigating (closes the mobile drawer) */
  onNavigate?: () => void;
}

interface SidebarNavProps extends ShellSidebarProps {
  /** Accessible name of the navigation landmark */
  label: string;
  groups: SidebarGroup[];
  /** Links pinned above Sign Out, e.g. "Back to Learning" */
  footerItems?: SidebarItem[];
}

/** Sidebar used by the student and instructor areas: logo, grouped links, collapse toggle and sign out. */
export function SidebarNav({
  label,
  groups,
  footerItems = [],
  collapsed,
  onToggleCollapsed,
  onNavigate,
}: SidebarNavProps) {
  const signOut = useSignOut();

  const itemBase = cn(
    'group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-colors duration-200',
    collapsed ? 'size-11 justify-center' : 'px-3 py-2.5',
  );
  const itemClass = (active: boolean, highlight = false) =>
    cn(
      itemBase,
      active
        ? 'bg-brand-50 text-brand-700'
        : highlight
          ? 'text-brand-700 ring-1 ring-brand-100 ring-inset hover:bg-brand-50'
          : 'text-body hover:bg-canvas hover:text-ink',
    );

  const renderItem = ({ label: itemLabel, href, icon: Icon, end, count, highlight }: SidebarItem) => (
    <li key={itemLabel}>
      <NavLink
        to={href}
        end={end}
        onClick={onNavigate}
        title={collapsed ? itemLabel : undefined}
        className={({ isActive }) => itemClass(isActive && !href.includes('#'), highlight)}
      >
        <Icon aria-hidden className="size-[19px] shrink-0" strokeWidth={1.9} />
        {collapsed ? (
          <span className="sr-only">{itemLabel}</span>
        ) : (
          <span className="flex-1 truncate">{itemLabel}</span>
        )}
        {!collapsed && !!count && (
          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-muted ring-1 ring-line">
            {count}
          </span>
        )}
      </NavLink>
    </li>
  );

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          'flex h-[72px] shrink-0 items-center',
          collapsed ? 'justify-center' : 'justify-between pr-2 pl-5',
        )}
      >
        <Logo markOnly={collapsed} className={collapsed ? 'ml-2' : undefined} />
      </div>

      <nav aria-label={label} className={cn('min-h-0 flex-1 overflow-y-auto pb-4', collapsed ? 'px-3.5' : 'px-3')}>
        {groups.map((group, index) => (
          <div key={group.label ?? 'main'} className={cn(index > 0 && 'mt-5 border-t border-line pt-5')}>
            {group.label &&
              (collapsed ? (
                <span className="sr-only">{group.label}</span>
              ) : (
                <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.12em] text-subtle uppercase">
                  {group.label}
                </p>
              ))}
            <ul className="space-y-1">{group.items.map(renderItem)}</ul>
          </div>
        ))}
      </nav>

      <div className={cn('shrink-0 border-t border-line py-3', collapsed ? 'px-3.5' : 'px-3')}>
        {footerItems.length > 0 && <ul className="mb-1 space-y-1">{footerItems.map(renderItem)}</ul>}
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
