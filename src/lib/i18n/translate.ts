import type { Messages } from './types';

type Params = Record<string, string | number>;

function resolveKey(messages: Messages, key: string): unknown {
  return key.split('.').reduce<unknown>((obj, part) => {
    if (obj && typeof obj === 'object' && part in obj) {
      return (obj as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);
}

export function translate(messages: Messages, key: string, params?: Params): string {
  const value = resolveKey(messages, key);
  if (typeof value !== 'string') return key;

  if (!params) return value;

  return value.replace(/\{(\w+)\}/g, (_, param: string) =>
    params[param] !== undefined ? String(params[param]) : `{${param}}`,
  );
}

export type TranslateFn = (key: string, params?: Params) => string;

export function createTranslator(messages: Messages): TranslateFn {
  return (key, params) => translate(messages, key, params);
}
