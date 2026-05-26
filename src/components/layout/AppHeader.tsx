'use client';

import { Trash2 } from 'lucide-react';
import AppNav from './AppNav';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from '@/providers/I18nProvider';

export default function AppHeader() {
  const { t } = useTranslations();

  return (
    <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 sticky top-0 z-10 flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/10">
          <Trash2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {t('header.title')}
          </h1>
          <p className="text-xs text-slate-400">{t('header.subtitle')}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <LanguageSwitcher />
        <AppNav />
      </div>
    </header>
  );
}
