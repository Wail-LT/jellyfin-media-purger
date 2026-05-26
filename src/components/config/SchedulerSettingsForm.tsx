'use client';

import type { AppConfigPublic, AppConfigUpdate, ScheduleFrequency } from '@/types/config';
import { useTranslations } from '@/providers/I18nProvider';

interface Props {
  config: AppConfigPublic;
  onSave: (updates: AppConfigUpdate) => Promise<void>;
  saving: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatLastRun(iso: string | null, locale: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(locale);
  } catch {
    return iso;
  }
}

export default function SchedulerSettingsForm({ config, onSave, saving }: Props) {
  const { t, locale } = useTranslations();

  const lastRunLabel = config.schedule_last_run_at
    ? formatLastRun(config.schedule_last_run_at, locale)
    : t('config.scheduler.lastRunNever');

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-xl space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">{t('config.scheduler.title')}</h3>
        <p className="text-xs text-slate-500 mt-1">{t('config.scheduler.subtitle')}</p>
      </div>

      <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg px-4 py-3 text-amber-200 text-xs">
        {t('config.scheduler.warning')}
      </div>

      <p className="text-xs text-slate-500">{t('config.scheduler.serverTimeNote')}</p>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 accent-indigo-500 rounded"
          checked={config.schedule_enabled}
          onChange={(e) => onSave({ schedule_enabled: e.target.checked })}
          disabled={saving}
        />
        <span className="text-sm text-slate-300">{t('config.scheduler.enable')}</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t('config.scheduler.frequency')}
          </label>
          <select
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
            value={config.schedule_frequency}
            onChange={(e) =>
              onSave({ schedule_frequency: e.target.value as ScheduleFrequency })
            }
            disabled={saving || !config.schedule_enabled}
          >
            <option value="daily">{t('config.scheduler.frequencyDaily')}</option>
            <option value="weekly">{t('config.scheduler.frequencyWeekly')}</option>
            <option value="monthly">{t('config.scheduler.frequencyMonthly')}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t('config.scheduler.hour')}
          </label>
          <select
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
            value={config.schedule_hour}
            onChange={(e) => onSave({ schedule_hour: Number(e.target.value) })}
            disabled={saving || !config.schedule_enabled}
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {t('config.scheduler.hourOption', { hour: String(h).padStart(2, '0') })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        {t('config.scheduler.lastRun', { time: lastRunLabel })}
      </p>
    </div>
  );
}
