export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getSettings, updateSettings, maskKey } from '@/lib/db/settings';
import type { AppConfigUpdate } from '@/types/config';

export async function GET() {
  const settings = getSettings();
  return NextResponse.json({
    jellyfin_url: settings.jellyfin_url,
    jellyfin_user_id: settings.jellyfin_user_id,
    jellyfin_api_key_masked: maskKey(settings.jellyfin_api_key),
    radarr_url: settings.radarr_url,
    radarr_api_key_masked: maskKey(settings.radarr_api_key),
    months_threshold: settings.months_threshold,
    updated_at: settings.updated_at,
  });
}

export async function PUT(request: Request) {
  const body: AppConfigUpdate = await request.json();
  const updated = updateSettings(body);
  return NextResponse.json({
    jellyfin_url: updated.jellyfin_url,
    jellyfin_user_id: updated.jellyfin_user_id,
    jellyfin_api_key_masked: maskKey(updated.jellyfin_api_key),
    radarr_url: updated.radarr_url,
    radarr_api_key_masked: maskKey(updated.radarr_api_key),
    months_threshold: updated.months_threshold,
    updated_at: updated.updated_at,
  });
}
