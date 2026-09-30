import type { ReactNode } from 'react';
import {
  Eye,
  FileText,
  GripVertical,
  ImagePlus,
  MousePointerClick,
  PenLine,
  PlayCircle,
  Plus,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { Floating } from '../../components/ui/Floating';
import { Reveal } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SmartImage } from '../../components/ui/SmartImage';

const builderSections = [
  { number: '01', title: 'Introduction', lessons: ['Welcome to the course', 'Setting up your tools'] },
  {
    number: '02',
    title: 'Fundamentals',
    lessons: ['Variables & data types', 'Functions and scope', 'Working with arrays'],
  },
  { number: '03', title: 'Advanced Concepts', lessons: ['Async JavaScript', 'Building a real project'] },
];

const builderTabs = ['Details', 'Curriculum', 'Pricing', 'Publish'];

function MockField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-muted uppercase">{label}</p>
      {children}
    </div>
  );
}

function FeatureLabel({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap text-ink shadow-float ring-1 ring-line">
      <span className="grid size-6 place-items-center rounded-full bg-brand-gradient text-white">
        <Icon aria-hidden className="size-3.5" strokeWidth={2.2} />
      </span>
      {children}
    </span>
  );
}

function BuilderMockup() {
  return (
    <div aria-hidden className="overflow-hidden rounded-3xl border border-line bg-white shadow-float">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="text-muted">Course Builder</span>
          <span className="text-subtle">/</span>
          <span className="truncate font-semibold text-ink">Modern JavaScript</span>
          <span className="ml-1 hidden rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 min-[420px]:inline">
            Draft · Saved
          </span>
        </div>
        <div className="flex gap-1 rounded-xl bg-canvas p-1 ring-1 ring-line max-sm:w-full">
          {builderTabs.map((tab) => (
            <span
              key={tab}
              className={cn(
                'rounded-lg px-3 py-1.5 text-center text-xs font-semibold max-sm:flex-1 max-sm:px-1',
                tab === 'Curriculum' ? 'bg-white text-brand-700 shadow-xs' : 'text-muted',
              )}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        {/* Details */}
        <div className="space-y-4">
          <MockField label="Course Title">
            <div className="flex h-11 items-center rounded-xl border border-brand-300 px-3.5 text-sm font-medium text-ink ring-4 ring-brand-100">
              <span className="truncate">Modern JavaScript: From Zero to Pro</span>
              <span className="ml-0.5 h-4 w-px shrink-0 bg-brand-600 motion-safe:animate-pulse" />
            </div>
          </MockField>

          <MockField label="Course Thumbnail">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-brand-50 ring-1 ring-line">
              <SmartImage
                photoId="1517694712202-14dd9538aa97"
                alt=""
                width={480}
                ratio={16 / 9}
                widths={[360, 480, 720]}
                sizes="(min-width: 1024px) 420px, 90vw"
                className="size-full"
              />
              <span className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-xs">
                <ImagePlus className="size-3.5" strokeWidth={2} />
                Replace
              </span>
            </div>
          </MockField>

          <MockField label="Course Description">
            <div className="space-y-2 rounded-xl border border-line p-3.5">
              <div className="h-2 w-full rounded-full bg-line" />
              <div className="h-2 w-[92%] rounded-full bg-line" />
              <div className="h-2 w-[70%] rounded-full bg-line" />
            </div>
          </MockField>
        </div>

        {/* Curriculum */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Curriculum</p>
            <p className="text-[11px] text-muted">3 sections · 7 lessons</p>
          </div>
          <div className="space-y-3">
            {builderSections.map((section, index) => {
              const dragging = index === 1;
              return (
                <div
                  key={section.number}
                  className={cn(
                    'rounded-2xl border bg-white p-3 transition-transform',
                    dragging
                      ? 'relative z-10 -rotate-1 border-brand-200 shadow-card-hover ring-4 ring-brand-50 sm:translate-x-2'
                      : 'border-line',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <GripVertical className={cn('size-4 shrink-0', dragging ? 'text-brand-500' : 'text-subtle')} />
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 font-display text-xs font-bold text-brand-700">
                      {section.number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold tracking-wide text-muted uppercase">
                        Section {section.number}
                      </p>
                      <p className="truncate text-sm font-semibold text-ink">{section.title}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-muted">{section.lessons.length} lessons</span>
                  </div>
                  {index !== 2 && (
                    <ul className="mt-2.5 space-y-1.5 border-t border-line pt-2.5 pl-6">
                      {section.lessons.map((lesson, i) => (
                        <li key={lesson} className="flex items-center gap-2 text-xs text-body">
                          {i === 0 ? (
                            <PlayCircle className="size-3.5 shrink-0 text-brand-500" strokeWidth={2} />
                          ) : (
                            <FileText className="size-3.5 shrink-0 text-subtle" strokeWidth={2} />
                          )}
                          <span className="truncate">{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-200 py-3 text-xs font-semibold text-brand-600">
              <Plus className="size-4" strokeWidth={2.2} />
              Add Section
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas px-4 py-3.5 sm:px-6">
        <p className="text-xs text-muted">All changes saved</p>
        <div className="flex gap-2 max-[380px]:w-full">
          <span className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-line-strong bg-white px-4 text-sm font-semibold text-ink max-[380px]:flex-1">
            <Eye className="size-4" strokeWidth={2} />
            Preview
          </span>
          <span className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-brand-gradient px-4 text-sm font-semibold whitespace-nowrap text-white shadow-brand max-[380px]:flex-1">
            <Rocket className="size-4" strokeWidth={2} />
            Publish Course
          </span>
        </div>
      </div>
    </div>
  );
}

export function CourseCreatorPreview() {
  return (
    <Section labelledBy="creator-title" className="overflow-hidden border-y border-line bg-canvas">
      <Reveal>
        <SectionHeader
          id="creator-title"
          align="center"
          eyebrow="Course Creator"
          title="Your Course. Your Knowledge. Your Way."
          subtitle="Organise lessons, upload videos and preview everything before learners see it — no technical skills needed."
        />
      </Reveal>

      <Reveal delay={0.1} y={32} className="relative mx-auto mt-12 max-w-5xl lg:mt-16">
        <div
          aria-hidden
          className="absolute -inset-x-10 -inset-y-8 -z-10 bg-[radial-gradient(closest-side,rgb(129_140_248/0.22),transparent)]"
        />
        <p className="sr-only">
          Preview of the Hitswork course builder: a course title, thumbnail and description, a curriculum with sections
          for Introduction, Fundamentals and Advanced Concepts, and a Publish Course button.
        </p>
        <BuilderMockup />

        <div className="pointer-events-none hidden xl:block">
          <Floating className="top-[34%] -left-10" duration={6.5}>
            <FeatureLabel icon={PenLine}>Easy Editing</FeatureLabel>
          </Floating>
          <Floating className="top-[20%] -right-10" delay={0.4} duration={7}>
            <FeatureLabel icon={MousePointerClick}>Drag &amp; Drop</FeatureLabel>
          </Floating>
          <Floating className="-bottom-5 left-[38%]" delay={0.8} duration={6}>
            <FeatureLabel icon={Eye}>Preview Before Publishing</FeatureLabel>
          </Floating>
        </div>

        <ul className="mt-8 flex flex-wrap justify-center gap-3 xl:hidden">
          <li>
            <FeatureLabel icon={MousePointerClick}>Drag &amp; Drop</FeatureLabel>
          </li>
          <li>
            <FeatureLabel icon={PenLine}>Easy Editing</FeatureLabel>
          </li>
          <li>
            <FeatureLabel icon={Eye}>Preview Before Publishing</FeatureLabel>
          </li>
        </ul>
      </Reveal>
    </Section>
  );
}
