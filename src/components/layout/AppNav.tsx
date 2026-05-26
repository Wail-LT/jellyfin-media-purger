'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sliders, Settings, Database } from 'lucide-react';
import { useTranslations } from '@/providers/I18nProvider';

const NAV_ITEMS = [
  { href: '/scan', key: 'nav.scan', icon: Sliders },
  { href: '/config', key: 'nav.config', icon: Settings },
  { href: '/logs', key: 'nav.logs', icon: Database },
] as const;

export default function AppNav() {
  const pathname = usePathname();
  const { t } = useTranslations();

  return (
    <nav className="flex space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
      {NAV_ITEMS.map(({ href, key, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              active
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{t(key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
