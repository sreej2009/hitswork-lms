import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { findDemoAccount, hashPassword, normaliseEmail, simulateRequest, type AuthUser, type ProfilePatch } from '../lib/auth';

// Storage keys. `hitswork_user` / `hitswork_authenticated` hold the session; `hitswork_accounts` is the
// demo "user database" (email → name + password hash).
const USER_KEY = 'hitswork_user';
const AUTH_KEY = 'hitswork_authenticated';
const ACCOUNTS_KEY = 'hitswork_accounts';

interface StoredAccount {
  name: string;
  passwordHash: string;
  joinedAt: string;
  phone?: string;
  country?: string;
  /** Email the password hash was salted with; differs from the key after an email change. */
  hashEmail?: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    /** Lets forms attach the message to a specific field */
    readonly field?: 'email' | 'password',
  ) {
    super(message);
  }
}

interface AuthValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Throws AuthError on failure. `remember: false` keeps the session for this browser tab only. */
  login: (email: string, password: string, remember: boolean) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  /** Throws AuthError (field 'email') if the new email belongs to another account. */
  updateProfile: (patch: ProfilePatch) => AuthUser;
  /** Throws AuthError (field 'password') if `current` is wrong. */
  changePassword: (current: string, next: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

function safeGet(storage: Storage, key: string) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function readSession(): AuthUser | null {
  for (const storage of [window.localStorage, window.sessionStorage]) {
    if (safeGet(storage, AUTH_KEY) !== 'true') continue;
    try {
      const user = JSON.parse(safeGet(storage, USER_KEY) ?? 'null') as AuthUser | null;
      if (user?.email) return user;
    } catch {
      // Corrupt entry: treat as signed out.
    }
  }
  return null;
}

function writeSession(user: AuthUser | null, remember = true) {
  try {
    for (const storage of [window.localStorage, window.sessionStorage]) {
      storage.removeItem(USER_KEY);
      storage.removeItem(AUTH_KEY);
    }
    if (!user) return;
    const storage = remember ? window.localStorage : window.sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(user));
    storage.setItem(AUTH_KEY, 'true');
  } catch {
    // Storage blocked: the session lasts until the page is closed.
  }
}

function readAccounts(): Record<string, StoredAccount> {
  try {
    return JSON.parse(safeGet(window.localStorage, ACCOUNTS_KEY) ?? '{}') as Record<string, StoredAccount>;
  } catch {
    return {};
  }
}

function writeAccounts(accounts: Record<string, StoredAccount>) {
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // Ignore: the account simply won't survive a reload.
  }
}

/** Creates the built-in demo account on first use in this browser. */
/** Creates a built-in demo account the first time someone signs in with it. */
async function ensureDemoAccount(demo: NonNullable<ReturnType<typeof findDemoAccount>>): Promise<StoredAccount> {
  const accounts = readAccounts();
  const existing = accounts[demo.email];
  if (existing) return existing;
  const account: StoredAccount = {
    name: demo.name,
    passwordHash: await hashPassword(demo.email, demo.password),
    joinedAt: demo.joinedAt,
    country: 'India',
  };
  writeAccounts({ ...readAccounts(), [demo.email]: account });
  return account;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readSession);

  // Keep tabs in sync: signing out in one tab signs out the others.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === AUTH_KEY || event.key === USER_KEY) setUser(readSession());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    await simulateRequest();
    const key = normaliseEmail(email);
    const demo = findDemoAccount(key);
    const account = demo ? await ensureDemoAccount(demo) : readAccounts()[key];
    if (!account) throw new AuthError('We couldn’t find an account with that email.', 'email');
    if (account.passwordHash !== (await hashPassword(account.hashEmail ?? key, password)))
      throw new AuthError('Incorrect password. Try again or reset it.', 'password');
    const next: AuthUser = {
      name: account.name,
      email: key,
      joinedAt: account.joinedAt,
      phone: account.phone,
      country: account.country,
    };
    writeSession(next, remember);
    setUser(next);
    return next;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await simulateRequest();
    const key = normaliseEmail(email);
    const accounts = readAccounts();
    if (accounts[key] || findDemoAccount(key))
      throw new AuthError('An account with this email already exists.', 'email');
    const joinedAt = new Date().toISOString();
    accounts[key] = { name: name.trim(), passwordHash: await hashPassword(key, password), joinedAt };
    writeAccounts(accounts);
    const next: AuthUser = { name: name.trim(), email: key, joinedAt };
    writeSession(next, true);
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (patch: ProfilePatch) => {
      if (!user) throw new AuthError('You’re not signed in.');
      const email = normaliseEmail(patch.email);
      const accounts = readAccounts();
      if (email !== user.email && accounts[email]) throw new AuthError('Another account already uses this email.', 'email');
      const account = accounts[user.email];
      if (account) {
        delete accounts[user.email];
        accounts[email] = {
          ...account,
          name: patch.name.trim(),
          phone: patch.phone,
          country: patch.country,
          hashEmail: account.hashEmail ?? user.email,
        };
        writeAccounts(accounts);
      }
      const next: AuthUser = {
        ...user,
        name: patch.name.trim(),
        email,
        phone: patch.phone?.trim() || undefined,
        country: patch.country || undefined,
      };
      // Rewrite into whichever storage currently holds the session.
      writeSession(next, safeGet(window.localStorage, AUTH_KEY) === 'true');
      setUser(next);
      return next;
    },
    [user],
  );

  const changePassword = useCallback(
    async (current: string, next: string) => {
      await simulateRequest(700);
      if (!user) throw new AuthError('You’re not signed in.');
      const accounts = readAccounts();
      const account = accounts[user.email];
      const salt = account?.hashEmail ?? user.email;
      if (!account || account.passwordHash !== (await hashPassword(salt, current)))
        throw new AuthError('Your current password is incorrect.', 'password');
      accounts[user.email] = { ...account, passwordHash: await hashPassword(salt, next) };
      writeAccounts(accounts);
    },
    [user],
  );

  const requestPasswordReset = useCallback(async () => {
    // Deliberately identical for known and unknown emails, so the form can't reveal who has an account.
    await simulateRequest(900);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      requestPasswordReset,
    }),
    [user, login, register, logout, updateProfile, changePassword, requestPasswordReset],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
