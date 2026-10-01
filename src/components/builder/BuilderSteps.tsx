import type { ReactNode } from 'react';
import { BadgePercent, CalendarRange, Tag } from 'lucide-react';
import type { AccessDuration, CourseLevelOption, CourseVisibility } from '../../types/instructor';
import { COURSE_CATEGORY_OPTIONS, COURSE_LEVEL_OPTIONS } from '../../data/instructor';
import {
  DESCRIPTION_MIN,
  LANGUAGES,
  MAX_OBJECTIVES,
  MAX_REQUIREMENTS,
  SUBCATEGORIES,
  SUBTITLE_MAX,
  TARGET_MAX,
  TITLE_MAX,
} from '../../data/courseBuilder';
import { effectivePrice, type CourseDraft } from '../../lib/courseBuilder';
import type { DraftPatch } from '../../hooks/useCourseDraft';
import { cn } from '../../lib/cn';
import { digitsOnly } from '../../lib/checkout';
import { discountPercent, formatPrice } from '../../lib/format';
import { htmlToText } from '../../lib/sanitizeHtml';
import { Field, SelectInput, TextArea, TextInput, fieldDescribedBy } from '../ui/Form';
import { SwitchField } from '../ui/Switch';
import { ListEditor } from './ListEditor';
import { ThumbnailUpload, VideoUpload } from './MediaInputs';
import { RichTextEditor } from './RichTextEditor';

type Update = (patch: DraftPatch) => void;

