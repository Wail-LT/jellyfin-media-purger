import { radarrFetch } from './client';
import type { RadarrMovie } from '@/types/radarr';
import type { MediaItem } from '@/types/media';

export async function listRadarrMovies(
  baseUrl: string,
  apiKey: string,
): Promise<RadarrMovie[]> {
  const res = await radarrFetch(baseUrl, apiKey, '/api/v3/movie');
  if (!res.ok) throw new Error(`Radarr /api/v3/movie returned ${res.status}`);
  return res.json();
}

export async function deleteRadarrMovie(
  baseUrl: string,
  apiKey: string,
  id: number,
): Promise<void> {
  const res = await radarrFetch(
    baseUrl,
    apiKey,
    `/api/v3/movie/${id}?deleteFiles=true&addImportExclusion=true`,
    { method: 'DELETE' },
  );
  if (res.status !== 200 && res.status !== 202 && res.status !== 204) {
    throw new Error(`Radarr delete returned ${res.status}`);
  }
}

export function matchMovies(
  items: Omit<MediaItem, 'matchedInRadarr' | 'radarrId' | 'radarrMonitored' | 'radarrTitle' | 'radarrStatus'>[],
  radarrMovies: RadarrMovie[],
): MediaItem[] {
  return items.map((item) => {
    const match = radarrMovies.find((rm) => {
      const byTmdb = item.externalIds.tmdb && String(rm.tmdbId) === String(item.externalIds.tmdb);
      const byImdb =
        item.externalIds.imdb &&
        rm.imdbId &&
        rm.imdbId.toLowerCase() === item.externalIds.imdb.toLowerCase();
      return byTmdb || byImdb;
    });

    return {
      ...item,
      matchedInRadarr: !!match,
      radarrId: match?.id,
      radarrMonitored: match?.monitored,
      radarrTitle: match?.title,
      radarrStatus: match ? 'Matched' : 'Not Found',
    };
  });
}
