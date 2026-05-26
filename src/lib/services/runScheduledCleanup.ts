import { getSettings, touchScheduleLastRun } from '@/lib/db/settings';
import { appendLog } from '@/lib/db/logs';
import { scanMovies } from '@/lib/services/scanMovies';
import { purgeMovies } from '@/lib/services/purgeMovies';

export async function runScheduledCleanup(): Promise<void> {
  const config = await getSettings();

  if (!config.schedule_enabled) {
    return;
  }

  if (!config.jellyfin_url || !config.jellyfin_api_key || !config.jellyfin_user_id) {
    await appendLog(
      'error',
      'Scheduled cleanup skipped: Jellyfin connection (URL, API key, User ID) is not fully configured.',
    );
    return;
  }

  await appendLog('info', 'Scheduled cleanup started...');

  try {
    const movies = await scanMovies(config);

    if (movies.length === 0) {
      await appendLog('info', 'Scheduled cleanup: no movies to purge.');
      await touchScheduleLastRun(new Date().toISOString());
      return;
    }

    await appendLog('info', `Scheduled cleanup: purging ${movies.length} movie(s)...`);
    const results = await purgeMovies(movies, config);
    const succeeded = results.filter((r) => r.success).length;
    const failed = results.length - succeeded;

    await touchScheduleLastRun(new Date().toISOString());
    await appendLog(
      'success',
      `Scheduled cleanup complete. ${succeeded} succeeded, ${failed} failed.`,
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    await appendLog('error', `Scheduled cleanup failed: ${message}`);
  }
}
