import en from '@/messages/en.json';

export type Locale = 'en' | 'fr';

export type Messages = typeof en;

export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_STORAGE_KEY = 'jellyfin-purger-locale';
