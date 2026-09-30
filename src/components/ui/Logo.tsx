import { cn } from '../../lib/cn';
import { AppLink } from './AppLink';

/** Brand logo (mark + wordmark) served from /public. */
const LOGO_SRC = `${import.meta.env.BASE_URL}images/Hitswork.png`;
const LOGO_WIDTH = 5461;
const LOGO_HEIGHT = 1641;

interface LogoProps {
  /** `light` renders a white version for dark backgrounds */
  tone?: 'dark' | 'light';
  /** Show only the eagle mark (collapsed sidebar) */
  markOnly?: boolean;
  className?: string;
}

export function Logo({ tone = 'dark', markOnly = false, className }: LogoProps) {
  const image = (
      <img
        src={LOGO_SRC}
        alt="Hitswork"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        decoding="async"
        // The artwork has ~10% transparent padding on each side and ~18% above/below.
        // Height is chosen so the visible mark is ~31–36px tall; the negative left
        // margin lines the eagle up with the container edge.
        className={cn(
          'h-12 w-auto max-w-none -ml-4 select-none lg:h-14 lg:-ml-[18px]',
          tone === 'light' && 'brightness-0 invert',
        )}
        draggable={false}
      />
  );
  return (
    <AppLink href="/" aria-label={markOnly ? 'Hitswork home' : undefined} className={cn('inline-flex shrink-0 items-center rounded-lg', className)}>
      {/* The mark sits in the left ~30% of the artwork, so a narrow window crops out the wordmark. */}
      {markOnly ? <span className="block w-[31px] overflow-hidden">{image}</span> : image}
    </AppLink>
  );
}
