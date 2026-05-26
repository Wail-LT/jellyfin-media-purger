'use client';

import { Globe } from 'lucide-react';
import { useTranslations } from '@/providers/I18nProvider';
import { LOCALES } from '@/lib/i18n/types';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslations();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-slate-400" aria-hidden />
      <label htmlFor="locale-select" className="sr-only">
        {t('language.label')}
      </label>
      <select
        id="locale-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {LOCALES.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
