export interface MediaItem {
  id: string;
  name: string;
  lastPlayedDate: string;
  playedCount: number;
  path?: string;
  externalIds: {
    imdb?: string;
    tmdb?: string;
  };
  matchedInRadarr: boolean;
  radarrId?: number;
  radarrMonitored?: boolean;
  radarrTitle?: string;
  radarrStatus: 'Not Found' | 'Matched' | 'Deleted';
}

export interface PurgeResult {
  id: string;
  name: string;
  success: boolean;
  radarrDeleted: boolean;
  jellyfinDeleted: boolean;
  error?: string;
}
