import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Clock, ListVideo, Lock } from 'lucide-react';
import type { Lesson } from '../types';
import { courses } from '../data/courses';
import { lessonContent } from '../data/lessons';
import { useLearning } from '../context/LearningContext';
import { useStore } from '../context/StoreContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../lib/cn';
import { CurriculumPanel } from '../components/player/CurriculumPanel';
import { LessonTabs, type LessonTab } from '../components/player/LessonTabs';
import { CompletionPanel, CurriculumDrawer, InstructorMini, PlayerHeader, ShortcutsDialog } from '../components/player/PlayerChrome';
import { VideoPlayer, type VideoPlayerHandle } from '../components/player/VideoPlayer';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';

function AccessState({ courseId, title, text }: { courseId?: string; title: string; text: string }) {
  return (
    <div className="min-h-dvh bg-[#0B1220] text-white">
      <header className="flex h-16 items-center border-b border-white/10 px-5">
        <Logo tone="light" />
      </header>
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
          <Lock aria-hidden className="size-7" strokeWidth={1.9} />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.02em] text-white">{title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-white/70">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={courseId ? `/course/${courseId}` : '/courses'} arrow>
            {courseId ? 'Enroll in this course' : 'Browse Courses'}
          </Button>
          <Button href="/my-learning" variant="white">
            My Learning
          </Button>
        </div>
      </div>
    </div>
  );
}

const isTyping = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
};

