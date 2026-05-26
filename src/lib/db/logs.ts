import { prisma } from '@/lib/prisma';
import type { LogEntry, LogLevel } from '@/types/log';
import type { OperationLog } from '@prisma/client';

function toLogEntry(row: OperationLog): LogEntry {
  return {
    id: row.id,
    timestamp: row.timestamp.toISOString(),
    level: row.level as LogLevel,
    message: row.message,
  };
}

export async function appendLog(level: LogLevel, message: string): Promise<void> {
  await prisma.operationLog.create({ data: { level, message } });
}

export async function getLogs(limit = 200): Promise<LogEntry[]> {
  const rows = await prisma.operationLog.findMany({
    orderBy: { id: 'desc' },
    take: limit,
  });
  return rows.map(toLogEntry);
}

export async function clearLogs(): Promise<void> {
  await prisma.operationLog.deleteMany();
}
