import type { Feature } from '../../types';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';

export function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const accent = accents[feature.accent];
  const Icon = feature.icon;
  return (
    <div className="group relative h-full rounded-[20px] border border-line bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-1 hover:border-brand-100 hover:shadow-card-hover sm:p-7">
      <span className={cn('relative grid size-12 place-items-center overflow-hidden rounded-2xl', accent.soft)}>
        <span
          aria-hidden
          className={cn('absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100', accent.gradient)}
        />
        <Icon
          aria-hidden
          className={cn('relative size-[22px] transition-colors duration-300 group-hover:text-white', accent.text)}
          strokeWidth={1.9}
        />
      </span>
      <span aria-hidden className="absolute top-6 right-6 font-display text-sm font-bold text-line-strong sm:top-7 sm:right-7">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="mt-6 text-lg font-bold tracking-[-0.01em]">{feature.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-body">{feature.description}</p>
    </div>
  );
}
