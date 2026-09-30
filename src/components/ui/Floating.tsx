import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { easeOutSoft } from './Reveal';

interface FloatingProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
}

/** Enters once, then drifts gently up and down. */
export function Floating({ children, className, delay = 0, duration = 6, distance = 8 }: FloatingProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={cn('absolute z-10', className)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.55 + delay, ease: easeOutSoft }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -distance, 0] }}
        transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
