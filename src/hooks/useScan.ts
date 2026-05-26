'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from '@/providers/I18nProvider';
import type { MediaItem, PurgeResult } from '@/types/media';

export type ItemWithSelection = MediaItem & {
  selected: boolean;
  actionStatus?: 'idle' | 'processing' | 'success' | 'error';
  actionMessage?: string;
};

export function useScan() {
  const { t } = useTranslations();
  const [movies, setMovies] = useState<ItemWithSelection[]>([]);
  const [scanning, setScanning] = useState(false);
  const [purging, setPurging] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const scan = useCallback(async () => {
    setScanning(true);
    setScanError(null);
    setMovies([]);
    try {
      const res = await fetch('/api/scan', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Scan failed (${res.status})`);
      setMovies(
        (data.movies as MediaItem[]).map((m) => ({
          ...m,
          selected: m.matchedInRadarr,
          actionStatus: 'idle',
        })),
      );
    } catch (e: unknown) {
      setScanError(e instanceof Error ? e.message : String(e));
    } finally {
      setScanning(false);
    }
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m)));
  }, []);

  const selectAll = useCallback((value: boolean) => {
    setMovies((prev) => prev.map((m) => ({ ...m, selected: value })));
  }, []);

  const purge = useCallback(async () => {
    const selected = movies.filter((m) => m.selected);
    if (selected.length === 0) return;

    setPurging(true);
    setMovies((prev) =>
      prev.map((m) =>
        m.selected ? { ...m, actionStatus: 'processing', actionMessage: t('common.deleting') } : m,
      ),
    );

    try {
      const res = await fetch('/api/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movies: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Purge failed (${res.status})`);

      const results: PurgeResult[] = data.results;
      setMovies((prev) =>
        prev.map((m) => {
          const r = results.find((x) => x.id === m.id);
          if (!r) return m;
          return {
            ...m,
            actionStatus: r.success ? 'success' : 'error',
            actionMessage: r.success ? t('common.purgedSuccessfully') : (r.error ?? t('common.failed')),
            radarrStatus: r.radarrDeleted ? 'Deleted' : m.radarrStatus,
          };
        }),
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setMovies((prev) =>
        prev.map((m) => (m.selected ? { ...m, actionStatus: 'error', actionMessage: msg } : m)),
      );
    } finally {
      setPurging(false);
    }
  }, [movies, t]);

  return { movies, scanning, purging, scanError, scan, toggleSelect, selectAll, purge };
}
