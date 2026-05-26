import { deleteJellyfinItem } from '@/lib/jellyfin/movies';
import { deleteRadarrMovie } from '@/lib/radarr/movies';
import { appendLog } from '@/lib/db/logs';
import type { AppConfig } from '@/types/config';
import type { MediaItem, PurgeResult } from '@/types/media';

export async function purgeMovies(
  items: MediaItem[],
  config: AppConfig,
): Promise<PurgeResult[]> {
  const results: PurgeResult[] = [];
  await appendLog('info', `Starting purge of ${items.length} selected movie(s)...`);

  for (const item of items) {
    await appendLog('info', `Processing: "${item.name}"`);
    let radarrDeleted = false;
    let jellyfinDeleted = false;
    let error: string | undefined;

    try {
      if (item.matchedInRadarr && item.radarrId) {
        await deleteRadarrMovie(config.radarr_url, config.radarr_api_key, item.radarrId);
        radarrDeleted = true;
        await appendLog('success', `Radarr deleted movie ID ${item.radarrId}.`);
      } else {
        radarrDeleted = true; // nothing to do
        await appendLog('warning', `"${item.name}" has no Radarr match — skipping Radarr deletion.`);
      }

      await deleteJellyfinItem(config.jellyfin_url, config.jellyfin_api_key, item.id);
      jellyfinDeleted = true;
      await appendLog('success', `Jellyfin deleted item ${item.id}.`);
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : String(e);
      await appendLog('error', `Error processing "${item.name}": ${error}`);
    }

    results.push({
      id: item.id,
      name: item.name,
      success: radarrDeleted && jellyfinDeleted,
      radarrDeleted,
      jellyfinDeleted,
      error,
    });
  }

  await appendLog('info', 'Purge workflow complete.');
  return results;
}
