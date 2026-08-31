import Store from 'electron-store';
import { randomUUID } from 'node:crypto';
import { hostname } from 'node:os';
import type { AppSettings } from '@shared/types';
import { DEFAULT_MODEL_ID } from '@shared/models';

interface StoreSchema {
  settings: AppSettings;
}

const store = new Store<StoreSchema>({
  defaults: {
    settings: {
      theme: 'system',
      model: DEFAULT_MODEL_ID,
      deepThinking: false,
      deviceId: randomUUID(),
      deviceName: hostname(),
      onboarded: false,
      memoryEnabled: true,
    },
  },
});

export function getSettings(): AppSettings {
  return store.get('settings');
}

export function updateSettings(patch: Partial<AppSettings>): AppSettings {
  const next = { ...store.get('settings'), ...patch };
  store.set('settings', next);
  return next;
}
