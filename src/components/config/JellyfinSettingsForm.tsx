'use client';

import { useState } from 'react';
import { RefreshCw, UserCheck } from 'lucide-react';
import type { AppConfigPublic, AppConfigUpdate } from '@/types/config';
import type { JellyfinUser } from '@/types/jellyfin';
import { useTranslations } from '@/providers/I18nProvider';

interface Props {
  config: AppConfigPublic;
  onSave: (updates: AppConfigUpdate) => Promise<void>;
  saving: boolean;
}

export default function JellyfinSettingsForm({ config, onSave, saving }: Props) {
  const { t } = useTranslations();
  const [url, setUrl] = useState(config.jellyfin_url);
  const [apiKey, setApiKey] = useState('');
  const [userId, setUserId] = useState(config.jellyfin_user_id);
  const [users, setUsers] = useState<JellyfinUser[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');

  const handleFetchUsers = async () => {
    setFetchingUsers(true);
    setUsersError('');
    await onSave({ jellyfin_url: url, jellyfin_api_key: apiKey || undefined });
    try {
      const res = await fetch('/api/jellyfin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to fetch users');
      setUsers(data.users);
      if (data.users.length > 0 && !userId) setUserId(data.users[0].Id);
    } catch (e: unknown) {
      setUsersError(e instanceof Error ? e.message : String(e));
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      jellyfin_url: url,
      jellyfin_api_key: apiKey || undefined,
      jellyfin_user_id: userId,
    });
  };

  const currentKey = config.jellyfin_api_key_masked || t('common.notSet');

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-5">
        <span className="text-2xl">📺</span>
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{t('config.jellyfinTitle')}</h3>
          <p className="text-xs text-slate-400">{t('config.jellyfinSubtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t('config.serverUrl')}
          </label>
          <input
            type="url"
            placeholder="http://192.168.1.100:8096"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t('config.adminApiKey')}
          </label>
          <input
            type="password"
            placeholder={config.jellyfin_api_key_masked || t('common.enterApiKey')}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-slate-500 mt-1">
            {t('config.keepExistingKey', { key: currentKey })}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleFetchUsers}
            disabled={fetchingUsers || saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 text-white rounded-lg py-2 text-sm font-semibold transition flex items-center justify-center space-x-2"
          >
            {fetchingUsers ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
            <span>{fetchingUsers ? t('common.connecting') : t('config.fetchUsers')}</span>
          </button>
          {usersError && <p className="text-xs text-rose-400 mt-2">{usersError}</p>}
        </div>

        {users.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t('config.activeUser')}
            </label>
            <select
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              <option value="">{t('config.selectUser')}</option>
              {users.map((u) => (
                <option key={u.Id} value={u.Id}>
                  {u.Name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-semibold transition"
        >
          {saving ? t('common.saving') : t('config.saveJellyfin')}
        </button>
      </form>
    </div>
  );
}
