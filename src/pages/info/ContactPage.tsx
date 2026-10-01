import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Clock3, LifeBuoy, Loader2, Mail } from 'lucide-react';
import { contactTopics, supportChannels } from '../../data/support';
import { useAuth } from '../../context/AuthContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useForm } from '../../hooks/useForm';
import { simulateRequest } from '../../lib/auth';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { formatDate } from '../../lib/format';
import {
  SUPPORT_MESSAGE_MAX_LENGTH,
  SUPPORT_MESSAGE_MIN_LENGTH,
  clearTicket,
  loadTicket,
  saveTicket,
  supportFieldOrder,
  validateSupportMessage,
  type SupportField,
  type SupportMessageForm,
  type SupportTicket,
} from '../../lib/supportMessage';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import { Field, SelectInput, TextArea, TextInput, fieldDescribedBy } from '../../components/ui/Form';
import { RevealGroup, RevealItem, easeOutSoft } from '../../components/ui/Reveal';
import { PendingStatus, SubmissionSuccess } from '../../components/ui/SubmissionSuccess';

const idFor = (field: SupportField) => `contact-${field}`;

function ContactForm({ onSubmitted }: { onSubmitted: (ticket: SupportTicket) => void }) {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const presetTopic = contactTopics.find((topic) => topic === params.get('topic')) ?? '';
  const { values, setValue, touch, visibleErrors, attemptSubmit } = useForm<SupportMessageForm>(
    { name: user?.name ?? '', email: user?.email ?? '', topic: presetTopic, message: '' },
    validateSupportMessage,
  );
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending || !attemptSubmit(supportFieldOrder, idFor)) return;
    setPending(true);
    await simulateRequest(900);
    onSubmitted(saveTicket(values));
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="contact-form-title"
      className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8"
    >
      <div className="border-b border-line pb-5">
        <h2 id="contact-form-title" className="text-xl font-bold tracking-[-0.015em]">
          Send us a message
        </h2>
        <p className="mt-1 text-sm text-muted">Tell us what’s going on and we’ll point you in the right direction.</p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id={idFor('name')} label="Full Name" error={visibleErrors.name}>
          <TextInput
            id={idFor('name')}
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={(e) => setValue('name', e.target.value)}
            onBlur={() => touch('name')}
            invalid={!!visibleErrors.name}
            aria-describedby={fieldDescribedBy(idFor('name'), visibleErrors.name)}
          />
        </Field>
        <Field id={idFor('email')} label="Email Address" error={visibleErrors.email}>
          <TextInput
            id={idFor('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => setValue('email', e.target.value)}
            onBlur={() => touch('email')}
            invalid={!!visibleErrors.email}
            aria-describedby={fieldDescribedBy(idFor('email'), visibleErrors.email)}
          />
        </Field>
        <Field id={idFor('topic')} label="Topic" error={visibleErrors.topic} className="sm:col-span-2">
          <SelectInput
            id={idFor('topic')}
            placeholder="What do you need help with?"
            options={contactTopics}
            value={values.topic}
            onChange={(e) => {
              setValue('topic', e.target.value);
              touch('topic');
            }}
            onBlur={() => touch('topic')}
            invalid={!!visibleErrors.topic}
            aria-describedby={fieldDescribedBy(idFor('topic'), visibleErrors.topic)}
          />
        </Field>
        <Field
          id={idFor('message')}
          label="Message"
          error={visibleErrors.message}
          hint="Include course names or order IDs if they’re relevant."
          className="sm:col-span-2"
        >
          <TextArea
            id={idFor('message')}
            rows={6}
            maxLength={SUPPORT_MESSAGE_MAX_LENGTH}
            placeholder="How can we help?"
            value={values.message}
            onChange={(e) => setValue('message', e.target.value)}
            onBlur={() => touch('message')}
            invalid={!!visibleErrors.message}
            aria-describedby={fieldDescribedBy(idFor('message'), visibleErrors.message, true)}
          />
          <p
            aria-hidden
            className={cn(
              'mt-1.5 text-right text-xs tabular-nums',
              values.message.trim().length >= SUPPORT_MESSAGE_MIN_LENGTH ? 'text-emerald-600' : 'text-muted',
            )}
          >
            {values.message.length} / {SUPPORT_MESSAGE_MAX_LENGTH}
          </p>
        </Field>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted sm:max-w-xs">
          Demo form — messages are saved in this browser only and aren’t emailed anywhere.
        </p>
        <Button
          type="submit"
          size="lg"
          arrow={!pending}
          disabled={pending}
          aria-busy={pending}
          className="max-sm:w-full"
        >
          {pending ? (
            <>
              <Loader2 aria-hidden className="size-[18px] animate-spin" />
              Sending…
            </>
          ) : (
            'Send Message'
          )}
        </Button>
      </div>
    </form>
  );
}

