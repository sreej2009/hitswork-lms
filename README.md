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
  context/             InstructorContext: instructor profile, courses and notifications (per account);
                       StoreContext: cart, wishlist, purchases, coupon, orders + toasts; AuthContext: demo sign-in;
                       LearningContext: course progress, certificates, notifications
  hooks/               useModalDialog (focus trap, Escape, scroll lock), useDocumentTitle, usePageMeta (title + description)
  pages/               Home, Courses (/courses), CourseDetails (/course/:id), Cart (/cart), Checkout (/checkout),
                       CheckoutSuccess (/checkout/success), CoursePlayer (/learn/:courseId), NotFound
    auth/              Login (/login), Register (/register), ForgotPassword (/forgot-password)
    instructor/        Instructor area: Overview (/instructor), Courses, Students, Analytics, Earnings, Profile,
                       Create/Edit course basics (/instructor/course/create, /instructor/course/:id/edit)
    InstructorPublicPage  Public instructor profile (/instructors/:slug)
    info/              About (/about), Contact (/contact) and Help Center (/help; /support redirects there)
    teach/             Teach on Hitswork (/teach) and the instructor application (/teach/register)
    business/          Hitswork for Business (/business) and the demo request form (/business/contact)
    dashboard/         Student area: Overview (/dashboard), MyLearning, Wishlist, Certificates (+ /certificates/:id),
                       Achievements, Profile, Settings — all behind sign-in, in DashboardLayout
  components/
    ui/                Primitives: Button, IconButton, Badge, SectionHeader, TextLink, Reveal, SmartImage, Floating,
                       FaqAccordion, CountUp, SubmissionSuccess, StatsStrip, ProcessSteps, GradientCTA, Form controls (TextInput, SelectInput, TextArea…)
    layout/            Navbar (docked → floating on scroll), UserMenu, CategoriesMenu, SearchBar, MobileDrawer, Footer
    auth/              AuthShell (two-column layout), PasswordInput, SocialButtons, RouteGuards (RequireAuth, GuestOnly)
    dashboard/         DashboardLayout (takes any sidebar) + SidebarNav + Header (slots for notifications/menu), LearningProgressCard, ProgressBar, CertificateArtwork,
                       stat/streak/goal/achievement widgets
    instructor/        InstructorSidebar/Header, RequireInstructor (+ onboarding), CourseList (table ↔ cards),
                       MetricCard, StudentDrawer, PayoutDialog, InstructorProfileCard
    charts/            AreaChart and BarChart (SVG/HTML, hover tooltips, screen-reader tables) — no chart library
    course/            CourseCard, CourseGrid, CourseCarousel (+ useCarousel), FilterPills
    catalog/           Courses page: FilterPanel, FilterSheet (mobile), SortSelect, ActiveFilters, Pagination
    course-detail/     Course page: PurchaseCard, EnrollButton, MobilePurchaseBar, CurriculumAccordion, InstructorCard, ReviewsSection
    checkout/          CartItem, CartSummary, CouponInput, CheckoutSteps, ContactForm, BillingForm, PaymentMethod,
                       OrderSummary, PaymentSuccess, EmptyCart
    category/          CategoryChip (strip), CategoryCard (top categories)
    feature/           FeatureCard
    icons/             Brand social icons (Lucide no longer ships these)
  sections/            One file per homepage section, composed in pages/HomePage.tsx;
    teach/, business/, about/  Sections for the instructor, business and about pages
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

**Demo account:** `demo@hitswork.com` / `Demo@12345` works in any browser without registering (it's created on
first sign-in; see `DEMO_ACCOUNT` in `src/lib/auth.ts`). The sign-in page has a "Use demo account" shortcut.

- Registering stores the account in `localStorage` (`hitswork_accounts`) with a SHA-256 hash of email + password,
  never the password itself. Signing in checks against it, so wrong passwords and unknown emails are rejected.
- The session lives in `hitswork_user` + `hitswork_authenticated`: in `localStorage` with "Remember me",
  otherwise in `sessionStorage` (cleared when the tab closes). Tabs stay in sync.
