/**
 * Demo authentication helpers. Everything runs in the browser: there is no server,
 * so this must be replaced by a real auth provider before launch.
 */

export interface AuthUser {
  name: string;
  email: string;
  /** ISO timestamp */
  joinedAt: string;
  phone?: string;
  country?: string;
}

export type ProfilePatch = Pick<AuthUser, 'name' | 'email'> & Partial<Pick<AuthUser, 'phone' | 'country'>>;

export const MIN_PASSWORD_LENGTH = 8;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'Email address is required';
  if (!EMAIL.test(value.trim())) return 'Enter a valid email address';
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required';
  if (value.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  return undefined;
}

/** 0–4, used for the strength meter on sign-up. */
export function passwordStrength(value: string): 0 | 1 | 2 | 3 | 4 {
  if (!value) return 0;
  let score = 0;
  if (value.length >= MIN_PASSWORD_LENGTH) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
  return Math.max(1, score) as 1 | 2 | 3 | 4;
}

export const normaliseEmail = (email: string) => email.trim().toLowerCase();

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

/**
 * Hash of email + password so demo accounts never store a plain-text password.
 * Uses Web Crypto when available (https / localhost); falls back to FNV-1a otherwise.
 */
export async function hashPassword(email: string, password: string): Promise<string> {
  const input = `${normaliseEmail(email)}:${password}`;
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv-${hash.toString(16)}`;
}

/** Simulated network latency so loading states are visible. */
export const simulateRequest = (ms = 800) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * Built-in demo account. It is created in the browser the first time someone signs in with it,
 * so it works on any device without registering. Shown on the sign-in page.
 */
export const DEMO_ACCOUNT = {
  name: 'Sree',
  email: 'demo@hitswork.com',
  password: 'Demo@12345',
  joinedAt: '2026-09-01T09:00:00.000Z',
} as const;
