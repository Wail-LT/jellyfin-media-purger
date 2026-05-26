'use client';

import { useState, useEffect } from 'react';
import ScanControls from '@/components/scan/ScanControls';
import MoviesTable from '@/components/scan/MoviesTable';
import { useScan } from '@/hooks/useScan';
import type { AppConfigPublic } from '@/types/config';

export default function ScanPage() {
  const [config, setConfig] = useState<AppConfigPublic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { movies, scanning, purging, scanError, scan, toggleSelect, selectAll, purge } = useScan();

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => null);
  }, []);

  const selectedCount = movies.filter((m) => m.selected).length;
  const activeUserName = config ? config.jellyfin_user_id : '';

  return (
    <div className="space-y-6">
      <ScanControls
        monthsThreshold={config?.months_threshold ?? 3}
        activeUserName={activeUserName}
        selectedCount={selectedCount}
        scanning={scanning}
        purging={purging}
        onScan={scan}
        onPurge={purge}
      />

      {scanError && (
        <div className="bg-red-950/40 border border-red-500/30 rounded-xl px-5 py-3 text-red-300 text-sm">
          {scanError}
        </div>
      )}

      <MoviesTable
        movies={movies}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleSelect={toggleSelect}
        onSelectAll={selectAll}
      />
    </div>
  );
}
