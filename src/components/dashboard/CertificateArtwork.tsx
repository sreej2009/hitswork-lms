import { cn } from '../../lib/cn';
import { formatDate } from '../../lib/format';

export interface CertificateView {
  id: string;
  recipientName: string;
  courseTitle: string;
  instructor: string;
  hours: number;
  /** ISO timestamp */
  issuedAt: string;
}

const LOGO_SRC = `${import.meta.env.BASE_URL}images/Hitswork.png`;

/**
 * Certificate of Completion. Sizes use container query units (cqw), so the same markup renders as a
 * thumbnail or full size. The PDF download (lib/certificatePdf.ts) draws the same layout on a canvas.
 */
export function CertificateArtwork({ certificate, className }: { certificate: CertificateView; className?: string }) {
  const date = formatDate(certificate.issuedAt.slice(0, 10));
  return (
    <div className={cn('@container', className)}>
      <div
        role="img"
        aria-label={`Certificate of Completion for ${certificate.courseTitle}, presented to ${certificate.recipientName} on ${date}`}
        className="relative aspect-[1.414] w-full overflow-hidden bg-[#fdfcff] text-ink select-none"
      >
        {/* Frame */}
        <div aria-hidden className="absolute inset-[2.2cqw] border-[0.25cqw] border-brand-200" />
        <div aria-hidden className="absolute inset-[3cqw] border-[0.1cqw] border-brand-100" />
        <div aria-hidden className="absolute -top-[18cqw] -right-[14cqw] size-[40cqw] rounded-full bg-brand-100/60 blur-[5cqw]" />
        <div aria-hidden className="absolute -bottom-[20cqw] -left-[14cqw] size-[42cqw] rounded-full bg-grape-100/70 blur-[5cqw]" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-[1cqw] bg-brand-gradient" />

        <div aria-hidden className="relative flex h-full flex-col items-center px-[8cqw] pt-[6.5cqw] pb-[5.5cqw] text-center">
          <img src={LOGO_SRC} alt="" className="h-[6cqw] w-auto" draggable={false} />
          <p className="mt-[2.2cqw] font-display text-[1.6cqw] font-bold tracking-[0.42em] text-brand-600 uppercase">
            Certificate of Completion
          </p>
          {/* The recipient block is centred in the space between the heading and the signature row. */}
          <div className="flex w-full flex-1 flex-col items-center justify-center pb-[2cqw]">
            <p className="text-[1.45cqw] text-body">This certificate is proudly presented to</p>
            <p className="mt-[1cqw] max-w-full truncate font-serif text-[5.6cqw] leading-[1.15] font-semibold text-ink italic">
              {certificate.recipientName}
            </p>
            <div className="mt-[0.8cqw] h-[0.12cqw] w-[34cqw] bg-linear-to-r from-transparent via-brand-300 to-transparent" />
            <p className="mt-[2.2cqw] text-[1.45cqw] text-body">for successfully completing</p>
            <p className="mt-[0.8cqw] line-clamp-2 max-w-[70cqw] font-display text-[2.5cqw] leading-[1.25] font-extrabold tracking-[-0.01em]">
              {certificate.courseTitle}
            </p>
            <p className="mt-[0.8cqw] text-[1.3cqw] text-muted">
              a {certificate.hours}-hour online course on Hitswork
            </p>
          </div>

          <div className="grid w-full grid-cols-3 items-end">
            <div className="text-left">
              <p className="font-serif text-[2.2cqw] leading-none text-ink italic">{certificate.instructor}</p>
              <div className="mt-[0.8cqw] h-[0.1cqw] w-[20cqw] bg-line-strong" />
              <p className="mt-[0.7cqw] text-[1.15cqw] font-semibold text-ink">{certificate.instructor}</p>
              <p className="text-[1.05cqw] text-muted">Instructor</p>
            </div>
            <div className="flex justify-center">
              <div className="grid size-[10cqw] place-items-center rounded-full bg-brand-gradient p-[0.5cqw] shadow-[0_1cqw_2.5cqw_-1cqw_rgb(79_70_229/0.6)]">
                <div className="flex size-full flex-col items-center justify-center rounded-full border-[0.15cqw] border-white/60 text-white">
                  <span className="font-display text-[1.25cqw] leading-none font-extrabold">HITSWORK</span>
                  <span className="mt-[0.5cqw] text-[0.9cqw] leading-none font-semibold">VERIFIED</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[1.05cqw] text-muted">Completed on</p>
              <p className="text-[1.3cqw] font-semibold text-ink">{date}</p>
              <p className="mt-[1cqw] text-[1.05cqw] text-muted">Certificate ID</p>
              <p className="font-mono text-[1.15cqw] font-semibold tracking-wide text-ink">{certificate.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
