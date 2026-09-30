import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { Toast } from '../ui/Toast';

/**
 * Start each new page at the top (query-string changes, like filters, keep their position).
 * Links with a hash, e.g. "/#categories", scroll to that section once it has rendered.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    const frame = window.requestAnimationFrame(() =>
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' }),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

/** Wraps every route, including the full-screen auth pages. */
export function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
      <Toast />
    </>
  );
}

/** Standard pages: navbar, content, footer. */
export function SiteLayout() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
