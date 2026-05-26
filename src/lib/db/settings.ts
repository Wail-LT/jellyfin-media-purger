import { db } from './client';
import type { AppConfig, AppConfigUpdate, ScheduleFrequency } from '@/types/config';
import { SCHEDULE_FREQUENCIES } from '@/types/config';

export function getSettings(): AppConfig {
  const row = db.prepare('SELECT * FROM settings WHERE id = 1').get() as AppConfig;
  return row;
}

export function touchScheduleLastRun(iso: string): void {
  db.prepare(`
    UPDATE settings SET schedule_last_run_at = @schedule_last_run_at, updated_at = @updated_at
    WHERE id = 1
  `).run({ schedule_last_run_at: iso, updated_at: new Date().toISOString() });
}

export function updateSettings(updates: AppConfigUpdate): AppConfig {
  const current = getSettings();
  const next: Record<string, unknown> = {
    jellyfin_url: updates.jellyfin_url ?? current.jellyfin_url,
    jellyfin_user_id: updates.jellyfin_user_id ?? current.jellyfin_user_id,
    radarr_url: updates.radarr_url ?? current.radarr_url,
    months_threshold: updates.months_threshold ?? current.months_threshold,
    schedule_enabled:
      updates.schedule_enabled !== undefined
        ? updates.schedule_enabled
          ? 1
          : 0
        : current.schedule_enabled,
    schedule_frequency: updates.schedule_frequency ?? current.schedule_frequency,
    schedule_hour: updates.schedule_hour ?? current.schedule_hour,
    updated_at: new Date().toISOString(),
    jellyfin_api_key: updates.jellyfin_api_key ? updates.jellyfin_api_key : current.jellyfin_api_key,
    radarr_api_key: updates.radarr_api_key ? updates.radarr_api_key : current.radarr_api_key,
  };

  db.prepare(`
    UPDATE settings SET
      jellyfin_url = @jellyfin_url,
      jellyfin_api_key = @jellyfin_api_key,
      jellyfin_user_id = @jellyfin_user_id,
      radarr_url = @radarr_url,
      radarr_api_key = @radarr_api_key,
      months_threshold = @months_threshold,
      schedule_enabled = @schedule_enabled,
      schedule_frequency = @schedule_frequency,
      schedule_hour = @schedule_hour,
      updated_at = @updated_at
    WHERE id = 1
  `).run(next);

  const updated = getSettings();

  // Lazy import to avoid circular dependency at module load
  import('@/lib/scheduler').then(({ refreshScheduler }) => refreshScheduler());

  return updated;
}

export function maskKey(key: string): string {
  if (!key || key.length < 4) return key ? '••••' : '';
  return `••••${key.slice(-4)}`;
}

export function isValidScheduleFrequency(value: string): value is ScheduleFrequency {
  return (SCHEDULE_FREQUENCIES as string[]).includes(value);
}
