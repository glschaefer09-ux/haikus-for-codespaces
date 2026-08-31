import { create } from 'zustand';
import type { AppSettings } from '@shared/types';
import { DEFAULT_MODEL_ID } from '@shared/models';

interface SettingsState {
  settings: AppSettings | null;
  loading: boolean;
  load: () => Promise<void>;
  update: (patch: Partial<AppSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loading: true,
  load: async () => {
    const settings = await window.crosspcai.settings.get();
    set({ settings, loading: false });
  },
  update: async (patch) => {
    const current = get().settings;
    set({ settings: current ? { ...current, ...patch } : current });
    const settings = await window.crosspcai.settings.update(patch);
    set({ settings });
  },
}));

export function resolvedModel(settings: AppSettings | null): string {
  return settings?.model ?? DEFAULT_MODEL_ID;
}
