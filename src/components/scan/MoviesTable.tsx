'use client';

import { Film, RefreshCw, CheckCircle, XCircle, Info, Search } from 'lucide-react';
import type { ItemWithSelection } from '@/hooks/useScan';
import { useTranslations } from '@/providers/I18nProvider';

interface Props {
  movies: ItemWithSelection[];
  searchTerm: string;
  onSearchChange: (v: string) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: (v: boolean) => void;
}

export default function MoviesTable({
  movies,
  searchTerm,
  onSearchChange,
  onToggleSelect,
  onSelectAll,
}: Props) {
  const { t } = useTranslations();

  const filtered = movies.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.radarrTitle && m.radarrTitle.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder={t('scan.searchPlaceholder')}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {movies.length > 0 && (
          <div className="flex gap-2 text-xs font-semibold text-slate-400">
            <button onClick={() => onSelectAll(true)} className="text-indigo-400 hover:text-indigo-300">
              {t('scan.selectAllMatched')}
            </button>
            <span>|</span>
            <button onClick={() => onSelectAll(false)} className="hover:text-white">
              {t('scan.deselectAll')}
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-5 py-3.5 w-12 text-center">{t('scan.colSelect')}</th>
              <th className="px-5 py-3.5">{t('scan.colTitle')}</th>
              <th className="px-5 py-3.5">{t('scan.colLastWatched')}</th>
              <th className="px-5 py-3.5">{t('scan.colRadarrMatch')}</th>
              <th className="px-5 py-3.5 text-right">{t('scan.colStatus')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <Info className="w-8 h-8 text-slate-600" />
                    <p className="font-semibold text-sm">{t('scan.emptyTitle')}</p>
                    <p className="text-xs max-w-sm text-center">{t('scan.emptyHint')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-900/40 transition-colors ${item.selected ? 'bg-indigo-950/10' : ''}`}
                >
                  <td className="px-5 py-4 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-indigo-500 cursor-pointer"
                      checked={item.selected}
                      onChange={() => onToggleSelect(item.id)}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {item.name}
                    </div>
                    {item.path && (
                      <div className="text-xs text-slate-500 font-mono mt-0.5 max-w-md truncate">
                        {item.path}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    <div>{new Date(item.lastPlayedDate).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-500">
                      {t('scan.playedCount', { count: item.playedCount })}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {item.matchedInRadarr ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs font-semibold">
                          {t('scan.matchedRadarr', { id: item.radarrId ?? '' })}
                        </span>
                        {item.radarrMonitored !== undefined && (
                          <div className="text-xs text-slate-400">
                            {t('scan.monitored')}{' '}
                            <span className={item.radarrMonitored ? 'text-amber-400' : 'text-slate-500'}>
                              {item.radarrMonitored ? t('common.yes') : t('common.no')}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 bg-rose-500/10 text-rose-400 rounded text-xs font-semibold">
                        {t('scan.noRadarrLink')}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {!item.actionStatus || item.actionStatus === 'idle' ? (
                      <span className="text-slate-500 text-xs">{t('common.pending')}</span>
                    ) : item.actionStatus === 'processing' ? (
                      <span className="text-amber-400 text-xs flex items-center justify-end gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> {item.actionMessage}
                      </span>
                    ) : item.actionStatus === 'success' ? (
                      <span className="text-emerald-400 text-xs font-semibold flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> {t('common.purged')}
                      </span>
                    ) : (
                      <span
                        className="text-rose-400 text-xs font-semibold flex items-center justify-end gap-1"
                        title={item.actionMessage}
                      >
                        <XCircle className="w-3.5 h-3.5" /> {t('common.error')}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
