import { Cloud, Lock } from 'lucide-react';
import { isSyncConfigured, SYNC_SUBSCRIPTION_PRICE_USD } from '@shared/constants';

export function SyncSection() {
  const configured = isSyncConfigured();

  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
          <Cloud className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Cross PC Sync</h3>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              ${SYNC_SUBSCRIPTION_PRICE_USD}/mo
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Continue any conversation on another PC, live. Your Anthropic key stays local either
            way — this only syncs conversation history.
          </p>

          {configured ? (
            <button type="button" className="btn-primary mt-3">
              Upgrade to Cross PC Sync
            </button>
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs text-zinc-400 dark:border-zinc-700">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              Sync isn&apos;t connected on this build yet. Chats stay saved on this device.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
