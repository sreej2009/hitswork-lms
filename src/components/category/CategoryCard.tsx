import { ArrowRight } from 'lucide-react';
import type { Category } from '../../types';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { formatNumber } from '../../lib/format';

/** Large category tile with an accent wash, course count and popular topics. */
export function CategoryCard({ category }: { category: Category }) {
  const accent = accents[category.accent];
  const Icon = category.icon;
  return (
    <a
      href={`/categories/${category.id}`}
      className={cn(
        'group relative isolate flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white p-5 shadow-card sm:p-6',
        'transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover',
        accent.border,
      )}
    >
      <div aria-hidden className={cn('absolute inset-0 -z-10 bg-linear-to-br via-white/70 to-white', accent.wash)} />
      <div
        aria-hidden
        className={cn(
          'absolute -top-12 -right-12 -z-10 size-40 rounded-full opacity-[0.14] blur-2xl transition-opacity duration-500 group-hover:opacity-30',
          accent.gradient,
        )}
      />

      <div className="flex items-center gap-4">
        <span
          className={cn(
            'grid size-14 shrink-0 place-items-center rounded-2xl text-white shadow-[0_10px_20px_-8px_rgb(15_23_42/0.35)] transition-transform duration-300 ease-out-soft group-hover:scale-105',
            accent.gradient,
          )}
        >
          <Icon aria-hidden className="size-6" strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg leading-tight font-bold tracking-[-0.01em]">{category.name}</h3>
          <p className="mt-1 text-sm text-muted">{formatNumber(category.courseCount)} courses</p>
        </div>
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-white text-ink transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white"
        >
          <ArrowRight className="size-[18px] transition-transform duration-300 group-hover:-rotate-45" strokeWidth={2.1} />
        </span>
      </div>

      <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={`Popular ${category.name} topics`}>
        {category.topics.map((topic) => (
          <li
            key={topic}
            className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-body ring-1 ring-line"
          >
            {topic}
          </li>
        ))}
      </ul>
    </a>
  );
}
