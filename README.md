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
  context/             StoreContext: cart, wishlist, purchases, coupon, orders + toasts; AuthContext: demo sign-in
  hooks/               useModalDialog (focus trap, Escape, scroll lock), useDocumentTitle
  pages/               Home, Courses (/courses), CourseDetails (/course/:id), Cart (/cart), Checkout (/checkout),
                       CheckoutSuccess (/checkout/success), NotFound; protected: Dashboard, MyLearning, Profile, Settings
    auth/              Login (/login), Register (/register), ForgotPassword (/forgot-password)
  components/
    ui/                Primitives: Button, IconButton, Badge, SectionHeader, TextLink, Reveal, SmartImage…
    layout/            Navbar (docked → floating on scroll), UserMenu, CategoriesMenu, SearchBar, MobileDrawer, Footer
    auth/              AuthShell (two-column layout), PasswordInput, SocialButtons, RouteGuards (RequireAuth, GuestOnly)
    course/            CourseCard, CourseGrid, CourseCarousel (+ useCarousel), FilterPills
    catalog/           Courses page: FilterPanel, FilterSheet (mobile), SortSelect, ActiveFilters, Pagination
    course-detail/     Course page: PurchaseCard, EnrollButton, MobilePurchaseBar, CurriculumAccordion, InstructorCard, ReviewsSection
    checkout/          CartItem, CartSummary, CouponInput, CheckoutSteps, ContactForm, BillingForm, PaymentMethod,
                       OrderSummary, PaymentSuccess, EmptyCart
    category/          CategoryChip (strip), CategoryCard (top categories)
    feature/           FeatureCard
    icons/             Brand social icons (Lucide no longer ships these)
  sections/            One file per homepage section, composed in pages/HomePage.tsx
```

Content lives in `src/data`, so the copy, courses and links can change without touching components.

The courses catalog keeps all its state in the URL (`/courses?category=design&level=beginner&sort=rated&page=2`),
so every filter combination is shareable and homepage category links open a pre-filtered list.
Filtering, facet counts and sorting are pure functions in `src/lib/catalog.ts`.

Course pages live at `/course/:id`. Every course in `data/courses.ts` gets a page; adding an entry with the
same id to `data/courseDetails.ts` adds the curriculum, learning outcomes, requirements, description and
reviews (currently `web-development`, `business`, `ui-ux` and `data-science`). Instructor profiles are in
`data/instructors.ts`; instructors without one get stats derived from the catalog. Prices are in INR.

### Cart & checkout (demo)

There is no backend or payment gateway yet. Cart, wishlist, applied coupon, purchased courses and orders are kept
in `localStorage` (`hitswork:*` keys), so they survive reloads on the same browser. Checkout validates every field
on the client (`src/lib/checkout.ts`) and simulates a short processing delay before recording the order.

- Demo coupon: `HITS20` — 20% off, up to ₹500 (`src/lib/pricing.ts`)
- Demo card: `4242 4242 4242 4242`, any future expiry, any 3-digit CVV
- "Enroll Now" on a course page checks out just that course (`/checkout?buy=<id>`); free courses enroll instantly

## Design system notes

- **Colour:** brand indigo `#4F46E5` / `#6366F1`, grape `#7C3AED`, orchid `#A855F7`; ink `#0F172A`, body `#475569`. Each category has one accent, defined in `lib/accents.ts`.
- **Type:** Plus Jakarta Sans for headings, Inter for body text.
- **Breakpoints:** phones below 768px, tablets from 768 to 1199px, desktop from 1200px (`xl` is overridden to 75rem).
- **Motion:** only subtle entrances, hover lifts and slow floats. `MotionConfig reducedMotion="user"` respects the OS "reduce motion" setting.
- **Accessibility:** skip link, semantic landmarks, visible focus rings, arrow-key tabs for course filters, a focus-trapped mobile drawer, a mega-menu that closes on Escape, and a `/` shortcut to focus search.

### Authentication (demo)

Sign-in runs entirely in the browser — replace `src/context/AuthContext.tsx` with a real provider before launch.

- Registering stores the account in `localStorage` (`hitswork_accounts`) with a SHA-256 hash of email + password,
  never the password itself. Signing in checks against it, so wrong passwords and unknown emails are rejected.
- The session lives in `hitswork_user` + `hitswork_authenticated`: in `localStorage` with "Remember me",
  otherwise in `sessionStorage` (cleared when the tab closes). Tabs stay in sync.
- `/dashboard`, `/my-learning`, `/profile` and `/settings` redirect to `/login` and return afterwards.
  Signed-in users visiting `/login` or `/register` go to the dashboard.
- Google/Apple buttons and password-reset emails are UI only.
