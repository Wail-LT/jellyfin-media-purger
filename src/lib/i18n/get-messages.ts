import en from '@/messages/en.json';
import fr from '@/messages/fr.json';
import type { Locale, Messages } from './types';

const messages: Record<Locale, Messages> = { en, fr };

export function getMessagesSync(locale: Locale): Messages {
  return messages[locale];
}
