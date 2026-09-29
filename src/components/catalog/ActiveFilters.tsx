import { X } from 'lucide-react';
import { categories } from '../../data/categories';
import {
  durationOptions,
  levelOptions,
  priceOptions,
  ratingOptions,
  type CatalogQuery,
} from '../../lib/catalog';

interface Chip {
  key: string;
  label: string;
  remove: Partial<CatalogQuery>;
}

function chipsFor(query: CatalogQuery): Chip[] {
  const chips: Chip[] = [];
  if (query.q.trim()) chips.push({ key: 'q', label: `“${query.q.trim()}”`, remove: { q: '' } });
  if (query.category !== 'all') {
    const name = categories.find((c) => c.id === query.category)?.name ?? query.category;
    chips.push({ key: 'category', label: name, remove: { category: 'all' } });
  }
  for (const id of query.levels) {
    const label = levelOptions.find((o) => o.id === id)!.label;
    chips.push({ key: `level-${id}`, label, remove: { levels: query.levels.filter((v) => v !== id) } });
  }
  for (const id of query.prices) {
    const label = priceOptions.find((o) => o.id === id)!.label;
    chips.push({ key: `price-${id}`, label, remove: { prices: query.prices.filter((v) => v !== id) } });
  }
  if (query.rating) {
    const label = ratingOptions.find((o) => o.id === query.rating)!.label;
    chips.push({ key: 'rating', label: `Rating ${label}`, remove: { rating: null } });
  }
  for (const id of query.durations) {
    const label = durationOptions.find((o) => o.id === id)!.label;
    chips.push({ key: `duration-${id}`, label, remove: { durations: query.durations.filter((v) => v !== id) } });
  }
  return chips;
}

interface ActiveFiltersProps {
  query: CatalogQuery;
  onChange: (patch: Partial<CatalogQuery>) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ query, onChange, onClearAll }: ActiveFiltersProps) {
  const chips = chipsFor(query);
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ul className="contents" aria-label="Active filters">
        {chips.map((chip) => (
          <li
            key={chip.key}
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pr-1 pl-3 text-xs font-semibold text-brand-700 ring-1 ring-brand-100"
          >
            {chip.label}
            <button
              type="button"
              aria-label={`Remove filter: ${chip.label}`}
              onClick={() => onChange(chip.remove)}
              className="grid size-5 place-items-center rounded-full text-brand-500 transition-colors hover:bg-brand-100 hover:text-brand-700"
            >
              <X aria-hidden className="size-3" strokeWidth={2.6} />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 rounded-md text-xs font-semibold text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
