import { useRef, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface FilterOption<T extends string> {
  id: T;
  label: string;
  icon?: LucideIcon;
}

interface FilterPillsProps<T extends string> {
  options: readonly FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** id of the element the tabs control */
  controls: string;
  label: string;
}

/** Pill-shaped tabs with a gliding gradient indicator and arrow-key navigation. */
export function FilterPills<T extends string>({ options, value, onChange, controls, label }: FilterPillsProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = options.length - 1;
    const next =
      event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    refs.current[next]?.focus();
    onChange(options[next].id);
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className="no-scrollbar -mx-4 -my-3 flex gap-2 overflow-x-auto px-4 py-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {options.map((option, index) => {
        const active = option.id === value;
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${controls}-tab-${option.id}`}
            aria-selected={active}
            aria-controls={controls}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              'relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-200',
              active ? 'text-white' : 'border border-line bg-white text-body hover:border-brand-200 hover:text-ink',
            )}
          >
            {active && (
              <motion.span
                layoutId={`${controls}-pill`}
                aria-hidden
                className="absolute inset-0 rounded-full bg-brand-gradient shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_6px_14px_-6px_rgb(79_70_229/0.55)]"
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              />
            )}
            {Icon && (
              <Icon
                aria-hidden
                className={cn('relative size-4', active ? 'text-white/90' : 'text-subtle')}
                strokeWidth={2.1}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
