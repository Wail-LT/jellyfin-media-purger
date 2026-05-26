export interface AppConfig {
  jellyfin_url: string;
  jellyfin_api_key: string;
  jellyfin_user_id: string;
  radarr_url: string;
  radarr_api_key: string;
  months_threshold: number;
  updated_at: string;
}

export interface AppConfigPublic extends Omit<AppConfig, 'jellyfin_api_key' | 'radarr_api_key'> {
  jellyfin_api_key_masked: string;
  radarr_api_key_masked: string;
}

export interface AppConfigUpdate {
  jellyfin_url?: string;
  jellyfin_api_key?: string;
  jellyfin_user_id?: string;
  radarr_url?: string;
  radarr_api_key?: string;
  months_threshold?: number;
}
