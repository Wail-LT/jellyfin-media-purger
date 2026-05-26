import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/providers/I18nProvider';

export const metadata: Metadata = {
  title: 'Jellyfin Movie Purger',
  description: 'Identify and safely delete fully viewed movies across Jellyfin and Radarr',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
