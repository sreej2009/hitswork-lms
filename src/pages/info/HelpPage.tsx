import { useDeferredValue, useMemo, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, SearchX, X } from 'lucide-react';
import {
  helpArticles,
  helpCategories,
  popularArticles,
  popularSearches,
  type HelpArticle,
  type HelpCategoryId,
} from '../../data/help';
import { usePageMeta } from '../../hooks/usePageMeta';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { searchHelp } from '../../lib/helpSearch';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import { FaqAccordion } from '../../components/ui/FaqAccordion';
import { GradientCTA } from '../../components/ui/GradientCTA';
import { Reveal, RevealGroup, RevealItem, easeOutSoft } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';

const toFaq = (articles: HelpArticle[]) => articles.map(({ question, answer }) => ({ question, answer }));

const scrollToResults = () =>
  window.requestAnimationFrame(() =>
    document.getElementById('help-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
  );

function HelpHero({ query, onQuery }: { query: string; onQuery: (value: string, scroll?: boolean) => void }) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) scrollToResults();
  };

  return (
    <section aria-labelledby="help-title" className="relative isolate overflow-hidden border-b border-line">
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-brand-50/90 via-grape-50/40 to-white" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black,transparent)]"
      />
      <Container className="pt-14 pb-16 text-center sm:pt-20 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutSoft }}
          className="mx-auto max-w-3xl"
        >
          <p className="text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">Help Center</p>
          <h1
            id="help-title"
            className="mt-4 text-[2.5rem] leading-[1.06] font-extrabold tracking-[-0.032em] sm:text-[3.5rem]"
          >
            How Can We Help?
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-body sm:text-lg">
            Search our guides or browse by topic to find answers fast.
          </p>

          <form role="search" onSubmit={onSubmit} className="relative mx-auto mt-9 max-w-2xl">
            <label htmlFor="help-search" className="sr-only">
              Search for answers
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-subtle"
              strokeWidth={2}
            />
            <input
              id="help-search"
              type="search"
              autoComplete="off"
              enterKeyHint="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Search for answers..."
              aria-describedby="help-search-example"
              className="h-14 w-full rounded-2xl border border-line-strong bg-white pr-14 pl-13 text-base text-ink shadow-card outline-none transition-[border-color,box-shadow] placeholder:text-subtle hover:border-brand-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-100 sm:h-16 sm:text-[17px] [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-muted transition-colors hover:bg-canvas hover:text-ink"
              >
                <X aria-hidden className="size-[18px]" strokeWidth={2.2} />
              </button>
            )}
          </form>
          <p id="help-search-example" className="mt-3 text-sm text-muted">
            For example: “How do I reset my password?”
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-sm font-medium text-muted">Popular:</span>
            {popularSearches.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onQuery(item.query, true)}
                className="min-h-10 rounded-full bg-white px-4 text-sm font-semibold text-ink shadow-xs ring-1 ring-line transition-colors hover:text-brand-700 hover:ring-brand-200"
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function ResultsPanel({
  query,
  category,
  results,
  onClear,
}: {
  query: string;
  category: (typeof helpCategories)[number] | undefined;
  results: HelpArticle[];
  onClear: () => void;
}) {
  const heading = query ? `Results for “${query}”` : category?.title;
  return (
    <motion.section
      id="help-results"
      aria-labelledby="help-results-title"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: easeOutSoft }}
      className="border-b border-line bg-canvas py-12 sm:py-16"
    >
      <Container className="max-w-4xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 id="help-results-title" className="text-2xl font-bold tracking-[-0.02em] break-words sm:text-[1.75rem]">
              {heading}
            </h2>
            <p className="mt-1 text-sm text-muted" aria-live="polite">
              {results.length === 1 ? '1 article' : `${results.length} articles`}
              {category && !query && ` · ${category.description}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft aria-hidden className="size-4" strokeWidth={2.2} />
            All topics
          </button>
        </div>

        <div className="mt-7">
          {results.length > 0 ? (
            <FaqAccordion
              key={query || category?.id}
              items={toFaq(results)}
              defaultOpen={results.length === 1 ? 0 : null}
            />
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-line-strong bg-white px-6 py-12 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <SearchX aria-hidden className="size-6" strokeWidth={1.9} />
              </span>
              <p className="mt-5 text-lg font-bold text-ink">No articles found.</p>
              <p className="mt-1.5 max-w-sm text-[15px] text-body">
                Try a different search or contact our support team.
              </p>
              <Button href="/contact" arrow className="mt-6 max-sm:w-full">
                Contact Support
              </Button>
            </div>
          )}
        </div>
      </Container>
    </motion.section>
  );
}

function HelpCategories({ active, onSelect }: { active?: HelpCategoryId; onSelect: (id: HelpCategoryId) => void }) {
  const counts = useMemo(
    () =>
      Object.fromEntries(
        helpCategories.map((c) => [c.id, helpArticles.filter((article) => article.category === c.id).length]),
      ),
    [],
  );
  return (
    <Section labelledBy="help-categories-title">
      <Reveal>
        <SectionHeader
          id="help-categories-title"
          align="center"
          eyebrow="Browse Topics"
          title="Find Help by Topic"
          subtitle="Pick a topic to see every guide in it."
        />
      </Reveal>
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {helpCategories.map((category) => {
          const accent = accents[category.accent];
          const Icon = category.icon;
          const selected = active === category.id;
          return (
            <RevealItem key={category.id} className="h-full">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(category.id)}
                className={cn(
                  'group flex h-full w-full flex-col rounded-3xl border bg-white p-6 text-left shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover sm:p-7',
                  selected ? 'border-brand-300 ring-4 ring-brand-50' : 'border-line hover:border-brand-100',
                )}
              >
                <span className="flex w-full items-start justify-between gap-3">
                  <span className={cn('grid size-12 place-items-center rounded-2xl', accent.soft)}>
                    <Icon aria-hidden className={cn('size-[22px]', accent.text)} strokeWidth={1.9} />
                  </span>
                  <span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-medium text-muted ring-1 ring-line">
                    {counts[category.id]} articles
                  </span>
                </span>
                <span className="mt-6 font-display text-lg font-bold tracking-[-0.01em] text-ink">
                  {category.title}
                </span>
                <span className="mt-1.5 flex-1 text-[15px] leading-relaxed text-body">{category.description}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                  View articles
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    strokeWidth={2.2}
                  />
                </span>
              </button>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}

function PopularQuestions() {
  return (
    <Section labelledBy="popular-title" className="border-t border-line bg-canvas">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeader
            id="popular-title"
            align="center"
            eyebrow="FAQ"
            title="Popular Questions"
            subtitle="Quick answers to the questions we hear most."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <FaqAccordion items={toFaq(popularArticles)} defaultOpen={null} />
        </Reveal>
      </div>
    </Section>
  );
}

export function HelpPage() {
  usePageMeta(
    'Hitswork Help Center — Find Answers',
    'Find answers about getting started, courses, payments, your account, teaching and business on Hitswork.',
  );
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const categoryId = params.get('category');
  const category = helpCategories.find((c) => c.id === categoryId);
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    if (deferredQuery.trim()) return searchHelp(helpArticles, deferredQuery);
    if (category) return helpArticles.filter((article) => article.category === category.id);
    return [];
  }, [deferredQuery, category]);

  // Search text and topic live in the URL so results can be shared; typing replaces history instead of adding to it.
  const update = (next: { q?: string; category?: string }) =>
    setParams(
      (current) => {
        const draft = new URLSearchParams(current);
        for (const [key, value] of Object.entries(next)) {
          if (value) draft.set(key, value);
          else draft.delete(key);
        }
        return draft;
      },
      { replace: true, preventScrollReset: true },
    );

  const onQuery = (value: string, scroll = false) => {
    update({ q: value, category: '' });
    if (scroll && value) scrollToResults();
  };

  const onSelectCategory = (id: HelpCategoryId) => {
    update({ q: '', category: id });
    scrollToResults();
  };

  const showResults = !!query.trim() || !!category;

  return (
    <>
      <HelpHero query={query} onQuery={onQuery} />
      <AnimatePresence initial={false}>
        {showResults && (
          <ResultsPanel
            key="results"
            query={deferredQuery.trim()}
            category={query.trim() ? undefined : category}
            results={results}
            onClear={() => update({ q: '', category: '' })}
          />
        )}
      </AnimatePresence>
      <HelpCategories active={query.trim() ? undefined : category?.id} onSelect={onSelectCategory} />
      <PopularQuestions />
      <div className="pt-16 sm:pt-20 lg:pt-24">
        <GradientCTA
          id="help-cta-title"
          title="Still Need Help?"
          text="Our support team is ready to help."
          primary={{ label: 'Contact Support', href: '/contact' }}
          secondary={{ label: 'Back to Hitswork', href: '/', arrow: true }}
        />
      </div>
    </>
  );
}
