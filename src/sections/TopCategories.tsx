import { topCategories } from '../data/categories';
import { CategoryCard } from '../components/category/CategoryCard';
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TextLink } from '../components/ui/TextLink';

export function TopCategories() {
  return (
    <Section id="categories" labelledBy="top-categories-title">
      <Reveal>
        <SectionHeader
          id="top-categories-title"
          title="Top Categories"
          subtitle="Explore courses in the most in-demand fields"
          action={<TextLink href="/categories">All Categories</TextLink>}
        />
      </Reveal>
      <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {topCategories.map((category) => (
          <RevealItem key={category.id} className="h-full">
            <CategoryCard category={category} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
