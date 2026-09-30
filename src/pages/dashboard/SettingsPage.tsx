import { useEffect, useState, type ReactNode } from 'react';
import { Globe, LogOut, Moon, RotateCcw, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { defaultSettings, languages, type UserSettings } from '../../data/users';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { cn } from '../../lib/cn';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DashboardCard } from '../../components/dashboard/Widgets';
import { useSignOut } from '../../components/layout/UserMenu';
import { Button } from '../../components/ui/Button';
import { SelectInput } from '../../components/ui/Form';

const storageKey = (email: string) => `hitswork_settings:${email}`;

function loadSettings(email: string | undefined): UserSettings {
  if (!email) return defaultSettings;
  try {
    return { ...defaultSettings, ...(JSON.parse(localStorage.getItem(storageKey(email)) ?? '{}') as Partial<UserSettings>) };
  } catch {
    return defaultSettings;
  }
}

function Switch({ checked, onChange, labelledBy, describedBy }: {
  checked: boolean;
  onChange: (value: boolean) => void;
  labelledBy: string;
  describedBy?: string;
}) {
  return (
    <button
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
        className={cn('inline-block size-5 rounded-full bg-white shadow-xs transition-transform duration-200', checked ? 'translate-x-6' : 'translate-x-1')}
      />
    </button>
  );
}

function SettingRow({ id, label, description, children }: { id: string; label: string; description: string; children: ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
      <div>
        <p id={`${id}-label`} className="text-[15px] font-semibold text-ink">
          {label}
        </p>
        <p id={`${id}-desc`} className="mt-0.5 text-sm text-body">
          {description}
        </p>
      </div>
      {children}
    </li>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <DashboardCard>
      <h2 className="text-lg font-bold tracking-[-0.01em]">{title}</h2>
      <div className="mt-5">{children}</div>
    </DashboardCard>
  );
}

export function SettingsPage() {
  useDocumentTitle('Settings — Hitswork');
  const { user } = useAuth();
  const { resetSampleData } = useLearning();
  const signOut = useSignOut();
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings(user?.email));
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(storageKey(user.email), JSON.stringify(settings));
    } catch {
      // Preferences just won't persist.
    }
  }, [settings, user]);

  const set = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const toggles: { key: 'emailNotifications' | 'courseReminders' | 'marketingEmails'; label: string; description: string }[] = [
    { key: 'emailNotifications', label: 'Email notifications', description: 'Course announcements, receipts and account updates.' },
    { key: 'courseReminders', label: 'Course reminders', description: 'A weekly nudge to keep your learning streak going.' },
    { key: 'marketingEmails', label: 'Marketing emails', description: 'Personalised course picks and seasonal offers.' },
  ];

  return (
    <>
      <DashboardHeader title="Settings" subtitle="Notifications, appearance, language and privacy." />
      <div className="max-w-3xl space-y-6">
        <Section title="Account">
          <ul className="divide-y divide-line">
            {toggles.map(({ key, label, description }) => (
              <SettingRow key={key} id={key} label={label} description={description}>
                <Switch checked={settings[key]} onChange={(v) => set(key, v)} labelledBy={`${key}-label`} describedBy={`${key}-desc`} />
              </SettingRow>
            ))}
          </ul>
        </Section>

        <Section title="Appearance">
          <fieldset>
            <legend className="sr-only">Theme</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  { id: 'light', label: 'Light Mode', icon: Sun, available: true },
                  { id: 'dark', label: 'Dark Mode', icon: Moon, available: false },
                ] as const
              ).map(({ id, label, icon: Icon, available }) => (
                <label
                  key={id}
                  className={cn('relative', available ? 'cursor-pointer' : 'cursor-not-allowed')}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={id}
                    checked={settings.theme === id}
                    disabled={!available}
                    onChange={() => set('theme', id)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      'flex items-center gap-3 rounded-2xl border p-4 transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-brand-200',
                      settings.theme === id ? 'border-brand-500 bg-brand-50/60' : 'border-line-strong',
                      !available && 'opacity-60',
                    )}
                  >
                    <span className={cn('grid size-10 place-items-center rounded-xl', id === 'dark' ? 'bg-ink text-white' : 'bg-amber-50 text-amber-600')}>
                      <Icon aria-hidden className="size-5" strokeWidth={2} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-ink">{label}</span>
                      <span className="block text-xs text-muted">{available ? 'Default' : 'Coming soon'}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </Section>

        <Section title="Language">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="settings-language" className="flex items-center gap-2 text-sm font-medium text-ink sm:w-48">
              <Globe aria-hidden className="size-4 text-muted" strokeWidth={2} />
              Display language
            </label>
            <div className="sm:w-64">
              <SelectInput
                id="settings-language"
                options={languages}
                value={settings.language}
                onChange={(e) => set('language', e.target.value as UserSettings['language'])}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">More languages are coming soon.</p>
        </Section>

        <Section title="Privacy">
          <ul>
            <SettingRow id="profilePublic" label="Profile visibility" description="Let other learners and instructors see your profile and certificates.">
              <Switch
                checked={settings.profilePublic}
                onChange={(v) => set('profilePublic', v)}
                labelledBy="profilePublic-label"
                describedBy="profilePublic-desc"
              />
            </SettingRow>
          </ul>
        </Section>

        <Section title="Demo data">
          <p className="text-sm text-body">
            This demo stores your courses, progress and certificates in this browser. Resetting restores the sample
            learning history.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {confirmReset ? (
              <>
                <Button
                  variant="secondary"
                  icon={RotateCcw}
                  onClick={() => {
                    resetSampleData();
                    setConfirmReset(false);
                    setResetDone(true);
                  }}
                >
                  Yes, reset my learning data
                </Button>
                <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="secondary" icon={RotateCcw} onClick={() => { setConfirmReset(true); setResetDone(false); }}>
                Reset sample data
              </Button>
            )}
            {resetDone && <p role="status" className="text-sm font-medium text-emerald-700">Sample data restored</p>}
          </div>
        </Section>

        <Section title="Session">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-body">
              Signed in as <span className="font-semibold text-ink">{user?.email}</span>
            </p>
            <Button variant="secondary" icon={LogOut} onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
}
