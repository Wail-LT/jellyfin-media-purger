import { jellyfinFetch } from './client';
import type { JellyfinUser } from '@/types/jellyfin';

export async function fetchJellyfinUsers(
  baseUrl: string,
  apiKey: string,
): Promise<JellyfinUser[]> {
  const res = await jellyfinFetch(baseUrl, apiKey, '/Users');
  if (!res.ok) throw new Error(`Jellyfin /Users returned ${res.status}`);
  const data = await res.json();
  return (data as Array<{ Id: string; Name: string }>).map((u) => ({
    Id: u.Id,
    Name: u.Name,
  }));
}
