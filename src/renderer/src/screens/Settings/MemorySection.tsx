import { useEffect, useState } from 'react';
import { BrainCircuit, Loader2, Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useSettingsStore } from '../../state/settingsStore';
import type { Memory } from '@shared/types';

export function MemorySection() {
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);
  const enabled = settings?.memoryEnabled ?? true;

  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);

  async function refresh() {
    const list = await window.crosspcai.memory.list();
    setMemories(list);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    void window.crosspcai.memory.list().then((list) => {
      if (cancelled) return;
      setMemories(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAdd() {
    const content = draft.trim();
    if (!content) return;
    setAdding(true);
    await window.crosspcai.memory.add(content);
    setDraft('');
    setAdding(false);
    await refresh();
  }

  async function handleDelete(id: string) {
    await window.crosspcai.memory.delete(id);
    await refresh();
  }

  async function handleClear() {
    if (memories.length === 0) return;
    if (!window.confirm('Delete everything Claude remembers about you?')) return;
    await window.crosspcai.memory.clear();
    await refresh();
  }

  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
          <BrainCircuit className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Memory</h3>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-label="Toggle memory"
              onClick={() => void update({ memoryEnabled: !enabled })}
              className={clsx(
                'relative h-5 w-9 shrink-0 rounded-full transition',
                enabled ? 'bg-brand-600' : 'bg-zinc-300 dark:bg-zinc-700',
              )}
            >
              <span
                className={clsx(
                  'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                  enabled ? 'translate-x-4' : 'translate-x-0.5',
                )}
              />
            </button>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Claude can save durable facts about you or your projects and recall them in later
            chats. Everything stays on this device.
          </p>

          {enabled && (
            <div className="mt-3 flex flex-col gap-2">
              {loading ? (
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
                </div>
              ) : memories.length === 0 ? (
                <p className="rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs text-zinc-400 dark:border-zinc-700">
                  Nothing remembered yet.
                </p>
              ) : (
                <ul className="flex max-h-48 flex-col gap-1.5 overflow-y-auto pr-1">
                  {memories.map((memory) => (
                    <li
                      key={memory.id}
                      className="flex items-start justify-between gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
                    >
                      <span className="min-w-0 flex-1 break-words">{memory.content}</span>
                      <button
                        type="button"
                        onClick={() => void handleDelete(memory.id)}
                        className="shrink-0 text-zinc-400 hover:text-red-500"
                        aria-label="Forget this"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  className="input"
                  placeholder="Add something to remember…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void handleAdd();
                  }}
                />
                <button
                  type="button"
                  className="btn-secondary shrink-0 px-3"
                  disabled={!draft.trim() || adding}
                  onClick={() => void handleAdd()}
                  aria-label="Add memory"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {memories.length > 0 && (
                <button
                  type="button"
                  onClick={() => void handleClear()}
                  className="self-start text-xs text-zinc-400 hover:text-red-500 hover:underline"
                >
                  Forget everything
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
