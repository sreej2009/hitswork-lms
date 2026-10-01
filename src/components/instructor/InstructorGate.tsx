import { Outlet } from 'react-router';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, ClipboardCheck, Loader2, Rocket, Users, Wallet } from 'lucide-react';
import { useInstructor } from '../../context/InstructorContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { firstName, normaliseEmail } from '../../lib/auth';
import { loadApplication } from '../../lib/instructorApplication';
import { Footer } from '../layout/Footer';
import { Navbar } from '../layout/Navbar';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { easeOutSoft } from '../ui/Reveal';

const perks = [
  { icon: Users, text: 'See who’s enrolled and how far they’ve got' },
  { icon: BarChart3, text: 'Track views, enrollments and completion' },
  { icon: Wallet, text: 'Follow earnings and manage payouts' },
];

/** Shown to signed-in users who aren't instructors yet. */
function InstructorOnboarding() {
  usePageMeta('Become an Instructor — Hitswork', 'Set up your Hitswork instructor dashboard and start teaching.');
  const { user } = useAuth();
  const { activate } = useInstructor();
  const { notify } = useStore();
  const application = loadApplication();
  // Only show an application that belongs to this account.
  const ownApplication =
    application && user && normaliseEmail(application.email) === normaliseEmail(user.email) ? application : null;

  const onActivate = () => {
    activate();
    notify('Your instructor dashboard is ready');
  };

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-b from-brand-50/80 via-grape-50/30 to-white"
          />
          <Container className="py-14 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOutSoft }}
              className="mx-auto max-w-2xl rounded-3xl border border-line bg-white p-6 text-center shadow-card sm:p-10"
            >
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-gradient text-white shadow-brand">
                <Rocket aria-hidden className="size-7" strokeWidth={1.9} />
              </span>
              <h1 className="mt-6 text-[1.75rem] leading-tight font-extrabold tracking-[-0.025em] sm:text-[2.25rem]">
                {user ? `${firstName(user.name)}, start teaching on Hitswork` : 'Start teaching on Hitswork'}
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-body sm:text-[17px]">
                The instructor dashboard is where you create courses, follow your students and track earnings. Your
                account doesn’t have instructor access yet.
              </p>

              {ownApplication ? (
                <div className="mx-auto mt-7 flex max-w-md items-start gap-3 rounded-2xl bg-amber-50 p-4 text-left ring-1 ring-amber-100">
                  <ClipboardCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-amber-700" strokeWidth={1.9} />
                  <p className="text-sm leading-relaxed text-amber-900">
                    Application <span className="font-semibold">{ownApplication.id}</span> is under review. In this demo
                    you can open your instructor dashboard right away.
                  </p>
                </div>
              ) : null}

              <ul className="mx-auto mt-7 max-w-md space-y-2.5 text-left">
                {perks.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-[15px] text-ink">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <Icon aria-hidden className="size-4" strokeWidth={2} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                {ownApplication ? (
                  <Button size="lg" icon={CheckCircle2} onClick={onActivate}>
                    Open Instructor Dashboard
                  </Button>
                ) : (
                  <>
                    <Button size="lg" arrow href="/teach/register">
                      Apply to Teach
                    </Button>
                    <Button size="lg" variant="secondary" onClick={onActivate}>
                      Try the Demo Dashboard
                    </Button>
                  </>
                )}
              </div>
              <p className="mt-5 text-xs text-muted">
                Demo mode: the dashboard is filled with sample courses, students and earnings.
              </p>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

/** Instructor routes: render for instructors, onboarding for everyone else (sign-in is checked before this). */
export function RequireInstructor() {
  const { isInstructor, loading } = useInstructor();
  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-canvas" role="status">
        <Loader2 aria-hidden className="size-6 animate-spin text-brand-600" />
        <span className="sr-only">Loading instructor dashboard…</span>
      </div>
    );
  }
  return isInstructor ? <Outlet /> : <InstructorOnboarding />;
}
