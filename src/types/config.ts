export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly';

export const SCHEDULE_FREQUENCIES: ScheduleFrequency[] = ['daily', 'weekly', 'monthly'];

export interface AppConfig {
  jellyfin_url: string;
  jellyfin_api_key: string;
  jellyfin_user_id: string;
  radarr_url: string;
  radarr_api_key: string;
  months_threshold: number;
  schedule_enabled: number;
  schedule_frequency: ScheduleFrequency;
  schedule_hour: number;
  schedule_last_run_at: string;
  updated_at: string;
}

export interface AppConfigPublic extends Omit<
  AppConfig,
  'jellyfin_api_key' | 'radarr_api_key' | 'schedule_enabled' | 'schedule_last_run_at'
> {
  jellyfin_api_key_masked: string;
  radarr_api_key_masked: string;
  schedule_enabled: boolean;
  schedule_last_run_at: string | null;
}

export interface AppConfigUpdate {
  jellyfin_url?: string;
  jellyfin_api_key?: string;
  jellyfin_user_id?: string;
  radarr_url?: string;
  radarr_api_key?: string;
  months_threshold?: number;
  schedule_enabled?: boolean;
  schedule_frequency?: ScheduleFrequency;
  schedule_hour?: number;
}
