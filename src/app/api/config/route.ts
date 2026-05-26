export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getSettings, updateSettings, maskKey, isValidScheduleFrequency } from '@/lib/db/settings';
import type { AppConfig, AppConfigUpdate } from '@/types/config';

function toPublicConfig(settings: AppConfig) {
  return {
    jellyfin_url: settings.jellyfin_url,
    jellyfin_user_id: settings.jellyfin_user_id,
    jellyfin_api_key_masked: maskKey(settings.jellyfin_api_key),
    radarr_url: settings.radarr_url,
    radarr_api_key_masked: maskKey(settings.radarr_api_key),
    months_threshold: settings.months_threshold,
    schedule_enabled: Boolean(settings.schedule_enabled),
    schedule_frequency: settings.schedule_frequency,
    schedule_hour: settings.schedule_hour,
    schedule_last_run_at: settings.schedule_last_run_at || null,
    updated_at: settings.updated_at,
  };
}

function validateScheduleUpdates(body: AppConfigUpdate): string | null {
  if (body.schedule_hour !== undefined) {
    const hour = body.schedule_hour;
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
      return 'schedule_hour must be an integer between 0 and 23.';
    }
  }
  if (body.schedule_frequency !== undefined && !isValidScheduleFrequency(body.schedule_frequency)) {
    return 'schedule_frequency must be daily, weekly, or monthly.';
  }
  return null;
}

export async function GET() {
  return NextResponse.json(toPublicConfig(await getSettings()));
}

export async function PUT(request: Request) {
  const body: AppConfigUpdate = await request.json();
  const validationError = validateScheduleUpdates(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const updated = await updateSettings(body);
  return NextResponse.json(toPublicConfig(updated));
}
