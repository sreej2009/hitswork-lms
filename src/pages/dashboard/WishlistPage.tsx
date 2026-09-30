import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { courses } from '../../data/courses';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { CourseCard } from '../../components/course/CourseCard';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { EmptyState } from '../../components/dashboard/Widgets';
import { Button } from '../../components/ui/Button';

export function WishlistPage() {
  useDocumentTitle('Wishlist — Hitswork');
  const { wishlist } = useStore();
  // Keep the order courses were saved in.
  const saved = useMemo(() => [...wishlist].flatMap((id) => courses.filter((c) => c.id === id)), [wishlist]);

  return (
    <>
      <DashboardHeader title="My Wishlist" subtitle="Courses you’ve saved for later." />
      {saved.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          text="Save courses you’re interested in and find them here later."
          action={
            <Button href="/courses" arrow>
              Explore Courses
            </Button>
          }
        />
      ) : (
        <>
          <p className="mb-5 text-sm text-muted">
            {saved.length} saved {saved.length === 1 ? 'course' : 'courses'} · tap the heart to remove one
          </p>
          <motion.ul layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence initial={false}>
              {saved.map((course) => (
                <motion.li
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                >
                  <CourseCard course={course} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </>
      )}
    </>
  );
}
