import { Laptop, Sparkles, Zap } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Let&apos;s get set up</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Two quick steps and you&apos;ll be chatting.
        </p>
      </div>

      <ul className="flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-300">
        <li className="flex items-start gap-3">
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <span>Bring your own Anthropic API key — your conversations run on your account.</span>
        </li>
        <li className="flex items-start gap-3">
          <Laptop className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <span>Chats are saved on this device automatically, no account required.</span>
        </li>
        <li className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <span>Turn on Cross PC Sync any time to continue a chat on another computer.</span>
        </li>
      </ul>

      <button type="button" className="btn-primary w-full" onClick={onNext}>
        Get started
      </button>
    </div>
  );
}
