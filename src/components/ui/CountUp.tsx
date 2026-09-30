import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  value: number;
  /** Digits after the decimal point */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

const formatters = new Map<number, Intl.NumberFormat>();
const format = (value: number, decimals: number) => {
  let formatter = formatters.get(decimals);
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    formatters.set(decimals, formatter);
  }
  return formatter.format(value);
};

/** Counts from zero to `value` the first time it scrolls into view. Screen readers get the final value. */
export function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1.4, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: setDisplay });
    return () => controls.stop();
  }, [inView, reduceMotion, value, duration]);

  const final = `${prefix}${format(value, decimals)}${suffix}`;
  return (
    <span ref={ref} className={className}>
      <span aria-hidden className="tabular-nums">
        {prefix}
        {format(display, decimals)}
        {suffix}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
