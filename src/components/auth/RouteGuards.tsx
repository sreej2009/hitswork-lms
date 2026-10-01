import { Navigate, Outlet, useLocation, type Location } from 'react-router';
import { useAuth } from '../../context/AuthContext';

/**
 * Where to send the user after signing in: the page they were blocked from, else the instructor
 * dashboard for an instructor sign-in (`/login?as=instructor`), else the learner dashboard.
 */
export function useReturnPath(): string {
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from;
  if (from) return `${from.pathname}${from.search}${from.hash}`;
  const as = new URLSearchParams(location.search).get('as');
  return as === 'instructor' ? '/instructor' : as === 'admin' ? '/admin' : '/dashboard';
}

/** Protected pages: signed-out visitors go to /login and come back afterwards. */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

/** Sign in / sign up: already signed-in users skip straight to their destination. */
export function GuestOnly() {
  const { isAuthenticated } = useAuth();
  const returnPath = useReturnPath();
  if (isAuthenticated) return <Navigate to={returnPath} replace />;
  return <Outlet />;
}
