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
  /** `compact` is used by the site navbar */
  size?: 'default' | 'compact';
  className?: string;
}

// Height and the matching negative margin (≈⅓ of the height) that lines the eagle up with the edge.
const sizes = {
  default: 'h-12 -ml-4 lg:h-14 lg:-ml-[18px]',
  compact: 'h-10 -ml-[13px] lg:h-11 lg:-ml-[14px]',
};

export function Logo({ tone = 'dark', markOnly = false, size = 'default', className }: LogoProps) {
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
      className={cn('w-auto max-w-none select-none', sizes[size], tone === 'light' && 'brightness-0 invert')}
      draggable={false}
    />
  );
  return (
    <AppLink
      href="/"
      aria-label={markOnly ? 'Hitswork home' : undefined}
      className={cn('inline-flex shrink-0 items-center rounded-lg', className)}
    >
      {/* The mark sits in the left ~30% of the artwork, so a narrow window crops out the wordmark. */}
      {markOnly ? <span className="block w-[31px] overflow-hidden">{image}</span> : image}
    </AppLink>
  );
}
