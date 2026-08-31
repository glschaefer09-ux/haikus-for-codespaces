import { useRef, useState, type KeyboardEvent } from 'react';
import { Brain, Send, Square } from 'lucide-react';
import clsx from 'clsx';
import { useChatStore } from '../../state/chatStore';
import { useSettingsStore, resolvedModel } from '../../state/settingsStore';
import { CLAUDE_MODELS } from '@shared/models';

export function Composer() {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const cancelActiveStream = useChatStore((s) => s.cancelActiveStream);
  const pending = useChatStore((s) => s.pending);
  const activeId = useChatStore((s) => s.activeId);
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.update);

  const isStreaming = Object.values(pending).some((p) => p.conversationId === activeId);
  const model = resolvedModel(settings);
  const deepThinking = settings?.deepThinking ?? false;

  function handleSend() {
    const content = value.trim();
    if (!content || isStreaming) return;
    setValue('');
    void sendMessage(content, model, deepThinking);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-zinc-800 dark:bg-[#0B0B12]/80">
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <div className="flex items-end gap-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-zinc-800 dark:bg-zinc-900">
          <textarea
            ref={textareaRef}
            rows={1}
            className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
            placeholder="Message Claude..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              const el = e.target;
              el.style.height = 'auto';
              el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
            }}
            onKeyDown={handleKeyDown}
          />
          {isStreaming ? (
            <button
              type="button"
              className="btn-secondary shrink-0"
              onClick={() => cancelActiveStream()}
              aria-label="Stop generating"
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary shrink-0"
              onClick={handleSend}
              disabled={!value.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between px-1 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <select
              className="rounded-md border-none bg-transparent py-0.5 text-xs text-zinc-500 outline-none dark:text-zinc-400"
              value={model}
              onChange={(e) => void updateSettings({ model: e.target.value })}
            >
              {CLAUDE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void updateSettings({ deepThinking: !deepThinking })}
              className={clsx(
                'flex items-center gap-1 rounded-full border px-2 py-0.5 transition',
                deepThinking
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-zinc-200 text-zinc-400 dark:border-zinc-700',
              )}
            >
              <Brain className="h-3 w-3" />
              Deep thinking
            </button>
          </div>
          <span>Enter to send, Shift+Enter for a new line</span>
        </div>
      </div>
    </div>
  );
}
