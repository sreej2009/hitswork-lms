import type { ReactNode } from 'react';
import { Check, SlidersHorizontal } from 'lucide-react';
import {
  durationOptions,
  levelOptions,
  priceOptions,
  ratingOptions,
  type CatalogQuery,
  type DurationId,
  type LevelId,
  type PriceId,
  type RatingId,
  type facetCounts,
} from '../../lib/catalog';
import { cn } from '../../lib/cn';
import { RatingStars } from '../ui/RatingStars';

interface OptionProps {
  type: 'checkbox' | 'radio';
  name: string;
  checked: boolean;
  count: number;
  onToggle: () => void;
  children: ReactNode;
}

function FilterOption({ type, name, checked, count, onToggle, children }: OptionProps) {
  // Options with no results can't be chosen, but an active one can always be cleared.
  const disabled = count === 0 && !checked;
  return (
    <label
      className={cn(
        'group -mx-2 flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors',
        disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:bg-canvas',
      )}
    >
      <span className="relative grid size-[18px] shrink-0 place-items-center">
        <input
          type={type}
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={onToggle}
          // A checked radio doesn't fire onChange when clicked again, so handle "unselect" here.
          onClick={type === 'radio' && checked ? onToggle : undefined}
          className={cn(
            'peer size-[18px] cursor-[inherit] appearance-none border border-line-strong bg-white transition-colors',
            'checked:border-brand-600 checked:bg-brand-600 group-hover:border-brand-300 disabled:group-hover:border-line-strong',
            type === 'radio' ? 'rounded-full' : 'rounded-[5px]',
          )}
        />
        {type === 'checkbox' ? (
          <Check
            aria-hidden
            className="pointer-events-none absolute size-3 text-white opacity-0 peer-checked:opacity-100"
            strokeWidth={3.4}
          />
        ) : (
          <span
            aria-hidden
            className="pointer-events-none absolute size-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"
          />
        )}
      </span>
      <span className="flex flex-1 items-center gap-2 text-sm text-body group-hover:text-ink">{children}</span>
      <span className="text-xs text-subtle tabular-nums">{count}</span>
    </label>
  );
}

function FilterGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-line pt-5 first:border-0 first:pt-0">
      <legend className="mb-2.5 float-left w-full text-sm font-semibold text-ink">{legend}</legend>
      <div className="clear-both space-y-0.5">{children}</div>
    </fieldset>
  );
}

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

interface FilterPanelProps {
  query: CatalogQuery;
  counts: ReturnType<typeof facetCounts>;
  onChange: (patch: Partial<CatalogQuery>) => void;
  onClear: () => void;
  activeCount: number;
  /** `card` for the desktop sidebar; `plain` inside the mobile sheet */
  variant?: 'card' | 'plain';
}

export function FilterPanel({ query, counts, onChange, onClear, activeCount, variant = 'card' }: FilterPanelProps) {
  return (
    <div className={cn(variant === 'card' && 'rounded-2xl border border-line bg-white p-5 shadow-card')}>
      {variant === 'card' && (
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-sans text-base font-bold">
            <SlidersHorizontal aria-hidden className="size-4 text-brand-600" strokeWidth={2.2} />
            Filters
          </h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-md text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      <div className="space-y-5">
        <FilterGroup legend="Level">
          {levelOptions.map((option) => (
            <FilterOption
              key={option.id}
              type="checkbox"
              name="level"
              checked={query.levels.includes(option.id)}
              count={counts.levels[option.id as LevelId]}
              onToggle={() => onChange({ levels: toggle(query.levels, option.id) })}
            >
              {option.label}
            </FilterOption>
          ))}
        </FilterGroup>

        <FilterGroup legend="Price">
          {priceOptions.map((option) => (
            <FilterOption
              key={option.id}
              type="checkbox"
              name="price"
              checked={query.prices.includes(option.id)}
              count={counts.prices[option.id as PriceId]}
              onToggle={() => onChange({ prices: toggle(query.prices, option.id) })}
            >
              {option.label}
            </FilterOption>
          ))}
        </FilterGroup>

        <FilterGroup legend="Rating">
          {ratingOptions.map((option) => (
            <FilterOption
              key={option.id}
              type="radio"
              name="rating"
              checked={query.rating === option.id}
              count={counts.rating[option.id as RatingId]}
              onToggle={() => onChange({ rating: query.rating === option.id ? null : option.id })}
            >
              <RatingStars rating={option.min} size={13} />
              {option.label}
            </FilterOption>
          ))}
        </FilterGroup>

        <FilterGroup legend="Duration">
          {durationOptions.map((option) => (
            <FilterOption
              key={option.id}
              type="checkbox"
              name="duration"
              checked={query.durations.includes(option.id)}
              count={counts.durations[option.id as DurationId]}
              onToggle={() => onChange({ durations: toggle(query.durations, option.id) })}
            >
              {option.label}
            </FilterOption>
          ))}
        </FilterGroup>
      </div>
    </div>
  );
}