/** Focused learning environment: demo video, lesson details, notes/resources, and the curriculum. */
export function CoursePlayerPage() {
  const { courseId = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const { getLearning, openLesson, setLessonComplete, getLessonPosition, setLessonPosition } = useLearning();
  const { notify } = useStore();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const course = courses.find((c) => c.id === courseId);
  const learning = getLearning(courseId);

  const playerRef = useRef<VideoPlayerHandle>(null);
  const contentButtonRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<LessonTab>('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rewatching, setRewatching] = useState(false);

  const lessons = learning?.plan.lessons ?? [];
  const done = useMemo(() => new Set(learning?.record.completedLessonIds ?? []), [learning?.record.completedLessonIds]);
  // Lessons unlock in order: anything completed, plus the first lesson not yet completed.
  const firstIncomplete = lessons.find((l) => !done.has(l.id))?.index ?? lessons.length;
  const isUnlocked = useCallback(
    (lesson: Lesson) => done.has(lesson.id) || lesson.index <= firstIncomplete,
    [done, firstIncomplete],
  );

  const requested = lessons.find((l) => l.index === Number.parseInt(params.get('lesson') ?? '', 10));
  const lesson = requested && isUnlocked(requested) ? requested : learning?.nextLesson;
  const completed = learning?.status === 'completed';
  const showCompletion = completed && !rewatching;

  useDocumentTitle(lesson && course ? `${lesson.title} — ${course.title} — Hitswork` : 'Course Player — Hitswork');

  // Opening a lesson records it as the resume point. Keyed on the lesson only: `openLesson`
  // changes identity whenever progress changes, which would re-run this needlessly.
  const lessonId = lesson?.id;
  useEffect(() => {
    if (lessonId) openLesson(courseId, lessonId);
  }, [courseId, lessonId]);

  // Pin the lesson in the URL. Without it the page would follow "next unfinished lesson", which
  // changes the moment the current lesson is completed.
  const lessonIndex = lesson?.index;
  useEffect(() => {
    if (lessonIndex !== undefined && requested?.index !== lessonIndex)
      setParams({ lesson: String(lessonIndex) }, { replace: true });
  }, [lessonIndex, requested?.index, setParams]);

  const goTo = useCallback(
    (target: Lesson) => {
      setParams({ lesson: String(target.index) }, { replace: true });
      setDrawerOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setParams],
  );

  const previous = lesson ? lessons[lesson.index - 1] : undefined;
  const next = lesson ? lessons[lesson.index + 1] : undefined;

  /** Marks the current lesson complete; returns true if that finished the course. */
  const completeCurrent = useCallback(() => {
    if (!course || !lesson || done.has(lesson.id)) return false;
    const finishesCourse = lessons.every((l) => l.id === lesson.id || done.has(l.id));
    setLessonComplete(course.id, lesson.id, true);
    setLessonPosition(course.id, lesson.id, 0);
    if (finishesCourse) {
      setRewatching(false);
      notify('Course complete! Your certificate is ready.');
    }
    return finishesCourse;
  }, [course, lesson, lessons, done, setLessonComplete, setLessonPosition, notify]);

  /** Next Lesson: completes the current lesson, then moves on. */
  const goNext = useCallback(() => {
    completeCurrent();
    if (next) goTo(next);
  }, [completeCurrent, next, goTo]);

  const onPositionChange = useCallback(
    (seconds: number) => {
      if (course && lesson) setLessonPosition(course.id, lesson.id, seconds);
    },
    [course, lesson, setLessonPosition],
  );

  // Keyboard shortcuts (ignored while typing or when a dialog is open).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTyping(event.target) || drawerOpen || helpOpen || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const player = playerRef.current;
      if (event.key === ' ') {
        // Space on a focused button should press that button instead.
        if (target?.closest('button, a, [role="tab"]') || !player) return;
        event.preventDefault();
        player.togglePlay();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (target?.closest('[role="tab"], input[type="range"]')) return;
        const forward = event.key === 'ArrowRight';
        if (event.shiftKey) {
          event.preventDefault();
          if (forward && next && isUnlocked(next)) goTo(next);
          else if (!forward && previous) goTo(previous);
        } else if (player) {
          event.preventDefault();
          player.seekBy(forward ? 10 : -10);
        }
      } else if ((event.key === 'f' || event.key === 'F') && player) {
        event.preventDefault();
        player.toggleFullscreen();
      } else if ((event.key === 'm' || event.key === 'M') && player) {
        player.toggleMute();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen, helpOpen, next, previous, goTo, isUnlocked]);

  const openTab = (target: LessonTab) => {
    setTab(target);
    window.requestAnimationFrame(() =>
      document.getElementById('lesson-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  };

  if (!course) return <AccessState title="Course not found" text="This course doesn’t exist or may have been removed." />;
  if (!learning || !lesson)
    return (
      <AccessState
        courseId={course.id}
        title="You’re not enrolled in this course"
        text={`Enroll in ${course.title} to unlock its lessons, notes and resources.`}
      />
    );

  const content = lessonContent(course, lesson);
  const lessonDone = done.has(lesson.id);
  const sidebarVisible = isDesktop && sidebarOpen;
  const curriculum = (
    <CurriculumPanel learning={learning} currentLessonId={lesson.id} isUnlocked={isUnlocked} onSelect={goTo} />
  );

  return (
    <div className="min-h-dvh bg-canvas">
      <PlayerHeader
        learning={learning}
        onNotes={() => openTab('notes')}
        onResources={() => openTab('resources')}
        onHelp={() => setHelpOpen(true)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((value) => !value)}
      />

      <div className={cn('lg:grid', sidebarVisible ? 'lg:grid-cols-[minmax(0,1fr)_380px]' : 'lg:grid-cols-1')}>
        <main id="main" className="min-w-0">
          {/* Video band: sized so the whole player fits in the viewport */}
          <section aria-label="Lesson video" className="bg-[#0B1220] sm:px-6 sm:py-6 lg:px-8">
            <div className="mx-auto w-full max-w-[max(20rem,calc((100dvh-10rem)*16/9))]">
              <AnimatePresence mode="wait" initial={false}>
                {showCompletion ? (
                  <CompletionPanel key="complete" learning={learning} onRewatch={() => setRewatching(true)} />
                ) : (
                  <motion.div key="player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <VideoPlayer
                      ref={playerRef}
                      lessonId={lesson.id}
                      title={lesson.title}
                      sectionLabel={`Section ${String(lesson.sectionIndex + 1).padStart(2, '0')} · ${lesson.sectionTitle}`}
                      posterId={course.image}
                      duration={lesson.seconds}
                      startAt={getLessonPosition(course.id, lesson.id)}
                      hasNext={!!next}
                      onPositionChange={onPositionChange}
                      onEnded={completeCurrent}
                      onNext={goNext}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <motion.div key={lesson.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <p className="text-xs font-semibold tracking-[0.12em] text-brand-600 uppercase">
                Section {String(lesson.sectionIndex + 1).padStart(2, '0')} · Lesson {lesson.index + 1} of {lessons.length}
              </p>
              <h1 className="mt-2 text-2xl leading-tight font-extrabold tracking-[-0.02em] sm:text-[1.875rem]">{lesson.title}</h1>
              <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-body">{content.description}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Clock aria-hidden className="size-4" strokeWidth={2} />
                  {lesson.minutes} min
                </span>
                {lessonDone && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                    <CheckCircle2 aria-hidden className="size-4" strokeWidth={2.2} />
                    Completed
                  </span>
                )}
              </p>
            </motion.div>

            {/* Lesson navigation */}
            <div className="mt-6 flex flex-col gap-3 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="secondary"
                icon={ArrowLeft}
                disabled={!previous}
                onClick={() => previous && goTo(previous)}
                className="max-sm:w-full"
              >
                Previous Lesson
              </Button>
              <div className="flex flex-col gap-3 sm:flex-row">
                {!sidebarVisible && (
                  <Button
                    ref={contentButtonRef}
                    variant="secondary"
                    icon={ListVideo}
                    onClick={() => setDrawerOpen(true)}
                    aria-haspopup="dialog"
                    className="max-sm:w-full"
                  >
                    Course Content
                  </Button>
                )}
                {!next && completed ? (
                  <>
                    <span className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                      Course Completed 🎉
                    </span>
                    <Button href="/certificates" icon={Award} arrow className="max-sm:w-full">
                      View Certificate
                    </Button>
                  </>
                ) : !next ? (
                  <Button onClick={completeCurrent} icon={CheckCircle2} className="max-sm:w-full">
                    Complete Course
                  </Button>
                ) : (
                  <Button onClick={goNext} className="max-sm:w-full">
                    Next Lesson <ArrowRight aria-hidden className="size-[18px]" strokeWidth={2.2} />
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-8">
              <LessonTabs course={course} lesson={lesson} active={tab} onChange={setTab} />
            </div>

            <div className="mt-10">
              <InstructorMini name={course.instructor} />
            </div>
          </div>
        </main>

        {sidebarVisible && (
          <aside aria-label="Course content" className="sticky top-16 h-[calc(100dvh-4rem)] border-l border-line bg-white">
            {curriculum}
          </aside>
        )}
      </div>

      <CurriculumDrawer open={drawerOpen && !sidebarVisible} onClose={() => setDrawerOpen(false)} returnFocusRef={contentButtonRef}>
        {curriculum}
      </CurriculumDrawer>
      <ShortcutsDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
