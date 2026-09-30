/**
 * Demo form submissions (instructor applications, business enquiries) are stored in localStorage
 * until a real backend exists. Each one gets a reference ID like "HIT-INS-2026-4821".
 */

export function createReferenceId(prefix: string, now = new Date()) {
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `${prefix}-${now.getFullYear()}-${suffix}`;
}

export function loadSubmission<T extends { id: string }>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as T;
    return typeof parsed?.id === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function storeSubmission<T>(key: string, submission: T): T {
  try {
    localStorage.setItem(key, JSON.stringify(submission));
  } catch {
    // Storage can be full or blocked; the success screen still shows this submission.
  }
  return submission;
}

export function clearSubmission(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore — nothing to clear.
  }
}
