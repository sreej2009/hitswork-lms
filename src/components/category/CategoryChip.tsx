import type { Category } from '../../types';
import { categoryHref } from '../../data/categories';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { AppLink } from '../ui/AppLink';

/** Compact icon-over-label link used in the category strip. */
export function CategoryChip({ category }: { category: Category }) {
  const accent = accents[category.accent];
  const Icon = category.icon;
  return (
    <AppLink
      href={categoryHref(category.id)}
      className="group flex h-full w-[104px] shrink-0 snap-start flex-col items-center gap-2.5 rounded-2xl px-2 py-3.5 text-center transition-colors duration-200 hover:bg-canvas lg:w-auto lg:flex-1"
    >
      <span
        className={cn(
          'grid size-12 place-items-center rounded-2xl transition-transform duration-300 ease-out-soft group-hover:-translate-y-1',
          accent.soft,
          accent.text,
        )}
      >
        <Icon aria-hidden className="size-[22px]" strokeWidth={1.9} />
      </span>
      <span className="text-[13px] leading-tight font-semibold text-ink transition-colors group-hover:text-brand-700">
        {category.name}
      </span>
    </AppLink>
  );
}
