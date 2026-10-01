import { Navigate, Outlet, useLocation, type Location } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { isAdminEmail } from '../../lib/auth';
import { loginUrl, safeRedirect } from '../../lib/pendingIntent';

/**
 * Where to send the user after signing in, in order of preference:
 * the page they were blocked from (router state or `?redirect=`), the area matching how they signed in
 * (`?as=instructor` / `?as=admin`), the admin panel for the admin account, else the learner dashboard.
 */
export function useReturnPath(): string {
  const location = useLocation();
  const { user } = useAuth();
  const from = (location.state as { from?: Location } | null)?.from;
  if (from) return `${from.pathname}${from.search}${from.hash}`;
  const params = new URLSearchParams(location.search);
  const redirect = safeRedirect(params.get('redirect'));
  if (redirect) return redirect;
  const as = params.get('as');
  if (as === 'instructor') return '/instructor';
  if (as === 'admin' || isAdminEmail(user?.email)) return '/admin';
  return '/dashboard';
}

/** Protected pages: signed-out visitors go to /login and come back afterwards. */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated)
    return <Navigate to={loginUrl(`${location.pathname}${location.search}`)} replace state={{ from: location }} />;
  return <Outlet />;
}

/** Sign in / sign up: already signed-in users skip straight to their destination. */
export function GuestOnly() {
  const { isAuthenticated } = useAuth();
  const returnPath = useReturnPath();
  if (isAuthenticated) return <Navigate to={returnPath} replace />;
  return <Outlet />;
}
