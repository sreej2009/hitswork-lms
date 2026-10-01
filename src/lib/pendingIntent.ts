/**
 * An action a guest tried before signing in (e.g. saving a course to their wishlist). It is kept for
 * this browser tab and replayed once they are signed in.
 */
export type PendingIntent = { type: 'wishlist'; courseId: string; title: string };

const KEY = 'hitswork_pending_intent';

export function savePendingIntent(intent: PendingIntent) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(intent));
  } catch {
    // Storage blocked: the user simply repeats the action after signing in.
  }
}

/** Returns and clears the pending intent. */
export function takePendingIntent(): PendingIntent | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    window.sessionStorage.removeItem(KEY);
    return raw ? (JSON.parse(raw) as PendingIntent) : null;
  } catch {
    return null;
  }
}

/** Only same-site paths are accepted as redirect targets (no "//evil.com" or absolute URLs). */
export const safeRedirect = (value: string | null | undefined) =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : null;

/** Sign-in URL that returns to `path` afterwards. */
export const loginUrl = (path: string) => `/login?redirect=${encodeURIComponent(path)}`;
