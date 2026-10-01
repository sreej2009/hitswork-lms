import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { findPublicCourse } from '../../lib/publicCatalog';
import { CourseCard } from '../../components/course/CourseCard';
import { EnrollButton } from '../../components/course-detail/EnrollButton';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { EmptyState } from '../../components/dashboard/Widgets';
import { Button } from '../../components/ui/Button';

export function WishlistPage() {
  useDocumentTitle('Wishlist — Hitswork');
  const { wishlist } = useStore();
  // Keep the order courses were saved in; courses no longer public drop out.
  const saved = useMemo(
    () =>
      [...wishlist].flatMap((id) => {
        const found = findPublicCourse(id);
        return found ? [found.course] : [];
      }),
    [wishlist],
  );

  return (
    <>
      <DashboardHeader
        title="Wishlist"
        subtitle={
          saved.length
            ? `${saved.length} saved ${saved.length === 1 ? 'course' : 'courses'}`
            : 'Courses you’ve saved for later.'
        }
      />
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
        <motion.ul layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Saved courses">
          <AnimatePresence initial={false}>
            {saved.map((course) => (
              <motion.li
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                className="flex flex-col gap-3"
              >
                <CourseCard course={course} className="flex-1" />
                <div className="grid grid-cols-2 gap-2">
                  <Button href={`/course/${course.id}`} variant="secondary" fullWidth>
                    View Course
                  </Button>
                  <EnrollButton course={course} size="md" fullWidth />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </>
  );
}
