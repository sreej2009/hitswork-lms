import type { Course } from '../types';
import { categories } from '../data/categories';

export const PAGE_SIZE = 9;

export const levelOptions = [
  { id: 'beginner', label: 'Beginner', level: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate', level: 'Intermediate' },
  { id: 'advanced', label: 'Advanced', level: 'Advanced' },
] as const;

export const priceOptions = [
  { id: 'free', label: 'Free' },
  { id: 'paid', label: 'Paid' },
] as const;

export const ratingOptions = [
  { id: '4.5', label: '4.5 & above', min: 4.5 },
  { id: '4.0', label: '4.0 & above', min: 4.0 },
] as const;

export const durationOptions = [
  { id: 'short', label: '0–5 hours', min: 0, max: 5 },
  { id: 'medium', label: '5–20 hours', min: 5, max: 20 },
  { id: 'long', label: '20+ hours', min: 20, max: Infinity },
] as const;

export const sortOptions = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'rated', label: 'Highest Rated' },
  { id: 'reviews', label: 'Most Reviewed' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
] as const;

export type LevelId = (typeof levelOptions)[number]['id'];
export type PriceId = (typeof priceOptions)[number]['id'];
export type RatingId = (typeof ratingOptions)[number]['id'];
export type DurationId = (typeof durationOptions)[number]['id'];
export type SortId = (typeof sortOptions)[number]['id'];

export interface CatalogQuery {
  q: string;
  /** Category id, or 'all' */
  category: string;
  levels: LevelId[];
  prices: PriceId[];
  rating: RatingId | null;
  durations: DurationId[];
  sort: SortId;
  page: number;
}

export type FacetKey = 'levels' | 'prices' | 'rating' | 'durations';

export const defaultQuery: CatalogQuery = {
  q: '',
  category: 'all',
  levels: [],
  prices: [],
  rating: null,
  durations: [],
  sort: 'popular',
  page: 1,
};

// ---------------------------------------------------------------------------
// URL <-> query
// ---------------------------------------------------------------------------

function pickList<T extends string>(raw: string | null, allowed: readonly { id: T }[]): T[] {
  if (!raw) return [];
  const ids = new Set(allowed.map((option) => option.id));
  return raw.split(',').filter((value): value is T => ids.has(value as T));
}

function pickOne<T extends string>(raw: string | null, allowed: readonly { id: T }[]): T | null {
  return allowed.find((option) => option.id === raw)?.id ?? null;
}

/** Reads a query from URL params, ignoring anything invalid. */
export function parseQuery(params: URLSearchParams): CatalogQuery {
  const category = params.get('category');
  const page = Number.parseInt(params.get('page') ?? '', 10);
  return {
    q: params.get('q')?.slice(0, 100) ?? '',
    category: categories.some((c) => c.id === category) ? (category as string) : 'all',
    levels: pickList(params.get('level'), levelOptions),
    prices: pickList(params.get('price'), priceOptions),
    rating: pickOne(params.get('rating'), ratingOptions),
    durations: pickList(params.get('duration'), durationOptions),
    sort: pickOne(params.get('sort'), sortOptions) ?? 'popular',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Serialises a query to URL params, omitting defaults to keep links short. */
export function toParams(query: CatalogQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q.trim()) params.set('q', query.q);
  if (query.category !== 'all') params.set('category', query.category);
  if (query.levels.length) params.set('level', query.levels.join(','));
  if (query.prices.length) params.set('price', query.prices.join(','));
  if (query.rating) params.set('rating', query.rating);
  if (query.durations.length) params.set('duration', query.durations.join(','));
  if (query.sort !== 'popular') params.set('sort', query.sort);
  if (query.page > 1) params.set('page', String(query.page));
  return params;
}

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

const categoryName = (id: string) => categories.find((category) => category.id === id)?.name;

const matchesLevel = (course: Course, id: LevelId) =>
  // "All Levels" courses are suitable for every level filter.
  course.level === 'All Levels' || levelOptions.find((option) => option.id === id)?.level === course.level;

const matchesPrice = (course: Course, id: PriceId) => (id === 'free' ? course.price === 0 : course.price > 0);

const matchesDuration = (course: Course, id: DurationId) => {
  const range = durationOptions.find((option) => option.id === id)!;
  // 0–5 includes 5h; 5–20 starts just above 5h; 20+ starts just above 20h.
  return range.min === 0 ? course.hours <= range.max : course.hours > range.min && course.hours <= range.max;
};

const matchesRating = (course: Course, id: RatingId) =>
  course.rating >= ratingOptions.find((option) => option.id === id)!.min;

function matchesSearch(course: Course, q: string) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const haystack = `${course.title} ${course.instructor} ${course.category}`.toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

/**
 * Applies every active filter. Options within a group combine with OR,
 * groups combine with AND. `ignore` skips one group, which is how facet counts are computed.
 */
export function filterCourses(list: Course[], query: CatalogQuery, ignore?: FacetKey): Course[] {
  const category = query.category === 'all' ? null : categoryName(query.category);
  return list.filter(
    (course) =>
      (!category || course.category === category) &&
      matchesSearch(course, query.q) &&
      (ignore === 'levels' || !query.levels.length || query.levels.some((id) => matchesLevel(course, id))) &&
      (ignore === 'prices' || !query.prices.length || query.prices.some((id) => matchesPrice(course, id))) &&
      (ignore === 'rating' || !query.rating || matchesRating(course, query.rating)) &&
      (ignore === 'durations' || !query.durations.length || query.durations.some((id) => matchesDuration(course, id))),
  );
}

/** How many courses each option in a facet would show, given all the other active filters. */
export function facetCounts(list: Course[], query: CatalogQuery) {
  const count = <T extends string>(key: FacetKey, ids: readonly T[], match: (course: Course, id: T) => boolean) => {
    const base = filterCourses(list, query, key);
    return Object.fromEntries(ids.map((id) => [id, base.filter((course) => match(course, id)).length])) as Record<
      T,
      number
    >;
  };
  return {
    levels: count('levels', levelOptions.map((o) => o.id), matchesLevel),
    prices: count('prices', priceOptions.map((o) => o.id), matchesPrice),
    rating: count('rating', ratingOptions.map((o) => o.id), matchesRating),
    durations: count('durations', durationOptions.map((o) => o.id), matchesDuration),
  };
}

export function sortCourses(list: Course[], sort: SortId): Course[] {
  const sorted = [...list];
  switch (sort) {
    case 'rated':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case 'reviews':
      return sorted.sort((a, b) => b.reviews - a.reviews);
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price || b.students - a.students);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price || b.students - a.students);
    default:
      return sorted.sort((a, b) => b.students - a.students);
  }
}

/** Number of user-set filters (search and category excluded). */
export const activeFilterCount = (query: CatalogQuery) =>
  query.levels.length + query.prices.length + (query.rating ? 1 : 0) + query.durations.length;
