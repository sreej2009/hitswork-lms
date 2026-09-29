import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { sortOptions, type SortId } from '../../lib/catalog';

export function SortSelect({ value, onChange }: { value: SortId; onChange: (value: SortId) => void }) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm whitespace-nowrap text-muted max-sm:sr-only">
        Sort by
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as SortId)}
          className="h-10 cursor-pointer appearance-none rounded-xl border border-line-strong bg-white pr-9 pl-3.5 text-sm font-semibold text-ink shadow-xs outline-none transition-[border-color,box-shadow] hover:border-brand-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
          strokeWidth={2.2}
        />
      </div>
    </div>
  );
}
