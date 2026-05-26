import { db } from './client';
import type { LogEntry, LogLevel } from '@/types/log';

export function appendLog(level: LogLevel, message: string): void {
  db.prepare(
    'INSERT INTO operation_logs (level, message) VALUES (?, ?)'
  ).run(level, message);
}

export function getLogs(limit = 200): LogEntry[] {
  return db.prepare(
    'SELECT id, timestamp, level, message FROM operation_logs ORDER BY id DESC LIMIT ?'
  ).all(limit) as LogEntry[];
}

export function clearLogs(): void {
  db.prepare('DELETE FROM operation_logs').run();
}
