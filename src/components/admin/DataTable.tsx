import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { AppLink } from '../ui/AppLink';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right';
  /** Extra classes for the cell (e.g. a max width) */
  className?: string;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Card layout used below the `breakpoint` */
  card: (row: T) => ReactNode;
  caption: string;
  empty?: ReactNode;
  /** Width at which the table replaces the cards */
  breakpoint?: 'lg' | 'xl';
}

/** Table on wide screens, stacked cards below — no horizontal page scrolling. */
export function DataTable<T>({ rows, columns, rowKey, card, caption, empty, breakpoint = 'xl' }: DataTableProps<T>) {
  if (rows.length === 0) return <>{empty}</>;
  return (
    <>
      <div className={cn('relative hidden overflow-x-auto', breakpoint === 'lg' ? 'lg:block' : 'xl:block')}>
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    'py-3 font-medium',
                    index === 0 ? 'pr-4 pl-6' : index === columns.length - 1 ? 'pr-6 pl-3' : 'px-3',
                    column.align === 'right' && 'text-right',
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-line transition-colors last:border-b-0 hover:bg-canvas/60"
              >
                {columns.map((column, index) => (
                  <td
                    key={column.key}
                    className={cn(
                      'py-3 align-middle',
                      index === 0 ? 'pr-4 pl-6' : index === columns.length - 1 ? 'pr-6 pl-3' : 'px-3',
                      column.align === 'right' && 'text-right',
                      column.className,
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className={cn('divide-y divide-line', breakpoint === 'lg' ? 'lg:hidden' : 'xl:hidden')}>
        {rows.map((row) => (
          <li key={rowKey(row)} className="px-5 py-4 sm:px-6">
            {card(row)}
          </li>
        ))}
      </ul>
    </>
  );
}

/** Small icon-or-text action button used in admin tables. */
export function RowAction({
  children,
  onClick,
  href,
  tone = 'default',
  label,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  tone?: 'default' | 'primary' | 'danger';
  label?: string;
  disabled?: boolean;
}) {
  const className = cn(
    'inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-40',
    tone === 'primary' && 'bg-brand-50 text-brand-700 hover:bg-brand-100',
    tone === 'danger' && 'text-rose-600 hover:bg-rose-50',
    tone === 'default' && 'text-body hover:bg-canvas hover:text-ink',
  );
  if (href)
    return (
      <AppLink href={href} aria-label={label} className={className} onClick={onClick}>
        {children}
      </AppLink>
    );
  return (
    <button type="button" aria-label={label} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
