import { categories } from '../data/categories';
import { CategoryChip } from '../components/category/CategoryChip';
import { Container } from '../components/ui/Container';
import { Reveal } from '../components/ui/Reveal';

/** Category shortcuts that overlap the bottom edge of the hero. */
export function CategoryStrip() {
  return (
    <div className="relative z-10 -mt-10 lg:-mt-12">
      <Container>
        <Reveal y={16}>
          <nav aria-label="Course categories" className="rounded-3xl border border-line bg-white p-1.5 shadow-card sm:p-2">
            <ul className="no-scrollbar flex snap-x gap-1 overflow-x-auto max-lg:fade-r lg:justify-between lg:overflow-visible">
              {categories.map((category) => (
                <li key={category.id} className="flex lg:flex-1">
                  <CategoryChip category={category} />
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>
      </Container>
    </div>
  );
}
