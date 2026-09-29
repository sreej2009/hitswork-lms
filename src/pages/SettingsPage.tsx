import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { cn } from '../lib/cn';
import { useSignOut } from '../components/layout/UserMenu';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { PageHeader } from '../components/ui/PageHeader';

const preferences = [
  { id: 'courseUpdates', label: 'Course updates', description: 'New lectures and announcements from your instructors.' },
  { id: 'reminders', label: 'Learning reminders', description: 'A weekly nudge to keep your streak going.' },
  { id: 'offers', label: 'Offers & recommendations', description: 'Personalised course picks and seasonal sales.' },
] as const;

type PreferenceId = (typeof preferences)[number]['id'];
type Preferences = Record<PreferenceId, boolean>;
const defaults: Preferences = { courseUpdates: true, reminders: true, offers: false };

const storageKey = (email: string) => `hitswork_settings:${email}`;

function loadPreferences(email: string): Preferences {
  try {
    return { ...defaults, ...(JSON.parse(localStorage.getItem(storageKey(email)) ?? '{}') as Partial<Preferences>) };
  } catch {
    return defaults;
  }
}

function Switch({ id, checked, onChange, labelledBy, describedBy }: {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  labelledBy: string;
  describedBy: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200',
        checked ? 'bg-brand-gradient' : 'bg-line-strong',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'inline-block size-5 rounded-full bg-white shadow-xs transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );
}

export function SettingsPage() {
  useDocumentTitle('Settings — Hitswork');
  const { user } = useAuth();
  const signOut = useSignOut();
  const [prefs, setPrefs] = useState<Preferences>(() => (user ? loadPreferences(user.email) : defaults));

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(storageKey(user.email), JSON.stringify(prefs));
    } catch {
      // Preferences just won't persist.
    }
  }, [prefs, user]);

  return (
    <>
      <PageHeader title="Settings" subtitle="Choose what we email you about and manage your session." />
      <Container className="py-10 lg:py-12">
        <div className="mx-auto max-w-3xl space-y-6">
        <section aria-labelledby="notifications-title" className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-7">
          <h2 id="notifications-title" className="text-xl font-bold tracking-[-0.01em]">
            Email notifications
          </h2>
          <ul className="mt-5 divide-y divide-line">
            {preferences.map(({ id, label, description }) => (
              <li key={id} className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
                <div>
                  <p id={`${id}-label`} className="text-[15px] font-semibold text-ink">
                    {label}
                  </p>
                  <p id={`${id}-desc`} className="mt-0.5 text-sm text-body">
                    {description}
                  </p>
                </div>
                <Switch
                  id={`${id}-switch`}
                  checked={prefs[id]}
                  onChange={(value) => setPrefs((current) => ({ ...current, [id]: value }))}
                  labelledBy={`${id}-label`}
                  describedBy={`${id}-desc`}
                />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="session-title" className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-7">
          <h2 id="session-title" className="text-xl font-bold tracking-[-0.01em]">
            Session
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-body">
              Signed in as <span className="font-semibold text-ink">{user?.email}</span>
            </p>
            <Button variant="secondary" icon={LogOut} onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </section>
        </div>
      </Container>
    </>
  );
}
