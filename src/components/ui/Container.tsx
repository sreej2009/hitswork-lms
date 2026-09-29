import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Wide is used by the header, which needs extra room for navigation and search */
  size?: 'default' | 'wide';
}

export function Container({ children, className, size = 'default' }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        size === 'wide' ? 'max-w-[1440px]' : 'max-w-[1320px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
