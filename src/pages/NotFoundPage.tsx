import { Compass, SearchX } from 'lucide-react';
import { useLocation } from 'react-router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';

/** Pages the site already links to (footer, Teach) that aren't built yet. */
const PLANNED_PAGES = new Set([
  '/careers',
  '/blog',
  '/partners',
  '/affiliates',
  '/terms',
  '/privacy',
  '/cookies',
  '/sitemap',
  '/teach/stories',
]);

/** "Coming soon" for planned pages, a real 404 for every other unknown URL. */
export function NotFoundPage() {
  const { pathname } = useLocation();
  const planned = PLANNED_PAGES.has(pathname.replace(/\/+$/, '') || '/');
  useDocumentTitle(planned ? 'Coming soon — Hitswork' : 'Page not found — Hitswork');
  const Icon = planned ? Compass : SearchX;
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-brand-50/70 to-white" />
      <Container className="flex flex-col items-center py-24 text-center sm:py-32">
        <span className="grid size-16 place-items-center rounded-2xl bg-white text-brand-600 shadow-card">
          <Icon aria-hidden className="size-7" strokeWidth={1.9} />
        </span>
        {!planned && <p className="mt-6 text-sm font-semibold tracking-wide text-brand-600">404</p>}
        <h1
          className={
            planned
              ? 'mt-6 text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl'
              : 'mt-2 text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl'
          }
        >
          {planned ? 'This page is on its way' : 'Page not found'}
        </h1>
        <p className="mt-3 max-w-md text-[17px] leading-relaxed text-body">
          {planned
            ? 'We’re still building this part of Hitswork. In the meantime, explore our courses.'
            : 'The page you’re looking for doesn’t exist or may have moved.'}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/courses" arrow>
            Explore Courses
          </Button>
          <Button href="/" variant="secondary">
            Back to Home
          </Button>
        </div>
      </Container>
    </section>
  );
}
