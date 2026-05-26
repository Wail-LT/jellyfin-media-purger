'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from '@/providers/I18nProvider';

export default function WarningBanner() {
  const { t } = useTranslations();

  return (
    <div className="bg-amber-950/40 border-b border-amber-500/20 px-6 py-2.5 text-amber-300 text-xs flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      <span>
        <strong>{t('warning.label')}</strong> {t('warning.message')}
      </span>
    </div>
  );
}
