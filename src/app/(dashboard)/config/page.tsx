'use client';

import JellyfinSettingsForm from '@/components/config/JellyfinSettingsForm';
import RadarrSettingsForm from '@/components/config/RadarrSettingsForm';
import ThresholdSlider from '@/components/config/ThresholdSlider';
import SchedulerSettingsForm from '@/components/config/SchedulerSettingsForm';
import { useConfig } from '@/hooks/useConfig';
import { useTranslations } from '@/providers/I18nProvider';

export default function ConfigPage() {
  const { config, loading, saving, error, save } = useConfig();
  const { t } = useTranslations();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        {t('config.loading')}
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center py-24 text-rose-400">
        {error ?? t('config.loadFailed')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-950/40 border border-red-500/30 rounded-xl px-5 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <JellyfinSettingsForm config={config} onSave={save} saving={saving} />
        <div className="space-y-6">
          <RadarrSettingsForm config={config} onSave={save} saving={saving} />
          <ThresholdSlider value={config.months_threshold} onSave={save} saving={saving} />
        </div>
      </div>

      <SchedulerSettingsForm config={config} onSave={save} saving={saving} />
    </div>
  );
}
