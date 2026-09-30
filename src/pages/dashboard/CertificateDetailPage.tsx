import { useState } from 'react';
import { useParams } from 'react-router';
import { ArrowLeft, Check, Copy, FileSearch } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { formatDate } from '../../lib/format';
import { DownloadCertificateButton } from '../../components/dashboard/CertificateActions';
import { CertificateArtwork } from '../../components/dashboard/CertificateArtwork';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DashboardCard, EmptyState } from '../../components/dashboard/Widgets';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { toCertificateView } from './CertificatesPage';

export function CertificateDetailPage() {
  const { certificateId } = useParams();
  const { certificates } = useLearning();
  const certificate = certificates.find((c) => c.id === certificateId);
  const view = certificate ? toCertificateView(certificate) : null;
  useDocumentTitle(view ? `Certificate — ${view.courseTitle} — Hitswork` : 'Certificate — Hitswork');
  const [copied, setCopied] = useState(false);

  const back = (
    <AppLink href="/certificates" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
      <ArrowLeft aria-hidden className="size-4" strokeWidth={2.2} />
      All certificates
    </AppLink>
  );

  if (!view || !certificate) {
    return (
      <>
        <DashboardHeader title="Certificate" eyebrow={back} />
        <EmptyState
          icon={FileSearch}
          title="Certificate not found"
          text="This certificate doesn’t exist on this account."
          action={
            <Button href="/certificates" variant="secondary">
              View my certificates
            </Button>
          }
        />
      </>
    );
  }

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(view.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable; the ID is visible on the page.
    }
  };

  return (
    <>
      <DashboardHeader title={view.courseTitle} subtitle="Certificate of Completion" eyebrow={back} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-hidden rounded-[20px] border border-line bg-white p-3 shadow-card sm:p-5">
          <div className="overflow-hidden rounded-xl ring-1 ring-line">
            <CertificateArtwork certificate={view} />
          </div>
        </div>
        <DashboardCard className="h-fit">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-muted">Presented to</dt>
              <dd className="mt-0.5 font-semibold text-ink">{view.recipientName}</dd>
            </div>
            <div>
              <dt className="text-muted">Instructor</dt>
              <dd className="mt-0.5 font-semibold text-ink">{view.instructor}</dd>
            </div>
            <div>
              <dt className="text-muted">Completed on</dt>
              <dd className="mt-0.5 font-semibold text-ink">{formatDate(view.issuedAt.slice(0, 10))}</dd>
            </div>
            <div>
              <dt className="text-muted">Certificate ID</dt>
              <dd className="mt-0.5 flex items-center justify-between gap-2">
                <span className="font-mono font-semibold text-ink">{view.id}</span>
                <button
                  type="button"
                  onClick={copyId}
                  aria-label="Copy certificate ID"
                  className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
                >
                  {copied ? <Check aria-hidden className="size-4 text-emerald-600" /> : <Copy aria-hidden className="size-4" />}
                </button>
              </dd>
            </div>
          </dl>
          <div className="mt-6 grid gap-2.5">
            <DownloadCertificateButton certificate={view} variant="primary" fullWidth />
            <Button href={`/course/${certificate.courseId}`} variant="secondary" fullWidth>
              View Course
            </Button>
          </div>
        </DashboardCard>
      </div>
    </>
  );
}
