export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db/settings';
import { fetchJellyfinUsers } from '@/lib/jellyfin/users';

export async function GET() {
  const { jellyfin_url, jellyfin_api_key } = getSettings();

  if (!jellyfin_url || !jellyfin_api_key) {
    return NextResponse.json(
      { error: 'Jellyfin URL and API key must be configured first.' },
      { status: 400 },
    );
  }

  try {
    const users = await fetchJellyfinUsers(jellyfin_url, jellyfin_api_key);
    return NextResponse.json({ users });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
