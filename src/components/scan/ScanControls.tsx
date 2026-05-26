'use client';

import { RefreshCw, Trash2, Calendar, UserCheck } from 'lucide-react';
import { useTranslations } from '@/providers/I18nProvider';

interface Props {
  monthsThreshold: number;
  activeUserName: string;
  selectedCount: number;
  scanning: boolean;
  purging: boolean;
  onScan: () => void;
  onPurge: () => void;
}

export default function ScanControls({
  monthsThreshold,
  activeUserName,
  selectedCount,
  scanning,
  purging,
  onScan,
  onPurge,
}: Props) {
  const { t } = useTranslations();

  return (
    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white">{t('scan.title')}</h3>
        <p className="text-xs text-slate-400">
          {t('scan.description', { months: monthsThreshold })}
        </p>
        <div className="flex gap-4 mt-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            {t('scan.threshold', { months: monthsThreshold })}
          </span>
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            {t('scan.profile', { name: activeUserName || t('common.notConfigured') })}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onScan}
          disabled={scanning || purging}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition flex items-center space-x-2 shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? t('scan.scanning') : t('scan.scanButton')}</span>
        </button>

        <button
          onClick={onPurge}
          disabled={purging || scanning || selectedCount === 0}
          className="bg-red-600 hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition flex items-center space-x-2 shadow-md"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t('scan.purgeButton', { count: selectedCount })}</span>
        </button>
      </div>
    </div>
  );
}
