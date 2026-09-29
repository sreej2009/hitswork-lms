import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { Toast } from '../ui/Toast';

/** Start each new page at the top (query-string changes, like filters, keep their position). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
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
