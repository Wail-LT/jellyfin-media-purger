import { prisma } from '@/lib/prisma';
import type { AppConfig, AppConfigUpdate, ScheduleFrequency } from '@/types/config';
import { SCHEDULE_FREQUENCIES } from '@/types/config';
import type { Settings } from '@prisma/client';

function toAppConfig(row: Settings): AppConfig {
  return {
    jellyfin_url: row.jellyfin_url,
    jellyfin_api_key: row.jellyfin_api_key,
    jellyfin_user_id: row.jellyfin_user_id,
    radarr_url: row.radarr_url,
    radarr_api_key: row.radarr_api_key,
    months_threshold: row.months_threshold,
    schedule_enabled: row.schedule_enabled,
    schedule_frequency: row.schedule_frequency as ScheduleFrequency,
    schedule_hour: row.schedule_hour,
    schedule_last_run_at: row.schedule_last_run_at,
    updated_at: row.updated_at.toISOString(),
  };
}

export async function getSettings(): Promise<AppConfig> {
  const row = await prisma.settings.findUniqueOrThrow({ where: { id: 1 } });
  return toAppConfig(row);
}

export async function touchScheduleLastRun(iso: string): Promise<void> {
  await prisma.settings.update({
    where: { id: 1 },
    data: { schedule_last_run_at: iso },
  });
}

export async function updateSettings(updates: AppConfigUpdate): Promise<AppConfig> {
  const current = await getSettings();

  const row = await prisma.settings.update({
    where: { id: 1 },
    data: {
      jellyfin_url: updates.jellyfin_url ?? current.jellyfin_url,
      jellyfin_api_key: updates.jellyfin_api_key ? updates.jellyfin_api_key : current.jellyfin_api_key,
      jellyfin_user_id: updates.jellyfin_user_id ?? current.jellyfin_user_id,
      radarr_url: updates.radarr_url ?? current.radarr_url,
      radarr_api_key: updates.radarr_api_key ? updates.radarr_api_key : current.radarr_api_key,
      months_threshold: updates.months_threshold ?? current.months_threshold,
      schedule_enabled:
        updates.schedule_enabled !== undefined
          ? updates.schedule_enabled
            ? 1
            : 0
          : current.schedule_enabled,
      schedule_frequency: updates.schedule_frequency ?? current.schedule_frequency,
      schedule_hour: updates.schedule_hour ?? current.schedule_hour,
    },
  });

  const { refreshScheduler } = await import('@/lib/scheduler');
  void refreshScheduler();

  return toAppConfig(row);
}

export function maskKey(key: string): string {
  if (!key || key.length < 4) return key ? '••••' : '';
  return `••••${key.slice(-4)}`;
}

export function isValidScheduleFrequency(value: string): value is ScheduleFrequency {
  return (SCHEDULE_FREQUENCIES as string[]).includes(value);
}
