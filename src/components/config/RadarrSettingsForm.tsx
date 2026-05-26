'use client';

import { useState } from 'react';
import { Film } from 'lucide-react';
import type { AppConfigPublic, AppConfigUpdate } from '@/types/config';
import { useTranslations } from '@/providers/I18nProvider';

interface Props {
  config: AppConfigPublic;
  onSave: (updates: AppConfigUpdate) => Promise<void>;
  saving: boolean;
}

export default function RadarrSettingsForm({ config, onSave, saving }: Props) {
  const { t } = useTranslations();
  const [url, setUrl] = useState(config.radarr_url);
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ radarr_url: url, radarr_api_key: apiKey || undefined });
  };

  const currentKey = config.radarr_api_key_masked || t('common.notSet');

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-5">
        <Film className="w-5 h-5 text-cyan-400" />
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{t('config.radarrTitle')}</h3>
          <p className="text-xs text-slate-400">{t('config.radarrSubtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              {t('config.url')}
            </label>
            <input
              type="url"
              placeholder="http://localhost:7878"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              {t('config.apiKey')}
            </label>
            <input
              type="password"
              placeholder={config.radarr_api_key_masked || t('common.enterApiKey')}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
        <p className="text-xs text-slate-500">
          {t('config.keepExistingRadarrKey', { key: currentKey })}
        </p>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-semibold transition"
        >
          {saving ? t('common.saving') : t('config.saveRadarr')}
        </button>
      </form>
    </div>
  );
}
