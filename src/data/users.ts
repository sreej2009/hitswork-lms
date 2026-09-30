import { countries } from './checkout';

/** Countries offered on the profile form (shared with checkout billing). */
export const profileCountries = countries;

export const languages = ['English'] as const;

/** Account preferences, stored per user under `hitswork_settings:<email>`. */
export interface UserSettings {
  emailNotifications: boolean;
  courseReminders: boolean;
  marketingEmails: boolean;
  profilePublic: boolean;
  theme: 'light' | 'dark';
  language: (typeof languages)[number];
}

export const defaultSettings: UserSettings = {
  emailNotifications: true,
  courseReminders: true,
  marketingEmails: false,
  profilePublic: true,
  theme: 'light',
  language: 'English',
};
