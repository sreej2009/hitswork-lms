import { useState } from 'react';
import { Check, Download, Loader2 } from 'lucide-react';
import { downloadCertificatePdf } from '../../lib/certificatePdf';
import { Button } from '../ui/Button';
import type { CertificateView } from './CertificateArtwork';

/** Generates the certificate PDF in the browser, with loading and done states. */
export function DownloadCertificateButton({
  certificate,
  variant = 'secondary',
  fullWidth,
}: {
  certificate: CertificateView;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}) {
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');

  const onClick = async () => {
    setState('working');
    try {
      await downloadCertificatePdf(certificate);
      setState('done');
      window.setTimeout(() => setState('idle'), 2200);
    } catch {
      setState('error');
    }
  };

  return (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={state === 'working'}
      aria-busy={state === 'working'}
      aria-live="polite"
    >
      {state === 'working' ? (
        <Loader2 aria-hidden className="size-[18px] animate-spin" />
      ) : state === 'done' ? (
        <Check aria-hidden className="size-[18px]" strokeWidth={2.6} />
      ) : (
        <Download aria-hidden className="size-[18px]" />
      )}
      {state === 'working'
        ? 'Preparing PDF…'
        : state === 'done'
          ? 'Downloaded'
          : state === 'error'
            ? 'Try again'
            : 'Download Certificate'}
    </Button>
  );
}
