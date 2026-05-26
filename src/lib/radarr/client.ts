export function radarrBaseUrl(url: string) {
  return url.replace(/\/$/, '');
}

export async function radarrFetch(
  baseUrl: string,
  apiKey: string,
  path: string,
  options?: RequestInit,
): Promise<Response> {
  const sep = path.includes('?') ? '&' : '?';
  const url = `${radarrBaseUrl(baseUrl)}${path}${sep}apikey=${apiKey}`;
  return fetch(url, options);
}
