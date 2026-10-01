import { useLayoutEffect, useRef, useState, type ClipboardEvent } from 'react';
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { htmlToText, sanitizeHtml } from '../../lib/sanitizeHtml';

interface RichTextEditorProps {
  id: string;
  /** Sanitised HTML */
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
  /** Ids of the label/hint elements */
  labelledBy?: string;
  describedBy?: string;
  minHeight?: string;
}

interface Tool {
  label: string;
  icon: LucideIcon;
  run: () => void;
  /** document.queryCommandState name, to show the pressed state */
  state?: string;
}

/**
 * Lightweight rich-text editor (contenteditable + execCommand). Output is passed through the allow-list
 * sanitiser on every change, so only headings, emphasis, lists, links and code blocks are ever stored.
 */
export function RichTextEditor({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  invalid,
  labelledBy,
  describedBy,
  minHeight = 'min-h-48',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef<string | null>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});

  // Only write into the DOM when the value changes from outside (initial load, undo of a whole draft…),
  // never while typing — that would move the caret.
  useLayoutEffect(() => {
    const el = editorRef.current;
    if (el && value !== lastEmitted.current) {
      el.innerHTML = value;
      lastEmitted.current = value;
    }
  }, [value]);

  const emit = () => {
    const el = editorRef.current;
    if (!el) return;
    const html = htmlToText(el.innerHTML) ? sanitizeHtml(el.innerHTML) : '';
    lastEmitted.current = html;
    onChange(html);
  };

  const refreshState = () =>
    setActive({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    });

  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emit();
    refreshState();
  };

  const tools: Tool[] = [
    { label: 'Paragraph', icon: Pilcrow, run: () => exec('formatBlock', 'p') },
    { label: 'Heading', icon: Heading2, run: () => exec('formatBlock', 'h2') },
    { label: 'Subheading', icon: Heading3, run: () => exec('formatBlock', 'h3') },
    { label: 'Bold', icon: Bold, run: () => exec('bold'), state: 'bold' },
    { label: 'Italic', icon: Italic, run: () => exec('italic'), state: 'italic' },
    { label: 'Bulleted list', icon: List, run: () => exec('insertUnorderedList'), state: 'insertUnorderedList' },
    { label: 'Numbered list', icon: ListOrdered, run: () => exec('insertOrderedList'), state: 'insertOrderedList' },
    {
      label: 'Link',
      icon: Link2,
      run: () => {
        const url = window.prompt('Link URL (https://…)', 'https://');
        if (url && /^(https?:\/\/|mailto:)/i.test(url.trim())) exec('createLink', url.trim());
      },
    },
    { label: 'Code block', icon: Code2, run: () => exec('formatBlock', 'pre') },
  ];

  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const html = event.clipboardData.getData('text/html');
    const text = event.clipboardData.getData('text/plain');
    if (html) document.execCommand('insertHTML', false, sanitizeHtml(html));
    else document.execCommand('insertText', false, text);
    emit();
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-white transition-[border-color,box-shadow] focus-within:ring-4',
        invalid
          ? 'border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-100'
          : 'border-line-strong hover:border-brand-200 focus-within:border-brand-300 focus-within:ring-brand-100',
      )}
    >
      <div
        role="toolbar"
        aria-label="Formatting"
        aria-controls={id}
        className="flex flex-wrap gap-0.5 border-b border-line bg-canvas p-1.5"
      >
        {tools.map(({ label, icon: Icon, run, state }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={state ? !!active[state] : undefined}
            // Keep the text selection: act on mousedown and don't move focus to the button.
            onMouseDown={(event) => {
              event.preventDefault();
              run();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                run();
              }
            }}
            className={cn(
              'grid size-8 place-items-center rounded-lg transition-colors',
              state && active[state]
                ? 'bg-white text-brand-700 shadow-xs ring-1 ring-line'
                : 'text-body hover:bg-white hover:text-ink',
            )}
          >
            <Icon aria-hidden className="size-4" strokeWidth={2.1} />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        id={id}
        role="textbox"
        aria-multiline="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={onBlur}
        onKeyUp={refreshState}
        onMouseUp={refreshState}
        onPaste={onPaste}
        className={cn(
          'rich-text max-h-[28rem] overflow-y-auto px-4 py-3 text-[15px] leading-relaxed text-ink outline-none',
          'empty:before:pointer-events-none empty:before:text-subtle empty:before:content-[attr(data-placeholder)]',
          minHeight,
        )}
      />
    </div>
  );
}
