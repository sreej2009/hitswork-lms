import { Navigate, Outlet, useLocation, type Location } from 'react-router';
import { useAuth } from '../../context/AuthContext';

/** Where to send the user after signing in: the page they were blocked from, else the dashboard. */
export function useReturnPath(): string {
  const from = (useLocation().state as { from?: Location } | null)?.from;
  return from ? `${from.pathname}${from.search}${from.hash}` : '/dashboard';
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
