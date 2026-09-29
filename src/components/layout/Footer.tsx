import { useId, useState, type FormEvent } from 'react';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { footerColumns, legalLinks } from '../../data/navigation';
import type { FooterColumn as FooterColumnData } from '../../types';
import { cn } from '../../lib/cn';
import { socialLinks } from '../icons/SocialIcons';
import { AppLink } from '../ui/AppLink';
import { Container } from '../ui/Container';
import { Logo } from '../ui/Logo';

/** Link column — a collapsible accordion on mobile, always open from `md` up. */
function FooterColumn({ column }: { column: FooterColumnData }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  return (
    <div className="border-b border-white/[0.07] md:border-0">
      <h3 className="font-sans text-sm font-semibold text-white">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between py-4 text-left md:pointer-events-none md:py-0"
        >
          {column.title}
          <ChevronDown
            aria-hidden
            className={cn('size-4 text-slate-500 transition-transform duration-200 md:hidden', open && 'rotate-180')}
          />
        </button>
      </h3>
      <ul id={listId} className={cn('space-y-3 pb-5 md:mt-5 md:block md:pb-0', open ? 'block' : 'hidden')}>
        {column.links.map((link) => (
          <li key={link.label}>
            <AppLink href={link.href} className="text-sm text-slate-400 transition-colors hover:text-white">
              {link.label}
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Newsletter() {
  const inputId = useId();
  const [subscribed, setSubscribed] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (event.currentTarget.checkValidity()) setSubscribed(true);
  };

  return (
    <div className="pt-8 md:pt-0">
      <h3 className="font-sans text-sm font-semibold text-white">Newsletter</h3>
      <p className="mt-5 text-sm leading-relaxed text-slate-400">Get the latest updates and offers.</p>
      <form onSubmit={onSubmit} className="mt-4">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-1.5 transition-colors focus-within:border-brand-400/60 focus-within:bg-white/[0.06]">
          <input
            id={inputId}
            type="email"
            required
            disabled={subscribed}
            placeholder="Enter your email"
            className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            aria-label={subscribed ? 'Subscribed' : 'Subscribe'}
            disabled={subscribed}
            className="group grid size-10 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-brand transition-[filter] hover:brightness-110"
          >
            {subscribed ? (
              <Check aria-hidden className="size-[18px]" strokeWidth={2.4} />
            ) : (
              <ArrowRight aria-hidden className="size-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
            )}
          </button>
        </div>
        <p aria-live="polite" className="mt-2.5 min-h-5 text-xs text-slate-500">
          {subscribed ? 'Thanks — you’re on the list.' : 'No spam. Unsubscribe anytime.'}
        </p>
      </form>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-night text-slate-400">
      <Container className="pt-16 pb-8 lg:pt-20">
        <div className="grid gap-y-2 md:grid-cols-3 md:gap-x-10 md:gap-y-12 xl:grid-cols-[1.45fr_1fr_1fr_1fr_1.4fr] xl:gap-x-12">
          <div className="pb-8 md:col-span-3 md:pb-0 xl:col-span-1">
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
              Empowering learners worldwide with quality education and skills for the future.
            </p>
            <ul className="mt-6 flex gap-2.5" aria-label="Hitswork on social media">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400/50 hover:bg-brand-500/15 hover:text-white"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerColumns.map((column) => (
            <FooterColumn key={column.title} column={column} />
          ))}

          <div className="md:col-span-3 xl:col-span-1">
            <Newsletter />
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse gap-4 border-t border-white/[0.07] pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-500">© 2026 Hitswork. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <AppLink href={link.href} className="text-slate-400 transition-colors hover:text-white">
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
