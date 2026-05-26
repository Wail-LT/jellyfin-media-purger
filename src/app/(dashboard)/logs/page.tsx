'use client';

import LogsPanel from '@/components/logs/LogsPanel';
import { useLogs } from '@/hooks/useLogs';

export default function LogsPage() {
  const { logs, loading, reload, clear } = useLogs();

  return (
    <div>
      <LogsPanel logs={logs} loading={loading} onReload={reload} onClear={clear} />
    </div>
  );
}
