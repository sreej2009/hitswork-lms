import type { HelpArticle } from '../data/help';

/** Lowercase, drop apostrophes ("can’t" → "cant") and turn other punctuation into spaces. */
export const normalise = (text: string) =>
  text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9&]+/g, ' ')
    .trim();

const tokenise = (text: string) => normalise(text).split(' ').filter(Boolean);

/**
 * Ranks help articles for a free-text query. Every word in the query must appear somewhere in the
 * article; matches in the question count most, then keywords, then the answer. When some articles
 * match on their question or keywords, articles that only mention the words in passing are dropped.
 */
export function searchHelp(articles: HelpArticle[], query: string): HelpArticle[] {
  const terms = tokenise(query);
  if (!terms.length) return [];

  const scored = articles.flatMap((article) => {
    const question = normalise(article.question);
    const keywords = normalise((article.keywords ?? []).join(' '));
    const answer = normalise(article.answer);
    let score = 0;
    let strong = false;
    for (const term of terms) {
      const inQuestion = question.includes(term);
      const inKeywords = keywords.includes(term);
      if (!inQuestion && !inKeywords && !answer.includes(term)) return [];
      if (inQuestion || inKeywords) strong = true;
      score += inQuestion ? 3 : inKeywords ? 2 : 1;
    }
    return [{ article, score, strong }];
  });

  const anyStrong = scored.some((result) => result.strong);
  return scored
    .filter((result) => !anyStrong || result.strong)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.article);
}
