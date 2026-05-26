'use client';

import { useEffect } from 'react';
import { useTranslations } from '@/providers/I18nProvider';

export default function DocumentTitle() {
  const { t } = useTranslations();

  useEffect(() => {
    document.title = t('metadata.title');
  }, [t]);

  return null;
}