- `/dashboard`, `/my-learning`, `/profile` and `/settings` redirect to `/login` and return afterwards.
  Signed-in users visiting `/login` or `/register` go to the dashboard.
- Google/Apple buttons and password-reset emails are UI only.

### Student dashboard (demo)

- **Sample data.** The first time someone signs in on a browser, `data/learning.ts` seeds a learning history
  (4 courses in progress, 6 completed with certificates) plus notifications, merged with any real purchases.
  Every number on the dashboard is derived from that data. Settings → "Reset sample data" restores it.
- **Storage keys:** `hitswork_learning` (progress per course), `hitswork_certificates`, `hitswork_notifications`,
  `hitswork_cart`, `hitswork_wishlist`, `hitswork_enrolled`, `hitswork_orders`, `hitswork_coupon`.
- **Lessons** come from `lib/lessonPlan.ts`: courses with a written curriculum use it; others get a generic
  12-lesson outline. Lesson copy, resources and announcements live in `data/lessons.ts`.
- **Course player** (`/learn/:courseId?lesson=<n>`, `components/player/`): a demo video player (a real playback
  clock and controls over the course image — no streaming yet), curriculum sidebar/drawer with sequential
  unlocking, Overview / Notes / Resources / Announcements tabs, and a completion screen. A lesson that plays to
  the end, or "Next Lesson", marks it complete. Keyboard: Space, ←/→ (seek 10s), Shift+←/→ (lesson), F, M, Esc.
- **Player storage:** `hitswork_lesson_progress` (resume points), `hitswork_notes`, and
  `hitswork_course_progress` (a summary derived from `hitswork_learning`, which stays the source of truth, so the
  dashboard, My Learning and the player always agree).
- **Certificates** render in HTML (`CertificateArtwork`) and download as a one-page PDF generated in the browser
  (`lib/certificatePdf.ts`, no dependencies).
- Streak, weekly-goal and daily-activity figures are static sample values in `data/learning.ts`.

### Teach on Hitswork & Hitswork for Business (demo)

- `/teach` is the instructor landing page; "Start Teaching" / "Become an Instructor" open `/teach/register`.
- `/business` is the enterprise landing page; "Talk to Our Team" and the plan cards open `/business/contact`
  (plan cards pass `?plan=small-teams|growing|enterprise` to prefill the company size). The contact form only
  accepts work email addresses.
- Both forms validate on the client (`lib/instructorApplication.ts`, `lib/businessContact.ts`), simulate a short
  request and store the submission in `localStorage` (`hitswork_instructor_application`,
  `hitswork_business_enquiry`) with a reference ID such as `HIT-INS-2026-4821` or `HIT-BIZ-2026-4821`. Revisiting
  the page shows the confirmation until "Submit a different application / another request" clears it.
- Nothing is sent anywhere yet — connect a CRM or email service in those two lib files.
- Dashboard previews, team table, revenue and analytics charts use sample data defined in `data/teach.ts` and
  `data/business.ts`; company names, testimonials and figures are fictional and labelled as such on the page.

### About, Contact & Help Center (demo)

- `/help` searches the articles in `data/help.ts` on the client (`lib/helpSearch.ts`): every word must match, and
  matches in the question or keywords rank above passing mentions in an answer. The search text (`?q=`) and the
  selected topic (`?category=`) live in the URL, so results can be linked to directly.
- `/contact` validates on the client (`lib/supportMessage.ts`) and stores the message in `localStorage`
  (`hitswork_support_ticket`) with a ticket number such as `HIT-SUP-2026-4821`. Nothing is emailed yet.
- The contact addresses (`data/support.ts`) are example addresses and are labelled as such on the page.
- About page figures are labelled as platform highlights for the demo; the story makes no claims about company history.

### Instructor dashboard (demo)

- **Instructor sign-in:** `/instructor/login` (or `/login?as=instructor`, or the "I’m an Instructor" switch on the
  sign-in page) lands on `/instructor` after signing in. **Demo instructor:** `instructor@hitswork.com` /
  `Teach@12345` (created on first sign-in, like the demo learner).
