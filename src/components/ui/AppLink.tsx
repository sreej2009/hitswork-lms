import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router';

export interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

/**
 * Internal paths ("/courses") go through the router so they respect the deploy base path
 * and don't reload the page. Hash links, external URLs and mailto: stay plain anchors.
 */
export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink({ href, ...rest }, ref) {
  if (href.startsWith('/')) return <Link ref={ref} to={href} {...rest} />;
  return <a ref={ref} href={href} {...rest} />;
});