function ContactDetails() {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold">Contact details</h2>
        <ul className="mt-5 space-y-4">
          {supportChannels.map(({ detailLabel: label, email }) => (
            <li key={label} className="flex items-start gap-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Mail aria-hidden className="size-[18px]" strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted">{label}</p>
                <p className="truncate font-semibold text-ink">{email}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-100">
          Example addresses for this demo — please use the form, which works today.
        </p>
      </div>

      <div className="rounded-3xl border border-line bg-canvas p-6">
        <div className="flex items-start gap-3.5">
          <Clock3 aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-600" strokeWidth={1.9} />
          <div>
            <p className="font-semibold text-ink">Looking for a quick answer?</p>
            <p className="mt-1 text-sm leading-relaxed text-body">
              Many questions about courses, payments and accounts are answered in our Help Center.
            </p>
            <AppLink
              href="/help"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Visit Help Center
              <ArrowRight aria-hidden className="size-4" strokeWidth={2.2} />
            </AppLink>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function ContactPage() {
  usePageMeta(
    'Contact Hitswork — We’re Here to Help',
    'Questions about courses, your account, teaching or business solutions? Contact the Hitswork team and we’ll help.',
  );
  const [ticket, setTicket] = useState<SupportTicket | null>(loadTicket);

  const onSubmitted = (submitted: SupportTicket) => {
    setTicket(submitted);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const onReset = () => {
    clearTicket();
    setTicket(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (ticket) {
    return (
      <SubmissionSuccess
        title="Message Sent Successfully"
        emoji="✓"
        message="Thanks for contacting Hitswork. Our support team will review your message."
        referenceLabel="Ticket Number"
        referenceId={ticket.id}
        details={[
          { label: 'Topic', value: ticket.topic },
          { label: 'Name', value: ticket.name },
          { label: 'Submitted', value: formatDate(ticket.submittedAt.slice(0, 10)) },
          { label: 'Status', value: <PendingStatus>Open</PendingStatus> },
        ]}
        note={
          <>
            Replies will go to <span className="font-semibold break-all text-ink">{ticket.email}</span>. Keep your
            ticket number handy if you contact us again about this.
          </>
        }
        resetLabel="Send another message"
        backLabel="Back to Home"
        onReset={onReset}
      />
    );
  }

  return (
    <>
      <section aria-labelledby="contact-title" className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-brand-50/80 via-grape-50/30 to-white" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_45%_80%_at_85%_0%,black,transparent)]"
        />
        <Container className="pt-12 pb-14 sm:pt-16 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutSoft }}
            className="max-w-2xl"
          >
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">
              <LifeBuoy aria-hidden className="size-4" strokeWidth={2} />
              Contact Us
            </p>
            <h1
              id="contact-title"
              className="mt-4 text-[2.5rem] leading-[1.06] font-extrabold tracking-[-0.032em] sm:text-[3.25rem]"
            >
              How Can We Help?
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-body sm:text-lg">
              Have a question about courses, your account, teaching, or business solutions? We’re here to help.
            </p>
          </motion.div>

          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3">
            {supportChannels.map((channel) => {
              const accent = accents[channel.accent];
              const Icon = channel.icon;
              return (
                <RevealItem key={channel.title} className="h-full">
                  <article className="group flex h-full flex-col rounded-3xl border border-line bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-1 hover:border-brand-100 hover:shadow-card-hover">
                    <span className={cn('grid size-12 place-items-center rounded-2xl', accent.soft)}>
                      <Icon aria-hidden className={cn('size-[22px]', accent.text)} strokeWidth={1.9} />
                    </span>
                    <h2 className="mt-5 text-lg font-bold tracking-[-0.01em]">{channel.title}</h2>
                    <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-body">{channel.description}</p>
                    <AppLink
                      href={channel.link.href}
                      className="mt-5 inline-flex items-center gap-1.5 self-start rounded-md text-sm font-semibold text-brand-600 hover:text-brand-700"
                    >
                      {channel.link.label}
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        strokeWidth={2.2}
                      />
                    </AppLink>
                  </article>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </section>

      <Container className="grid grid-cols-[minmax(0,1fr)] gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <ContactForm onSubmitted={onSubmitted} />
        <ContactDetails />
      </Container>
    </>
  );
}