- `/instructor/*` requires sign-in. Accounts without instructor status see an onboarding screen: apply via
  Teach on Hitswork, or start the demo dashboard straight away. The demo account (`demo@hitswork.com`) is an
  instructor out of the box.
- **Storage** (each a map keyed by account email): `hitswork_instructor` (profile + payout settings; its presence
  means instructor status), `hitswork_instructor_courses`, `hitswork_instructor_notifications`.
- Courses can be created (as drafts), edited, submitted for review, duplicated and deleted. Status, search and sort
  on My Courses live in the URL. Revenue, rating and published counts are derived from the courses.
- Students, analytics series, activity and transactions are read-only sample data in `data/instructor.ts`
  (types in `types/instructor.ts`) and every page that shows them carries a "Sample data" badge.
- Payout settings are a demo form: only the last four digits of an account number are stored and nothing is paid.

### Course builder (demo)

- Full-screen builder at `/instructor/course/create` and `/instructor/course/:id/edit` (same component), with a
  learner-style preview at `/instructor/course/:id/preview` that reuses `CourseDetailsView` from the Course
  Details page (purchasing disabled).
- Steps (in the URL as `?step=`): Basic Information · Curriculum · Pricing · Settings · Preview. A checklist
  drives the progress %, and Submit for Review is blocked until title, subtitle, description, category, level,
  thumbnail, ≥1 section, ≥1 lesson and a valid price are in place.
- **Autosave:** edits are written ~0.8 s after you stop typing (`hooks/useCourseDraft.ts`), into the existing
  `hitswork_instructor_courses` store. A new course is stored on its first edit, then the URL switches to `/edit`.
- **Data model:** `InstructorCourse` gained optional builder fields (`subtitle`, `description` (sanitised HTML),
  `sections → lessons`, pricing, promotion, `settings`…) — see `types/instructor.ts`. Logic lives in
  `lib/courseBuilder.ts` (checklist, validation, preview conversion).
- **Media:** thumbnails are resized to 1280×720 JPEG and stored with the draft. Video and file uploads are
  simulated (`lib/courseMedia.ts` — replace `uploadFile` with a real API); only metadata is saved, so video
  previews last for the browser session.
- Curriculum: drag sections and lessons (native HTML5 drag & drop, including between sections) or use the arrow
  buttons on touch screens. Lesson types: video, article (rich text), quiz, assignment, resource.
- Builder courses never reach the public catalog: `/courses` only lists catalog courses, and drafts or courses in
  review stay in the instructor area.

### Admin panel (demo)

- **Sign in:** `/admin/login` with `admin@hitswork.com` / `Admin@12345`. Only this account has the admin role;
  anyone else opening `/admin/*` is sent to `/dashboard`, and the "Admin Panel" menu link is only shown to the admin.
- **Pages:** Overview, Courses, Pending Reviews, Course Review (`/admin/courses/:id/review`), Instructors (+ detail
  and applications), Students (+ detail), Categories, Orders, Reports (CSV export), Settings. Global search in the
  header covers courses, students, instructors and orders.
- **Data:** types in `types/admin.ts`, sample data in `data/admin.ts`, state in `context/AdminContext.tsx`, storage in
  `lib/adminStorage.ts` (`hitswork_admin`, `hitswork_admin_courses`, `_instructors`, `_students`, `_orders`,
  `_categories`, `_notifications`, `_applications`). Platform totals are sample figures and labelled as such.
- **Review loop:** courses submitted in the course builder appear in Pending Reviews. Approve → Published (shown in
  `/courses` and at `/course/:id`); Request Changes / Reject (reason required) → the instructor sees the status and
  feedback in their dashboard and builder, edits and resubmits. With "Require Course Approval" turned off in
  Settings, submissions publish immediately.
- **Public visibility** is decided in one place, `lib/publicCatalog.ts`: catalog courses unless unpublished or deleted
  by an admin, plus approved builder courses. Drafts, pending and rejected courses never appear publicly.
- Messages, refunds and payouts are simulated; nothing is sent or charged.
