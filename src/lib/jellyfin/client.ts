const JELLYFIN_PAGE_SIZE = 100;

export function jellyfinBaseUrl(url: string) {
  return url.replace(/\/$/, '');
}

export async function jellyfinFetch(
  baseUrl: string,
  apiKey: string,
  path: string,
  options?: RequestInit,
): Promise<Response> {
  const sep = path.includes('?') ? '&' : '?';
  const url = `${jellyfinBaseUrl(baseUrl)}${path}${sep}api_key=${apiKey}`;
  const res = await fetch(url, options);
  return res;
}

export { JELLYFIN_PAGE_SIZE };
