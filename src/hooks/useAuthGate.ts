import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { loginUrl, savePendingIntent, type PendingIntent } from '../lib/pendingIntent';

/**
 * For actions that need an account (enroll, wishlist, checkout). Returns true when signed in;
 * otherwise sends the visitor to sign in and back to the current page afterwards — optionally
 * replaying `intent` once they are signed in.
 */
export function useAuthGate() {
  const { isAuthenticated } = useAuth();
  const { notify } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (intent?: PendingIntent) => {
      if (isAuthenticated) return true;
      if (intent) savePendingIntent(intent);
      notify('Please sign in to continue.');
      const here = `${location.pathname}${location.search}`;
      navigate(loginUrl(here), { state: { from: location } });
      return false;
    },
    [isAuthenticated, location, navigate, notify],
  );
}
