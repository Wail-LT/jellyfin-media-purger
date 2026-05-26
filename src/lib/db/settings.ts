import { db } from './client';
import type { AppConfig, AppConfigUpdate } from '@/types/config';

export function getSettings(): AppConfig {
  const row = db.prepare('SELECT * FROM settings WHERE id = 1').get() as AppConfig;
  return row;
}

export function updateSettings(updates: AppConfigUpdate): AppConfig {
  const current = getSettings();
  const next: Record<string, unknown> = {
    jellyfin_url: updates.jellyfin_url ?? current.jellyfin_url,
    jellyfin_user_id: updates.jellyfin_user_id ?? current.jellyfin_user_id,
    radarr_url: updates.radarr_url ?? current.radarr_url,
    months_threshold: updates.months_threshold ?? current.months_threshold,
    updated_at: new Date().toISOString(),
    // Only update key fields if a non-empty value was provided
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
      updated_at = @updated_at
    WHERE id = 1
  `).run(next);

  return getSettings();
}

export function maskKey(key: string): string {
  if (!key || key.length < 4) return key ? '••••' : '';
  return `••••${key.slice(-4)}`;
}
