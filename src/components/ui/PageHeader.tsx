import type { ReactNode } from 'react';
import { Container } from './Container';

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  /** Rendered above the title, e.g. checkout steps */
  top?: ReactNode;
  /** Rendered below the subtitle, e.g. an item count */
  meta?: ReactNode;
}

/** Soft lavender header band used by utility pages (cart, checkout, my learning). */
export function PageHeader({ title, subtitle, top, meta }: PageHeaderProps) {
  return (
    <header className="relative isolate overflow-hidden border-b border-line">
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-brand-50/80 via-grape-50/30 to-white" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_40%_90%_at_90%_0%,black,transparent)]"
      />
      <Container className="pt-8 pb-8 sm:pt-10 sm:pb-10">
        {top && <div className="mb-7">{top}</div>}
        <h1 className="text-[2rem] leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-[2.5rem]">{title}</h1>
        {subtitle && <p className="mt-2.5 max-w-xl text-[16px] leading-relaxed text-body sm:text-[17px]">{subtitle}</p>}
        {meta && <div className="mt-4">{meta}</div>}
      </Container>
    </header>
  );
}
