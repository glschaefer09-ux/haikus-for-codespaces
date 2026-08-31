import { useState } from 'react';
import { KeyRound, Laptop, Moon, Sun, SunMoon, X } from 'lucide-react';
import clsx from 'clsx';
import { useSettingsStore } from '../../state/settingsStore';
import { SyncSection } from './SyncSection';
import { MemorySection } from './MemorySection';
import type { Theme } from '@shared/types';

interface SettingsPanelProps {
  onClose: () => void;
}

const THEME_OPTIONS: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: SunMoon },
];

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);
  const [rotating, setRotating] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [keyError, setKeyError] = useState<string | null>(null);
  const [keySaved, setKeySaved] = useState(false);

  async function handleRotateKey() {
    setKeyError(null);
    const result = await window.crosspcai.key.validateAndStore(newKey);
    if (!result.ok) {
      setKeyError(result.error ?? 'Could not save that key.');
      return;
    }
    setRotating(false);
    setNewKey('');
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl animate-slide-up dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-5">
          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              Appearance
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => void update({ theme: value })}
                  className={clsx(
                    'flex flex-col items-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs transition',
                    settings?.theme === value
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                      : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              Anthropic API key
            </h3>
            {!rotating ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm dark:border-zinc-800">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                  <KeyRound className="h-4 w-4" />
                  {keySaved ? 'Key updated' : 'Key configured'}
                </span>
                <button
                  type="button"
                  className="text-sm text-brand-600 hover:underline dark:text-brand-400"
                  onClick={() => setRotating(true)}
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  autoFocus
                  className="input"
                  placeholder="sk-ant-..."
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
                {keyError && <p className="text-xs text-red-500">{keyError}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-secondary flex-1"
                    onClick={() => {
                      setRotating(false);
                      setNewKey('');
                      setKeyError(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary flex-1"
                    disabled={!newKey.trim()}
                    onClick={() => void handleRotateKey()}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              This device
            </h3>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
              <Laptop className="h-4 w-4" />
              {settings?.deviceName ?? 'This computer'}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              Memory
            </h3>
            <MemorySection />
          </section>

          <section>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Sync</h3>
            <SyncSection />
          </section>
        </div>
      </div>
    </div>
  );
}
