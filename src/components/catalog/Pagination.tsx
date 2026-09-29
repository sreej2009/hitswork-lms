import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

type PageItem = number | 'gap-start' | 'gap-end';

/** Page numbers with ellipses once there are more than seven pages. */
function pageItems(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(current - 1, total - 4));
  const end = Math.min(total - 1, Math.max(current + 1, 5));
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return [1, ...(start > 2 ? ['gap-start' as const] : []), ...middle, ...(end < total - 1 ? ['gap-end' as const] : []), total];
}

const itemClass =
  'grid size-10 place-items-center rounded-xl text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 sm:gap-1.5">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={cn(itemClass, 'text-body hover:bg-brand-50 hover:text-brand-700 disabled:hover:bg-transparent')}
      >
        <ChevronLeft aria-hidden className="size-5" strokeWidth={2.2} />
      </button>

      {pageItems(page, pageCount).map((item) =>
        typeof item === 'number' ? (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
            className={cn(
              itemClass,
              item === page
                ? 'bg-brand-gradient text-white shadow-[0_6px_14px_-6px_rgb(79_70_229/0.55)]'
                : 'text-body hover:bg-brand-50 hover:text-brand-700',
            )}
          >
            {item}
          </button>
        ) : (
          <span key={item} aria-hidden className="grid w-6 place-items-center text-sm text-subtle">
            …
          </span>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
        className={cn(itemClass, 'text-body hover:bg-brand-50 hover:text-brand-700 disabled:hover:bg-transparent')}
      >
        <ChevronRight aria-hidden className="size-5" strokeWidth={2.2} />
      </button>
    </nav>
  );
}
