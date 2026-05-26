export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db/settings';
import { scanMovies } from '@/lib/services/scanMovies';

export async function POST() {
  const config = getSettings();

  if (!config.jellyfin_url || !config.jellyfin_api_key || !config.jellyfin_user_id) {
    return NextResponse.json(
      { error: 'Jellyfin connection (URL, API key, User ID) must be configured first.' },
      { status: 400 },
    );
  }

  try {
    const movies = await scanMovies(config);
    return NextResponse.json({ movies });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
