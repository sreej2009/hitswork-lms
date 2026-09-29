import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Container } from './Container';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  labelledBy?: string;
}

/** Page section with the shared vertical rhythm. */
export function Section({ id, children, className, containerClassName, labelledBy }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('py-16 sm:py-20 lg:py-24', className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
