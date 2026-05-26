'use client';

import AppHeader from '@/components/layout/AppHeader';
import WarningBanner from '@/components/layout/WarningBanner';
import DocumentTitle from '@/components/layout/DocumentTitle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <DocumentTitle />
      <AppHeader />
      <WarningBanner />
      <main className="container mx-auto px-4 py-6 max-w-7xl">{children}</main>
    </div>
  );
}
