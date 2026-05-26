import { jellyfinFetch, JELLYFIN_PAGE_SIZE } from './client';
import type { JellyfinItem, JellyfinItemsResponse } from '@/types/jellyfin';

function isFullyViewed(userData?: JellyfinItem['UserData']): boolean {
  return userData?.Played === true;
}

export function mapProviderIds(providers: Record<string, string> = {}) {
  return {
    imdb: providers.Imdb,
    tmdb: providers.Tmdb,
  };
}

export async function fetchAllFullyViewedMovies(
  baseUrl: string,
  apiKey: string,
  userId: string,
): Promise<JellyfinItem[]> {
  const allItems: JellyfinItem[] = [];
  let startIndex = 0;
  let totalRecordCount = Infinity;

  while (startIndex < totalRecordCount) {
    const params = new URLSearchParams({
      userId,
      recursive: 'true',
      includeItemTypes: 'Movie',
      fields: 'ProviderIds,Path,UserData',
      filters: 'IsPlayed',
      isPlayed: 'true',
      enableUserData: 'true',
      enableTotalRecordCount: 'true',
      startIndex: String(startIndex),
      limit: String(JELLYFIN_PAGE_SIZE),
    });

    const res = await jellyfinFetch(baseUrl, apiKey, `/Users/${userId}/Items?${params}`);
    if (!res.ok) throw new Error(`Jellyfin Items API returned ${res.status}`);

    const data: JellyfinItemsResponse = await res.json();
    const items = data.Items || [];
    allItems.push(...items);
    totalRecordCount = data.TotalRecordCount ?? startIndex + items.length;
    startIndex += JELLYFIN_PAGE_SIZE;
    if (items.length === 0) break;
  }

  console.log(allItems.filter((item) => item.Name.toLowerCase().includes('avatar')));

  return allItems;
}

export async function deleteJellyfinItem(
  baseUrl: string,
  apiKey: string,
  itemId: string,
): Promise<void> {
  const res = await jellyfinFetch(baseUrl, apiKey, `/Items/${itemId}`, { method: 'DELETE' });
  if (res.status !== 200 && res.status !== 204) {
    throw new Error(`Jellyfin delete returned ${res.status}`);
  }
}
