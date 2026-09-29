import { ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyCartProps {
  title?: string;
  text?: string;
}

export function EmptyCart({
  title = 'Your cart is empty',
  text = 'Looks like you haven’t added any courses yet.',
}: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-line bg-white px-6 py-16 text-center shadow-card sm:py-20">
      {/* Illustration: cart on a soft gradient disc with a small accent */}
      <div aria-hidden className="relative">
        <div className="absolute inset-0 -z-0 scale-150 rounded-full bg-[radial-gradient(closest-side,rgb(129_140_248/0.25),transparent)]" />
        <div className="relative grid size-24 place-items-center rounded-full bg-linear-to-br from-brand-50 to-grape-100 ring-8 ring-white">
          <ShoppingCart className="size-10 text-brand-600" strokeWidth={1.6} />
        </div>
        <span className="absolute -top-1 -right-2 grid size-8 place-items-center rounded-full bg-white text-grape-600 shadow-card">
          <Sparkles className="size-4" strokeWidth={2} />
        </span>
      </div>
      <h2 className="mt-8 text-2xl font-extrabold tracking-[-0.02em] sm:text-[1.75rem]">{title}</h2>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-body">{text}</p>
      <Button href="/courses" size="lg" arrow className="mt-8">
        Explore Courses
      </Button>
    </div>
  );
}
