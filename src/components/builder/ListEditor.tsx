import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';

interface ListEditorProps {
  id: string;
  items: string[];
  onChange: (items: string[]) => void;
  max: number;
  /** Shown in the counter, e.g. "objectives" */
  noun: string;
  addLabel: string;
  placeholders: string[];
  maxLength?: number;
}

/** Editable bullet list: add, edit, delete and reorder (drag on desktop, arrows everywhere). */
export function ListEditor({
  id,
  items,
  onChange,
  max,
  noun,
  addLabel,
  placeholders,
  maxLength = 160,
}: ListEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const filled = items.filter((item) => item.trim()).length;

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const add = () => {
    if (items.length >= max) return;
    onChange([...items, '']);
    // Focus the new row once it renders.
    requestAnimationFrame(() => listRef.current?.querySelector<HTMLInputElement>('li:last-child input')?.focus());
  };

  return (
    <div>
      <ol ref={listRef} className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            draggable
            onDragStart={(event) => {
              setDragIndex(index);
              event.dataTransfer.effectAllowed = 'move';
              event.dataTransfer.setData('text/plain', String(index));
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setOverIndex(index);
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (dragIndex !== null) move(dragIndex, index);
              setDragIndex(null);
              setOverIndex(null);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            className={cn(
              'flex items-center gap-1.5 rounded-xl transition-shadow',
              overIndex === index && dragIndex !== null && dragIndex !== index && 'ring-2 ring-brand-200',
              dragIndex === index && 'opacity-50',
            )}
          >
            <span aria-hidden className="hidden cursor-grab text-subtle sm:block">
              <GripVertical className="size-4" />
            </span>
            <label htmlFor={`${id}-${index}`} className="sr-only">
              {noun} {index + 1}
            </label>
            <input
              id={`${id}-${index}`}
              value={item}
              maxLength={maxLength}
              onChange={(e) => onChange(items.map((value, i) => (i === index ? e.target.value : value)))}
              placeholder={placeholders[index] ?? placeholders[placeholders.length - 1]}
              className="h-11 min-w-0 flex-1 rounded-xl border border-line-strong bg-white px-3.5 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-subtle hover:border-brand-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            />
            <div className="flex shrink-0">
              <button
                type="button"
                aria-label={`Move ${noun} ${index + 1} up`}
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
                className="grid size-9 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink disabled:opacity-30"
              >
                <ArrowUp aria-hidden className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Move ${noun} ${index + 1} down`}
                disabled={index === items.length - 1}
                onClick={() => move(index, index + 1)}
                className="grid size-9 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink disabled:opacity-30"
              >
                <ArrowDown aria-hidden className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Delete ${noun} ${index + 1}`}
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="grid size-9 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 aria-hidden className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <Button variant="soft" size="sm" icon={Plus} onClick={add} disabled={items.length >= max}>
          {addLabel}
        </Button>
        <p className="text-xs text-muted tabular-nums">
          {filled} / {max} {noun}
        </p>
      </div>
    </div>
  );
}
