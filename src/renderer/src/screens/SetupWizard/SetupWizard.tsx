import { useState } from 'react';
import { Logo } from '../../components/Logo';
import { WelcomeStep } from './WelcomeStep';
import { AnthropicKeyStep } from './AnthropicKeyStep';
import { DoneStep } from './DoneStep';

type Step = 'welcome' | 'key' | 'done';

interface SetupWizardProps {
  onComplete: () => void;
}

export function SetupWizard({ onComplete }: SetupWizardProps) {
  const [step, setStep] = useState<Step>('welcome');

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-[#0B0B12] dark:via-[#0B0B12] dark:to-[#1a1030]">
      <div className="w-full max-w-md animate-slide-up px-6">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo size={56} />
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Cross PC AI</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Chat with Claude. Pick up right where you left off, on any of your PCs.
          </p>
        </div>

        <div className="card animate-fade-in p-6">
          {step === 'welcome' && <WelcomeStep onNext={() => setStep('key')} />}
          {step === 'key' && (
            <AnthropicKeyStep onBack={() => setStep('welcome')} onNext={() => setStep('done')} />
          )}
          {step === 'done' && <DoneStep onFinish={onComplete} />}
        </div>

        <div className="mt-5 flex justify-center gap-1.5">
          {(['welcome', 'key', 'done'] as const).map((s) => (
            <span
              key={s}
              className={`h-1.5 w-1.5 rounded-full transition ${
                s === step ? 'bg-brand-600 w-4' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
