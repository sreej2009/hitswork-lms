import { useId, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name, e.g. "Date range" */
  label: string;
  className?: string;
}

/** Radio-group style pill switcher (date ranges, chart metrics). Arrow keys move the selection. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  const layoutId = useId();
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = options.findIndex((option) => option.value === value);
    const delta =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0;
    if (!delta) return;
    event.preventDefault();
    const next = options[(index + delta + options.length) % options.length];
    onChange(next.value);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('no-scrollbar inline-flex max-w-full gap-0.5 overflow-x-auto rounded-xl bg-canvas p-1 ring-1 ring-line', className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            data-value={option.value}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative min-h-8 flex-1 rounded-lg px-2.5 text-xs sm:px-3 font-semibold whitespace-nowrap transition-colors sm:text-[13px]',
              selected ? 'text-ink' : 'text-muted hover:text-ink',
            )}
          >
            {selected && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                className="absolute inset-0 rounded-lg bg-white shadow-xs ring-1 ring-line"
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
