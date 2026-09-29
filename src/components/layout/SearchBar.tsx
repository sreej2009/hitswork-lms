import { useEffect, useId, useRef, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../../lib/cn';

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
  /** Focus this field when the user presses "/" anywhere on the page */
  hotkey?: boolean;
}

export function SearchBar({ className, autoFocus, hotkey }: SearchBarProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = inputRef.current?.value.trim() ?? '';
    navigate(q ? `/courses?q=${encodeURIComponent(q)}` : '/courses');
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (!hotkey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (event.key === '/' && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hotkey]);

  return (
    <form role="search" onSubmit={onSubmit} className={cn('group relative flex items-center', className)}>
      <label htmlFor={id} className="sr-only">
        Search for courses, skills, or instructors
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-4 size-[18px] text-subtle transition-colors group-focus-within:text-brand-600"
        strokeWidth={2}
      />
      <input
        ref={inputRef}
        id={id}
        type="search"
        autoFocus={autoFocus}
        autoComplete="off"
        aria-keyshortcuts={hotkey ? '/' : undefined}
        placeholder="Search for courses, skills, or instructors..."
        className={cn(
          'h-11 w-full min-w-0 truncate rounded-full border border-line bg-canvas pr-4 pl-11 text-sm text-ink outline-none',
          'transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-subtle',
          'hover:border-line-strong focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100',
        )}
      />
    </form>
  );
}
