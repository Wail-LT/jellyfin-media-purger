import { fetchAllFullyViewedMovies, mapProviderIds } from '@/lib/jellyfin/movies';
import { listRadarrMovies, matchMovies } from '@/lib/radarr/movies';
import type { RadarrMovie } from '@/types/radarr';
import { appendLog } from '@/lib/db/logs';
import type { AppConfig } from '@/types/config';
import type { MediaItem } from '@/types/media';

export async function scanMovies(config: AppConfig): Promise<MediaItem[]> {
  const { jellyfin_url, jellyfin_api_key, jellyfin_user_id, radarr_url, radarr_api_key, months_threshold } = config;

  appendLog('info', 'Starting scan for fully viewed movies...');

  const fullyViewed = await fetchAllFullyViewedMovies(jellyfin_url, jellyfin_api_key, jellyfin_user_id);
  appendLog('info', `Found ${fullyViewed.length} fully viewed movie(s) in Jellyfin.`);

  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months_threshold);
  appendLog('info', `Applying cut-off: items not viewed since ${cutoffDate.toLocaleDateString()}`);

  const baseItems = fullyViewed
    .filter((item) => {
      const lastPlayed = item.UserData?.LastPlayedDate;
      if (!lastPlayed) return false;
      return new Date(lastPlayed) <= cutoffDate;
    })
    .map((item) => ({
      id: item.Id,
      name: item.Name,
      lastPlayedDate: item.UserData!.LastPlayedDate!,
      playedCount: item.UserData?.PlayCount ?? 1,
      path: item.Path,
      externalIds: mapProviderIds(item.ProviderIds),
    }));

  appendLog('info', `${baseItems.length} movie(s) older than ${months_threshold} months. Matching with Radarr...`);

  let radarrMovies: RadarrMovie[] = [];
  if (radarr_url && radarr_api_key) {
    try {
      radarrMovies = await listRadarrMovies(radarr_url, radarr_api_key);
      appendLog('info', `Fetched ${radarrMovies.length} movies from Radarr for cross-reference.`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      appendLog('warning', `Could not fetch Radarr movies: ${msg}`);
    }
  }

  const enriched = matchMovies(baseItems, radarrMovies);
  appendLog('success', `Scan complete. ${enriched.length} movies ready.`);
  return enriched;
}
