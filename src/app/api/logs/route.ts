export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getLogs, clearLogs } from '@/lib/db/logs';

export async function GET() {
  const logs = await getLogs(200);
  return NextResponse.json({ logs });
}

export async function DELETE() {
  await clearLogs();
  return NextResponse.json({ ok: true });
}
