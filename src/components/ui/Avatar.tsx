import { cn } from '../../lib/cn';

// Soft brand-adjacent gradients; a name always maps to the same one.
const palettes = [
  'from-brand-500 to-grape-600',
  'from-sky-500 to-brand-500',
  'from-emerald-500 to-teal-500',
  'from-pink-500 to-grape-600',
  'from-orange-400 to-rose-500',
  'from-cyan-500 to-sky-600',
];

const sizes = {
  xs: 'size-8 text-xs',
  sm: 'size-10 text-sm',
  md: 'size-12 text-base',
  xl: 'size-20 text-2xl',
};

function initials(name: string) {
  const words = name
    .replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, '')
    .split(/[\s,]+/)
    .filter((word) => /^[A-Za-z]/.test(word) && word !== word.toUpperCase());
  return ((words[0]?.[0] ?? '') + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase() || '?';
}

function paletteFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return palettes[hash % palettes.length];
}

/** Initials avatar. Decorative: the person's name is always shown next to it. */
export function Avatar({ name, size = 'sm', className }: { name: string; size?: keyof typeof sizes; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-linear-to-br font-display font-bold text-white',
        sizes[size],
        paletteFor(name),
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
