import { CheckCircle2 } from 'lucide-react';

interface DoneStepProps {
  onFinish: () => void;
}

export function DoneStep({ onFinish }: DoneStepProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <CheckCircle2 className="h-10 w-10 text-brand-600" />
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">You&apos;re all set</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Start a conversation. You can turn on Cross PC Sync any time from Settings.
        </p>
      </div>
      <button type="button" className="btn-primary w-full" onClick={onFinish}>
        Start chatting
      </button>
    </div>
  );
}
