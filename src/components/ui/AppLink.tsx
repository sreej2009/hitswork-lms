import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router';

export interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Router state for internal links (e.g. where to return after signing in) */
  state?: unknown;
}

/**
 * Internal paths ("/courses") go through the router so they respect the deploy base path
 * and don't reload the page. Hash links, external URLs and mailto: stay plain anchors.
 */
export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink({ href, state, ...rest }, ref) {
  if (href.startsWith('/')) return <Link ref={ref} to={href} state={state} {...rest} />;
  return <a ref={ref} href={href} {...rest} />;
});
