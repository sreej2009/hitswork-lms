# Hitswork

Marketing homepage for Hitswork, an online learning platform. Built with React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion and Lucide icons.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## Project structure

```
src/
  index.css            Design tokens (@theme): colours, fonts, radii, shadows, breakpoints
  types/               Shared domain types (Course, Category, Feature…)
  data/                All page content — courses, categories, nav/footer links, hero stats
  lib/                 Helpers: class joining, number/price formatting, Unsplash URLs, accent palette
  context/             Cart + wishlist store and toast messages
  components/
    ui/                Primitives: Button, IconButton, Badge, SectionHeader, TextLink, Reveal, SmartImage…
    layout/            Navbar, CategoriesMenu, SearchBar, MobileDrawer, Footer
    course/            CourseCard, CourseGrid, CourseCarousel (+ useCarousel), FilterPills
    category/          CategoryChip (strip), CategoryCard (top categories)
    feature/           FeatureCard
    icons/             Brand social icons (Lucide no longer ships these)
  sections/            One file per homepage section, composed in App.tsx
```

Content lives in `src/data`, so the copy, courses and links can change without touching components.

## Design system notes

- **Colour:** brand indigo `#4F46E5` / `#6366F1`, grape `#7C3AED`, orchid `#A855F7`; ink `#0F172A`, body `#475569`. Each category has one accent, defined in `lib/accents.ts`.
- **Type:** Plus Jakarta Sans for headings, Inter for body text.
- **Breakpoints:** phones below 768px, tablets from 768 to 1199px, desktop from 1200px (`xl` is overridden to 75rem).
- **Motion:** only subtle entrances, hover lifts and slow floats. `MotionConfig reducedMotion="user"` respects the OS "reduce motion" setting.
- **Accessibility:** skip link, semantic landmarks, visible focus rings, arrow-key tabs for course filters, a focus-trapped mobile drawer, a mega-menu that closes on Escape, and a `/` shortcut to focus search.
