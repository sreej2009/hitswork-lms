import { ArrowRight, Check, Quote } from 'lucide-react';
import {
  adminFeatures,
  businessBenefits,
  businessSolutions,
  businessTestimonials,
  learningPaths,
  trustedCompanies,
} from '../../data/business';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { FeatureCard } from '../../components/feature/FeatureCard';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import { Reveal, RevealGroup, RevealItem } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SmartImage } from '../../components/ui/SmartImage';

export function TrustedBy() {
  return (
    <section aria-labelledby="trusted-title" className="border-y border-line bg-white py-10 sm:py-12">
      <Container>
        <Reveal>
          <h2 id="trusted-title" className="text-center font-sans text-sm font-medium text-muted">
            Trusted by teams building the future
          </h2>
          <ul className="mt-7 grid grid-cols-2 items-center gap-x-6 gap-y-6 min-[480px]:grid-cols-3 lg:grid-cols-6">
            {trustedCompanies.map((company) => (
              <li
                key={company.name}
                className={cn(
                  'text-center text-xl whitespace-nowrap text-slate-400 transition-colors duration-300 select-none hover:text-slate-600 sm:text-2xl',
                  company.style,
                )}
              >
                {company.name}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

export function BusinessBenefits() {
  return (
    <Section labelledBy="benefits-title">
      <Reveal>
        <SectionHeader
          id="benefits-title"
          align="center"
          eyebrow="Why Hitswork for Business"
          title="Everything Your Team Needs to Keep Growing"
          subtitle="From onboarding to advanced skills, give every employee access to learning that moves your business forward."
        />
      </Reveal>
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {businessBenefits.map((benefit, index) => (
          <RevealItem key={benefit.title} className="h-full">
            <FeatureCard feature={benefit} index={index} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export function LearningPaths() {
  return (
    <Section labelledBy="paths-title">
      <Reveal>
        <SectionHeader
          id="paths-title"
          eyebrow="Learning Paths"
          title="Build Learning Paths for Every Role"
          subtitle="Start from curated paths and tailor them to your teams, levels and goals."
        />
      </Reveal>
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {learningPaths.map((path) => {
          const accent = accents[path.accent];
          const Icon = path.icon;
          return (
            <RevealItem key={path.title} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-1 hover:border-brand-100 hover:shadow-card-hover">
                <div
                  aria-hidden
                  className={cn('absolute inset-x-0 top-0 h-28 bg-linear-to-b to-transparent', accent.wash)}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <span
                    className={cn('grid size-12 place-items-center rounded-2xl text-white shadow-xs', accent.gradient)}
                  >
                    <Icon aria-hidden className="size-[22px]" strokeWidth={1.9} />
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink ring-1 ring-line">
                    {path.courses} courses
                  </span>
                </div>
                <h3 className="relative mt-6 text-lg font-bold tracking-[-0.01em]">{path.title}</h3>
                <ul className="relative mt-4 flex-1 space-y-2.5">
                  {path.topics.map((topic, index) => (
                    <li key={topic} className="flex items-center gap-3 text-[15px] text-body">
                      <span
                        className={cn(
                          'grid size-6 shrink-0 place-items-center rounded-full font-display text-[10px] font-bold',
                          accent.soft,
                          accent.text,
                        )}
                      >
                        {index + 1}
                      </span>
                      {topic}
                    </li>
                  ))}
                </ul>
                <AppLink
                  href={path.href}
                  className="mt-6 inline-flex items-center gap-1.5 self-start rounded-md text-sm font-semibold text-brand-600 transition-colors after:absolute after:inset-0 after:rounded-3xl hover:text-brand-700"
                >
                  View Learning Path
                  <span className="sr-only">: {path.title}</span>
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
    </Section>
  );
}

export function AdminFeatures() {
  return (
    <Section labelledBy="admin-title" className="relative isolate overflow-hidden bg-night">
      <div aria-hidden className="absolute -top-40 -left-32 -z-10 size-[30rem] rounded-full bg-brand-600/25 blur-3xl" />
      <div
        aria-hidden
        className="absolute -right-32 -bottom-48 -z-10 size-[30rem] rounded-full bg-grape-600/20 blur-3xl"
      />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal>
          <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-brand-300 uppercase">For L&amp;D Teams</p>
          <h2
            id="admin-title"
            className="text-[1.75rem] leading-[1.15] font-bold tracking-[-0.022em] text-white sm:text-4xl lg:text-[2.5rem]"
          >
            Built for Learning &amp; Development Teams
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">
            The admin controls you need to run training programmes at scale — without spreadsheets or manual follow-ups.
          </p>
          <Button href="/business/contact" arrow variant="white" className="mt-8 max-sm:w-full">
            Talk to Our Team
          </Button>
        </Reveal>
        <RevealGroup className="grid gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-2">
          {adminFeatures.map(({ label, icon: Icon }) => (
            <RevealItem key={label}>
              <div className="flex h-full items-center gap-4 bg-night/95 px-5 py-4 transition-colors hover:bg-[#111a2e]">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-brand-300 ring-1 ring-white/10">
                  <Icon aria-hidden className="size-5" strokeWidth={1.9} />
                </span>
                <span className="text-[15px] font-semibold text-white">{label}</span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

export function BusinessSolutions() {
  return (
    <Section id="solutions" labelledBy="solutions-title" className="bg-canvas">
      <Reveal>
        <SectionHeader
          id="solutions-title"
          align="center"
          eyebrow="Plans"
          title="Solutions for Every Stage"
          subtitle="Every plan is tailored to your team size and goals — talk to us for a quote that fits."
        />
      </Reveal>
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3">
        {businessSolutions.map((solution) => {
          const featured = solution.id === 'growing';
          const Icon = solution.icon;
          return (
            <RevealItem key={solution.id} className="h-full">
              <article
                className={cn(
                  'relative flex h-full flex-col rounded-3xl p-7 transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 sm:p-8',
                  featured
                    ? 'bg-night text-white shadow-[0_30px_60px_-24px_rgb(11_18_32/0.55)]'
                    : 'border border-line bg-white shadow-card hover:shadow-card-hover',
                )}
              >
                {featured && (
                  <span className="absolute top-7 right-7 rounded-full bg-brand-gradient px-3 py-1 text-[11px] font-semibold text-white sm:top-8 sm:right-8">
                    Most popular
                  </span>
                )}
                <span
                  className={cn(
                    'grid size-12 place-items-center rounded-2xl',
                    featured ? 'bg-white/10 text-white ring-1 ring-white/15' : 'bg-brand-50 text-brand-600',
                  )}
                >
                  <Icon aria-hidden className="size-[22px]" strokeWidth={1.9} />
                </span>
                <h3 className={cn('mt-6 text-2xl font-bold tracking-[-0.02em]', featured && 'text-white')}>
                  {solution.title}
                </h3>
                <p className={cn('mt-1 text-sm font-medium', featured ? 'text-brand-300' : 'text-brand-600')}>
                  {solution.audience}
                </p>
                <p className={cn('mt-4 text-[15px] leading-relaxed', featured ? 'text-slate-300' : 'text-body')}>
                  {solution.description}
                </p>
                <ul className={cn('mt-6 flex-1 space-y-3 border-t pt-6', featured ? 'border-white/10' : 'border-line')}>
                  {solution.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3 text-[15px]">
                      <span
                        className={cn(
                          'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
                          featured ? 'bg-brand-500 text-white' : 'bg-emerald-50 text-emerald-600',
                        )}
                      >
                        <Check aria-hidden className="size-3" strokeWidth={3} />
                      </span>
                      <span className={featured ? 'text-slate-200' : 'text-ink'}>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  href={`/business/contact?plan=${solution.id}`}
                  arrow
                  fullWidth
                  variant={featured ? 'white' : 'secondary'}
                  className="mt-8"
                >
                  {solution.cta}
                </Button>
              </article>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}

export function BusinessTestimonials() {
  return (
    <Section labelledBy="testimonials-title">
      <Reveal>
        <SectionHeader
          id="testimonials-title"
          align="center"
          eyebrow="Testimonials"
          title="What Learning Leaders Say"
          subtitle="How L&D and people teams think about building skills at work."
        />
      </Reveal>
      <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {businessTestimonials.map((testimonial, index) => (
          <RevealItem
            key={testimonial.name}
            className={cn(
              'h-full',
              index === 2 && 'md:max-lg:col-span-2 md:max-lg:mx-auto md:max-lg:max-w-[calc(50%-0.75rem)]',
            )}
          >
            <figure className="flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover">
              <Quote aria-hidden className="size-8 text-brand-100" fill="currentColor" strokeWidth={0} />
              <blockquote className="mt-4 flex-1 text-[16px] leading-relaxed text-ink">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3.5 border-t border-line pt-5">
                <SmartImage
                  photoId={testimonial.photoId}
                  alt=""
                  width={48}
                  ratio={1}
                  widths={[48, 96]}
                  sizes="48px"
                  crop="faces"
                  className="size-12 shrink-0 rounded-full"
                />
                <div className="min-w-0 leading-tight">
                  <p className="font-semibold text-ink">{testimonial.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
      <p className="mt-8 text-center text-xs text-muted">
        Illustrative testimonials — names and companies are fictional examples.
      </p>
    </Section>
  );
}
