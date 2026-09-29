import { Compass } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';

/** Shown for pages that aren't built yet (course details, sign in, teach…) and unknown URLs. */
export function NotFoundPage() {
  useDocumentTitle('Coming soon — Hitswork');
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-brand-50/70 to-white" />
      <Container className="flex flex-col items-center py-24 text-center sm:py-32">
        <span className="grid size-16 place-items-center rounded-2xl bg-white text-brand-600 shadow-card">
          <Compass aria-hidden className="size-7" strokeWidth={1.9} />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl">This page is on its way</h1>
        <p className="mt-3 max-w-md text-[17px] leading-relaxed text-body">
          We’re still building this part of Hitswork. In the meantime, explore our courses.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/courses" arrow>
            Browse Courses
          </Button>
          <Button href="/" variant="secondary">
            Back to Home
          </Button>
        </div>
      </Container>
    </section>
  );
}
