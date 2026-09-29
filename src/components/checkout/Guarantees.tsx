import { Award, Infinity as InfinityIcon, LockKeyhole, ShieldCheck, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

type GuaranteeId = 'refund' | 'secure' | 'lifetime' | 'certificate';

const items: Record<GuaranteeId, { icon: LucideIcon; label: string }> = {
  refund: { icon: ShieldCheck, label: '30-Day Money-Back Guarantee' },
  secure: { icon: LockKeyhole, label: 'Secure Checkout' },
  lifetime: { icon: InfinityIcon, label: 'Lifetime Course Access' },
  certificate: { icon: Award, label: 'Certificate Included' },
};

export function Guarantees({ show, className }: { show: GuaranteeId[]; className?: string }) {
  return (
    <ul className={cn('space-y-2.5 text-sm text-body', className)}>
      {show.map((id) => {
        const { icon: Icon, label } = items[id];
        return (
          <li key={id} className="flex items-center gap-2.5">
            <Icon aria-hidden className="size-[18px] shrink-0 text-brand-600" strokeWidth={1.9} />
            {label}
          </li>
        );
      })}
    </ul>
  );
}
