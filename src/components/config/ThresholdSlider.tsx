'use client';

import type { AppConfigUpdate } from '@/types/config';
import { useTranslations } from '@/providers/I18nProvider';

interface Props {
  value: number;
  onSave: (updates: AppConfigUpdate) => Promise<void>;
  saving: boolean;
}

export default function ThresholdSlider({ value, onSave, saving }: Props) {
  const { t } = useTranslations();

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-xl">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
        <span>{t('config.thresholdTitle')}</span>
        <span className="text-indigo-400">{t('common.months', { count: value })}</span>
      </label>
      <input
        type="range"
        min="1"
        max="24"
        step="1"
        className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        value={value}
        onChange={(e) => onSave({ months_threshold: Number(e.target.value) })}
        disabled={saving}
      />
      <p className="text-xs text-slate-500 mt-2">
        {t('config.thresholdHint', { months: value })}
      </p>
    </div>
  );
}