export function StepCard({
  title,
  description,
  children,
  id,
  className,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cn('rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6', className)}
    >
      <h2 id={id ? `${id}-title` : undefined} className="text-lg font-bold tracking-[-0.01em]">
        {title}
      </h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

const Counter = ({ value, max }: { value: number; max: number }) => (
  <span className={cn('tabular-nums', value > max ? 'text-rose-600' : 'text-muted')}>
    {value}/{max}
  </span>
);

/* ------------------------------------------------------------------ */
/*  Basic information                                                  */
/* ------------------------------------------------------------------ */

export function BasicsStep({ draft, update, showErrors }: { draft: CourseDraft; update: Update; showErrors: boolean }) {
  const title = draft.title.trim();
  const descriptionLength = htmlToText(draft.description).length;
  const errors = showErrors
    ? {
        title:
          title.length < 8
            ? 'Use at least 8 characters'
            : title.length > TITLE_MAX
              ? `Keep it under ${TITLE_MAX} characters`
              : undefined,
        subtitle: draft.subtitle.trim().length < 10 ? 'Add a subtitle (at least 10 characters)' : undefined,
        description: descriptionLength < DESCRIPTION_MIN ? `Write at least ${DESCRIPTION_MIN} characters` : undefined,
        category: draft.category ? undefined : 'Choose a category',
        subcategory: draft.category && !draft.subcategory ? 'Choose a subcategory' : undefined,
        thumbnail: draft.thumbnail ? undefined : 'Upload a course thumbnail',
      }
    : {};
  const subcategories = SUBCATEGORIES[draft.category] ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2rem]">
          Create Your Course
        </h1>
        <p className="mt-1.5 text-[15px] text-body sm:text-base">
          Start with the basics and tell learners what they&apos;ll get from this course.
        </p>
      </div>

      <StepCard id="details" title="Course details">
        <div className="space-y-5">
          <Field
            id="course-title"
            label="Course Title"
            error={errors.title}
            hint={<Counter value={draft.title.length} max={TITLE_MAX} />}
          >
            <TextInput
              id="course-title"
              value={draft.title}
              maxLength={TITLE_MAX + 20}
              placeholder="e.g. The Complete React Development Course"
              onChange={(e) => update({ title: e.target.value })}
              invalid={!!errors.title}
              aria-describedby={fieldDescribedBy('course-title', errors.title, true)}
            />
          </Field>
          <Field
            id="course-subtitle"
            label="Course Subtitle"
            error={errors.subtitle}
            hint={<Counter value={draft.subtitle.length} max={SUBTITLE_MAX} />}
          >
            <TextInput
              id="course-subtitle"
              value={draft.subtitle}
              maxLength={SUBTITLE_MAX + 20}
              placeholder="Learn React from the ground up and build real-world applications."
              onChange={(e) => update({ subtitle: e.target.value })}
              invalid={!!errors.subtitle}
              aria-describedby={fieldDescribedBy('course-subtitle', errors.subtitle, true)}
            />
          </Field>
          <div>
            <p id="course-description-label" className="mb-1.5 text-sm font-medium text-ink">
              Description
            </p>
            <RichTextEditor
              id="course-description"
              labelledBy="course-description-label"
              describedBy="course-description-hint"
              value={draft.description}
              onChange={(description) => update({ description })}
              placeholder="Describe what the course covers, how it's taught and what learners will be able to do afterwards."
              invalid={!!errors.description}
              minHeight="min-h-56"
            />
            <p
              id="course-description-hint"
              className={cn('mt-1.5 text-xs', errors.description ? 'font-medium text-rose-600' : 'text-muted')}
            >
              {errors.description ?? `${descriptionLength} characters · at least ${DESCRIPTION_MIN}`}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="course-category" label="Category" error={errors.category}>
              <SelectInput
                id="course-category"
                placeholder="Select a category"
                options={COURSE_CATEGORY_OPTIONS}
                value={draft.category}
                onChange={(e) => update({ category: e.target.value, subcategory: '' })}
                invalid={!!errors.category}
              />
            </Field>
            <Field id="course-subcategory" label="Subcategory" error={errors.subcategory}>
              <SelectInput
                id="course-subcategory"
                placeholder={draft.category ? 'Select a subcategory' : 'Choose a category first'}
                options={subcategories}
                value={draft.subcategory}
                disabled={!draft.category}
                onChange={(e) => update({ subcategory: e.target.value })}
                invalid={!!errors.subcategory}
              />
            </Field>
            <Field id="course-level" label="Course Level">
              <SelectInput
                id="course-level"
                options={COURSE_LEVEL_OPTIONS}
                value={draft.level}
                onChange={(e) => update({ level: e.target.value as CourseLevelOption })}
              />
            </Field>
            <Field id="course-language" label="Language">
              <SelectInput
                id="course-language"
                options={LANGUAGES}
                value={draft.language}
                onChange={(e) => update({ language: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </StepCard>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2">
        <StepCard
          id="thumbnail"
          title="Course Thumbnail"
          description="This image represents your course across Hitswork."
        >
          <ThumbnailUpload
            value={draft.thumbnail}
            onChange={(thumbnail) => update({ thumbnail })}
            invalid={!!errors.thumbnail}
          />
          {errors.thumbnail && <p className="mt-2 text-xs font-medium text-rose-600">{errors.thumbnail}</p>}
        </StepCard>

        <StepCard
          id="promo"
          title="Promotional Video"
          description="Optional, but courses with a promo video get more enrollments."
        >
          <VideoUpload
            previewKey={`promo-${draft.id}`}
            value={draft.promoVideo.video}
            onChange={(video) => update((current) => ({ promoVideo: { ...current.promoVideo, video } }))}
            emptyText="Add a short introduction to help learners understand what this course offers."
          />
          <div className="mt-4 space-y-4">
            <Field id="promo-title" label="Video Title" optional>
              <TextInput
                id="promo-title"
                value={draft.promoVideo.title}
                maxLength={80}
                onChange={(e) => update({ promoVideo: { ...draft.promoVideo, title: e.target.value } })}
                placeholder="e.g. Welcome to the course"
              />
            </Field>
            <Field id="promo-description" label="Video Description" optional>
              <TextArea
                id="promo-description"
                rows={2}
                maxLength={300}
                value={draft.promoVideo.description}
                onChange={(e) => update({ promoVideo: { ...draft.promoVideo, description: e.target.value } })}
              />
            </Field>
          </div>
        </StepCard>
      </div>

      <StepCard
        id="objectives"
        title="What Will Students Learn?"
        description="Add at least 4 learning objectives. Start each with what learners will be able to do."
      >
        <ListEditor
          id="objective"
          items={draft.objectives}
          onChange={(objectives) => update({ objectives })}
          max={MAX_OBJECTIVES}
          noun="objectives"
          addLabel="Add Learning Objective"
          placeholders={[
            'Students will learn how to build React applications.',
            'Students will understand component architecture.',
            'Students will work with APIs.',
            'Students will deploy real-world applications.',
            'Add another objective',
          ]}
        />
      </StepCard>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2">
        <StepCard id="requirements" title="Requirements" description="What do learners need before starting?">
          <ListEditor
            id="requirement"
            items={draft.requirements}
            onChange={(requirements) => update({ requirements })}
            max={MAX_REQUIREMENTS}
            noun="requirements"
            addLabel="Add Requirement"
            placeholders={[
              'Basic JavaScript knowledge',
              'A computer with internet access',
              'Willingness to learn',
              'Add another requirement',
            ]}
          />
        </StepCard>

        <StepCard id="audience" title="Who Is This Course For?">
          <Field
            id="course-audience"
            label="Target students"
            hint={<Counter value={draft.targetStudents.length} max={TARGET_MAX} />}
          >
            <TextArea
              id="course-audience"
              rows={6}
              maxLength={TARGET_MAX}
              value={draft.targetStudents}
              onChange={(e) => update({ targetStudents: e.target.value })}
              placeholder="Describe who will benefit most from this course. Put each audience on its own line."
              aria-describedby="course-audience-hint"
            />
          </Field>
        </StepCard>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing                                                            */
/* ------------------------------------------------------------------ */

const rupeeInput = (value: number) => (value ? String(value) : '');
const toRupees = (raw: string) => Math.min(999_999, Number(digitsOnly(raw)) || 0);

export function PricingStep({
  draft,
  update,
  showErrors,
}: {
  draft: CourseDraft;
  update: Update;
  showErrors: boolean;
}) {
  const paid = draft.pricing === 'paid';
  const discount = discountPercent(draft.price, draft.originalPrice);
  const today = new Date().toISOString().slice(0, 10);
  const current = effectivePrice(draft, today);
  const errors =
    showErrors && paid
      ? {
          price: !draft.price || draft.price < 199 ? 'Paid courses cost at least ₹199' : undefined,
          original:
            draft.originalPrice && draft.originalPrice < draft.price ? 'Must be higher than the price' : undefined,
          promo:
            draft.promotion && (!draft.promotion.price || draft.promotion.price >= draft.price)
              ? 'Must be lower than the price'
              : undefined,
          dates:
            draft.promotion && (!draft.promotion.startDate || !draft.promotion.endDate)
              ? 'Choose start and end dates'
              : draft.promotion && draft.promotion.endDate < draft.promotion.startDate
                ? 'End date must be after the start date'
                : undefined,
        }
      : {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2rem]">
          Course Pricing
        </h1>
        <p className="mt-1.5 text-[15px] text-body sm:text-base">Set what learners pay. You can change it any time.</p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <StepCard id="price" title="Price">
          <fieldset>
            <legend className="sr-only">Pricing type</legend>
            <div className="grid grid-cols-2 gap-3">
              {(['free', 'paid'] as const).map((option) => (
                <label
                  key={option}
                  className={cn(
                    'flex cursor-pointer flex-col rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100',
                    draft.pricing === option ? 'border-brand-300 bg-brand-50/60' : 'border-line hover:border-brand-200',
                  )}
                >
                  <input
                    type="radio"
                    name="pricing"
                    className="sr-only"
                    checked={draft.pricing === option}
                    onChange={() => update({ pricing: option })}
                  />
                  <span className="font-semibold text-ink capitalize">{option}</span>
                  <span className="text-xs text-muted">
                    {option === 'free' ? 'Anyone can enroll at no cost' : 'Learners pay to enroll'}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {paid && (
            <div className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="price-amount" label="Price" error={errors.price}>
                  <TextInput
                    id="price-amount"
                    inputMode="numeric"
                    leading="₹"
                    padding="pl-9 pr-4"
                    placeholder="6999"
                    value={rupeeInput(draft.price)}
                    onChange={(e) => update({ price: toRupees(e.target.value) })}
                    invalid={!!errors.price}
                    aria-describedby={fieldDescribedBy('price-amount', errors.price)}
                  />
                </Field>
                <Field id="price-original" label="Original Price" optional error={errors.original}>
                  <TextInput
                    id="price-original"
                    inputMode="numeric"
                    leading="₹"
                    padding="pl-9 pr-4"
                    placeholder="12999"
                    value={rupeeInput(draft.originalPrice)}
                    onChange={(e) => update({ originalPrice: toRupees(e.target.value) })}
                    invalid={!!errors.original}
                    aria-describedby={fieldDescribedBy('price-original', errors.original)}
                  />
                </Field>
                <div>
                  <p className="mb-1.5 text-sm font-medium text-ink">Discount</p>
                  <p className="flex h-12 items-center rounded-xl bg-canvas px-4 text-[15px] font-semibold text-ink ring-1 ring-line">
                    {discount ? `${discount}%` : '—'}
                  </p>
                </div>
                <div>
                  <p className="mb-1.5 text-sm font-medium text-ink">Currency</p>
                  <p className="flex h-12 items-center rounded-xl bg-canvas px-4 text-[15px] font-semibold text-ink ring-1 ring-line">
                    INR (₹)
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-line p-4">
                <SwitchField
                  label="Promotional price"
                  description="Run a limited-time offer between two dates."
                  checked={!!draft.promotion}
                  onChange={(on) =>
                    update({
                      promotion: on
                        ? { price: Math.max(0, Math.round(draft.price * 0.8)), startDate: today, endDate: '' }
                        : null,
                    })
                  }
                />
                {draft.promotion && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <Field id="promo-price" label="Promo price" error={errors.promo}>
                      <TextInput
                        id="promo-price"
                        inputMode="numeric"
                        leading="₹"
                        padding="pl-9 pr-4"
                        value={rupeeInput(draft.promotion.price)}
                        onChange={(e) =>
                          update({ promotion: { ...draft.promotion!, price: toRupees(e.target.value) } })
                        }
                        invalid={!!errors.promo}
                      />
                    </Field>
                    <Field id="promo-start" label="Start Date" error={errors.dates}>
                      <TextInput
                        id="promo-start"
                        type="date"
                        value={draft.promotion.startDate}
                        onChange={(e) => update({ promotion: { ...draft.promotion!, startDate: e.target.value } })}
                        invalid={!!errors.dates}
                      />
                    </Field>
                    <Field id="promo-end" label="End Date">
                      <TextInput
                        id="promo-end"
                        type="date"
                        min={draft.promotion.startDate}
                        value={draft.promotion.endDate}
                        onChange={(e) => update({ promotion: { ...draft.promotion!, endDate: e.target.value } })}
                        invalid={!!errors.dates}
                      />
                    </Field>
                  </div>
                )}
              </div>
            </div>
          )}
        </StepCard>

        <aside
          aria-label="Price preview"
          className="self-start rounded-2xl border border-brand-100 bg-linear-to-br from-brand-50 via-white to-grape-50 p-6 lg:sticky lg:top-40"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-700">
            <Tag aria-hidden className="size-4" />
            Live preview
          </p>
          <p className="mt-4 text-xs font-medium tracking-wide text-muted uppercase">Course Price</p>
          <p
            className="mt-1 font-display text-[2.25rem] leading-none font-extrabold tracking-[-0.03em] text-ink"
            data-testid="price-preview"
          >
            {paid ? formatPrice(current) : 'Free'}
          </p>
          {paid && (draft.originalPrice > current || current < draft.price) && (
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-subtle line-through">
                {formatPrice(Math.max(draft.originalPrice, draft.price))}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 ring-1 ring-emerald-100">
                <BadgePercent aria-hidden className="size-3.5" />
                {discountPercent(current, Math.max(draft.originalPrice, draft.price))}% OFF
              </span>
            </p>
          )}
          {paid && draft.promotion?.startDate && draft.promotion.endDate && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
              <CalendarRange aria-hidden className="size-3.5" />
              Promo {formatPrice(draft.promotion.price)} from {draft.promotion.startDate} to {draft.promotion.endDate}
            </p>
          )}
          <p className="mt-5 border-t border-brand-100 pt-4 text-xs leading-relaxed text-muted">
            This is what learners see on the course page. Payments aren’t processed in this demo.
          </p>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

export function SettingsStep({ draft, update }: { draft: CourseDraft; update: Update }) {
  const settings = draft.settings;
  const set = (patch: Partial<CourseDraft['settings']>) => update({ settings: { ...settings, ...patch } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2rem]">
          Course Settings
        </h1>
        <p className="mt-1.5 text-[15px] text-body sm:text-base">
          Control who can find, join and interact with your course.
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
        <StepCard
          id="visibility"
          title="Course Visibility"
          description="Published and Unlisted take effect once the course is approved."
        >
          <fieldset>
            <legend className="sr-only">Visibility</legend>
            <div className="space-y-2.5">
              {(
                [
                  ['Draft', 'Only you can see it'],
                  ['Published', 'Listed in search and the catalog'],
                  ['Unlisted', 'Only people with the link can find it'],
                ] as [CourseVisibility, string][]
              ).map(([value, hint]) => (
                <label
                  key={value}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100',
                    settings.visibility === value
                      ? 'border-brand-300 bg-brand-50/60'
                      : 'border-line hover:border-brand-200',
                  )}
                >
                  <input
                    type="radio"
                    name="visibility"
                    checked={settings.visibility === value}
                    onChange={() => set({ visibility: value })}
                    className="size-4 accent-brand-600"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{value}</span>
                    <span className="block text-xs text-muted">{hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </StepCard>

        <StepCard id="access" title="Access">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">Course access</legend>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ['lifetime', 'Lifetime Access'],
                  ['limited', 'Limited Access'],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={cn(
                    'flex h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100',
                    settings.access === value
                      ? 'border-brand-300 bg-brand-50 text-brand-700'
                      : 'border-line-strong text-body hover:border-brand-200',
                  )}
                >
                  <input
                    type="radio"
                    name="access"
                    className="sr-only"
                    checked={settings.access === value}
                    onChange={() =>
                      set({ access: value, accessDuration: value === 'lifetime' ? 'Lifetime' : '1 Year' })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <Field id="access-duration" label="Duration" className="mt-4">
            <SelectInput
              id="access-duration"
              options={settings.access === 'lifetime' ? ['Lifetime'] : ['30 Days', '90 Days', '1 Year']}
              value={settings.accessDuration}
              disabled={settings.access === 'lifetime'}
              onChange={(e) => set({ accessDuration: e.target.value as AccessDuration })}
            />
          </Field>
        </StepCard>

        <StepCard id="engagement" title="Enrollment & Certificate">
          <div className="space-y-5">
            <SwitchField
              label="Allow New Enrollments"
              description="Turn off to pause sign-ups without unpublishing."
              checked={settings.allowEnrollments}
              onChange={(allowEnrollments) => set({ allowEnrollments })}
            />
            <SwitchField
              label="Enable Certificate"
              description="Learners get a certificate when they complete the course."
              checked={settings.certificate}
              onChange={(certificate) => set({ certificate })}
            />
            <Field id="completion-requirement" label="Completion Requirement">
              <SelectInput
                id="completion-requirement"
                options={['100%', '90%', '80%', '70%']}
                value={`${settings.completionRequirement}%`}
                disabled={!settings.certificate}
                onChange={(e) => set({ completionRequirement: Number.parseInt(e.target.value, 10) })}
              />
            </Field>
          </div>
        </StepCard>

        <StepCard id="community" title="Comments & Reviews">
          <div className="space-y-5">
            <SwitchField
              label="Allow Student Comments"
              description="Learners can ask questions under lessons."
              checked={settings.allowComments}
              onChange={(allowComments) => set({ allowComments })}
            />
            <SwitchField
              label="Allow Student Reviews"
              description="Learners can rate and review the course."
              checked={settings.allowReviews}
              onChange={(allowReviews) => set({ allowReviews })}
            />
          </div>
        </StepCard>
      </div>
    </div>
  );
}
