import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, BarChart3, BookOpen, Star } from 'lucide-react';
import { formatCompact } from '../../lib/format';
import { AppLink } from '../ui/AppLink';
import { Logo } from '../ui/Logo';
import { easeOutSoft } from '../ui/Reveal';

const highlights = [
  { icon: BookOpen, text: 'Access 10,000+ expert-led courses' },
  { icon: BarChart3, text: 'Track your progress across every device' },
  { icon: Award, text: 'Earn certificates employers recognise' },
];

/** Decorative preview of the product, echoing the homepage's floating cards. */
function ProgressPreview() {
  return (
    <div aria-hidden className="relative mt-12 max-w-sm">
      <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-float backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Continue learning</p>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">+12%</span>
        </div>
        <p className="mt-2 font-display text-[15px] font-bold text-ink">UI/UX Design Essentials</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-100">
            <div className="h-full w-[76%] rounded-full bg-brand-gradient" />
          </div>
          <span className="text-sm font-bold text-ink">76%</span>
        </div>
        <p className="mt-2 text-xs text-muted">18 of 24 lessons · Next: Prototyping in Figma</p>
      </div>
      <div className="absolute -right-6 -bottom-8 flex items-center gap-2.5 rounded-2xl bg-brand-gradient px-4 py-3 text-white shadow-[0_18px_40px_-14px_rgb(79_70_229/0.6)]">
        <Star className="size-4 text-amber-300" fill="currentColor" strokeWidth={0} />
        <span className="text-sm font-semibold">4.8 average course rating</span>
      </div>
    </div>
  );
}

interface AuthShellProps {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  /** Line under the card, e.g. "Already have an account? Sign in" */
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Brand panel (desktop) */}
      <aside className="relative isolate hidden overflow-hidden border-r border-line bg-linear-to-br from-brand-50 via-white to-grape-100 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div aria-hidden className="absolute -top-32 -right-24 -z-10 size-[28rem] rounded-full bg-brand-200/50 blur-3xl" />
        <div aria-hidden className="absolute -bottom-40 -left-24 -z-10 size-[26rem] rounded-full bg-grape-100 blur-3xl" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_70%_40%,black,transparent)]"
        />

        <Logo />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutSoft }}
          className="max-w-lg"
        >
          <p className="text-sm font-semibold tracking-[0.14em] text-brand-600 uppercase">Hitswork</p>
          <h2 className="mt-4 text-5xl leading-[1.05] font-extrabold tracking-[-0.035em] xl:text-6xl">
            Learn. Build. <span className="text-gradient pr-1">Grow.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-body">
            Access your courses, track your progress, and continue learning wherever you are.
          </p>
          <ul className="mt-8 space-y-3.5">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-[15px] font-medium text-ink">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-xs ring-1 ring-brand-100">
                  <Icon aria-hidden className="size-[18px]" strokeWidth={2} />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <ProgressPreview />
        </motion.div>

        <p className="text-sm text-muted">
          Trusted by {formatCompact(50000)}+ learners and 100+ partner universities.
        </p>
      </aside>

      {/* Form column */}
      <main id="main" className="flex min-w-0 flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between gap-4">
          <div className="lg:hidden">
            <Logo />
          </div>
          <AppLink
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4" strokeWidth={2.2} />
            Back to home
          </AppLink>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutSoft }}
          className="mx-auto my-auto w-full max-w-[440px] py-10"
        >
          <h1 className="text-[1.875rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-4xl">{title}</h1>
          <p className="mt-2.5 text-[15.5px] leading-relaxed text-body">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-8 text-center text-sm text-body">{footer}</p>}
        </motion.div>

        <p className="text-center text-xs text-subtle">© 2026 Hitswork. All rights reserved.</p>
      </main>
    </div>
  );
}
