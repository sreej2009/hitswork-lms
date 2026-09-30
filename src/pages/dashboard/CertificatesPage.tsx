import { useMemo } from 'react';
import { Award, Eye } from 'lucide-react';
import type { Certificate } from '../../types';
import { courses } from '../../data/courses';
import { useLearning } from '../../context/LearningContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { formatDate } from '../../lib/format';
import { DownloadCertificateButton } from '../../components/dashboard/CertificateActions';
import { CertificateArtwork, type CertificateView } from '../../components/dashboard/CertificateArtwork';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { EmptyState } from '../../components/dashboard/Widgets';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { RevealGroup, RevealItem } from '../../components/ui/Reveal';

/** Joins a stored certificate with its course details for display. */
export function toCertificateView(certificate: Certificate): CertificateView | null {
  const course = courses.find((c) => c.id === certificate.courseId);
  if (!course) return null;
  return {
    id: certificate.id,
    recipientName: certificate.recipientName,
    courseTitle: course.title,
    instructor: course.instructor,
    hours: course.hours,
    issuedAt: certificate.issuedAt,
  };
}

export function CertificatesPage() {
  useDocumentTitle('Certificates — Hitswork');
  const { certificates } = useLearning();
  const views = useMemo(
    () =>
      certificates
        .map(toCertificateView)
        .filter((view): view is CertificateView => view !== null)
        .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)),
    [certificates],
  );

  return (
    <>
      <DashboardHeader title="My Certificates" subtitle="Celebrate your learning achievements." />
      {views.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          text="Finish a course to earn a certificate of completion you can download and share."
          action={
            <Button href="/my-learning" arrow>
              Continue Learning
            </Button>
          }
        />
      ) : (
        <RevealGroup className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {views.map((view) => (
            <RevealItem key={view.id} className="h-full">
              <article className="group flex h-full flex-col rounded-[20px] border border-line bg-white p-4 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
                <AppLink
                  href={`/certificates/${view.id}`}
                  tabIndex={-1}
                  aria-hidden
                  className="block overflow-hidden rounded-xl ring-1 ring-line transition-transform duration-300 group-hover:-translate-y-0.5"
                >
                  <CertificateArtwork certificate={view} />
                </AppLink>
                <div className="flex flex-1 flex-col px-1 pt-4">
                  <h2 className="line-clamp-2 font-display text-base leading-snug font-bold">
                    <AppLink href={`/certificates/${view.id}`} className="transition-colors hover:text-brand-700">
                      {view.courseTitle}
                    </AppLink>
                  </h2>
                  <p className="mt-1 text-sm text-muted">{view.instructor}</p>
                  <p className="mt-2 text-xs text-muted">Completed {formatDate(view.issuedAt.slice(0, 10))}</p>
                  <div className="min-h-4 flex-1" />
                  <div className="grid gap-2.5">
                    <Button href={`/certificates/${view.id}`} variant="soft" icon={Eye} fullWidth>
                      View Certificate
                    </Button>
                    <DownloadCertificateButton certificate={view} fullWidth />
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </>
  );
}
