export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db/settings';
import { purgeMovies } from '@/lib/services/purgeMovies';
import type { MediaItem } from '@/types/media';

interface PurgeRequestBody {
  movies: MediaItem[];
}

export async function POST(request: Request) {
  const config = await getSettings();

  if (!config.jellyfin_url || !config.jellyfin_api_key) {
    return NextResponse.json(
      { error: 'Jellyfin connection must be configured first.' },
      { status: 400 },
    );
  }

  const body: PurgeRequestBody = await request.json();

  if (!body.movies || body.movies.length === 0) {
    return NextResponse.json({ error: 'No movies provided.' }, { status: 400 });
  }

  try {
    const results = await purgeMovies(body.movies, config);
    return NextResponse.json({ results });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
