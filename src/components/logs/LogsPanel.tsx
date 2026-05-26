'use client';

import { RefreshCw, Database } from 'lucide-react';
import type { LogEntry } from '@/types/log';
import { useTranslations } from '@/providers/I18nProvider';

const LEVEL_CLASSES: Record<LogEntry['level'], string> = {
  info: 'text-slate-300',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-red-400 font-semibold',
};

const LEVEL_PREFIX: Record<LogEntry['level'], string> = {
  info: '',
  success: '✓ ',
  warning: '⚠ ',
  error: '✗ ',
};

interface Props {
  logs: LogEntry[];
  loading: boolean;
  onReload: () => void;
  onClear: () => void;
}

export default function LogsPanel({ logs, loading, onReload, onClear }: Props) {
  const { t } = useTranslations();

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">{t('logs.title')}</h3>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReload}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </button>
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-white uppercase tracking-wider font-bold"
          >
            {t('logs.clear')}
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-950 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto space-y-1.5 h-[400px]">
        {logs.length === 0 ? (
          <div className="text-slate-600 text-center py-16">{t('logs.empty')}</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2.5">
              <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
              <span className={LEVEL_CLASSES[log.level]}>
                {LEVEL_PREFIX[log.level]}
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
