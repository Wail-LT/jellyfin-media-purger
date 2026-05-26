'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LogEntry } from '@/types/log';

export function useLogs(autoRefreshMs?: number) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(async () => {
    await fetch('/api/logs', { method: 'DELETE' });
    setLogs([]);
  }, []);

  useEffect(() => {
    load();
    if (!autoRefreshMs) return;
    const id = setInterval(load, autoRefreshMs);
    return () => clearInterval(id);
  }, [load, autoRefreshMs]);

  return { logs, loading, reload: load, clear };
}
