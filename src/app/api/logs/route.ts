export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getLogs, clearLogs } from '@/lib/db/logs';

export async function GET() {
  const logs = getLogs(200);
  return NextResponse.json({ logs });
}

export async function DELETE() {
  clearLogs();
  return NextResponse.json({ ok: true });
}
