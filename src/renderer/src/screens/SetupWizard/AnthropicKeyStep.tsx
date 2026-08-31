import { useState, type FormEvent } from 'react';
import { ArrowLeft, KeyRound, Loader2 } from 'lucide-react';

interface AnthropicKeyStepProps {
  onBack: () => void;
  onNext: () => void;
}

export function AnthropicKeyStep({ onBack, onNext }: AnthropicKeyStepProps) {
  const [key, setKey] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(null);
    const result = await window.crosspcai.key.validateAndStore(key);
    setChecking(false);
    if (!result.ok) {
      setError(result.error ?? 'Something went wrong verifying that key.');
      return;
    }
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Add your Anthropic API key</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Stored securely on this device only — it never leaves your computer.
        </p>
      </div>

      <div className="relative">
        <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="password"
          autoFocus
          className="input pl-9"
          placeholder="sk-ant-..."
          value={key}
          onChange={(e) => setKey(e.target.value)}
          spellCheck={false}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <a
        href="https://console.anthropic.com/settings/keys"
        onClick={(e) => {
          e.preventDefault();
          void window.crosspcai.system.openExternal('https://console.anthropic.com/settings/keys');
        }}
        className="text-sm text-brand-600 hover:underline dark:text-brand-400"
      >
        Get an API key from console.anthropic.com →
      </a>

      <div className="mt-2 flex gap-2">
        <button type="button" className="btn-secondary" onClick={onBack} disabled={checking}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button type="submit" className="btn-primary flex-1" disabled={!key.trim() || checking}>
          {checking && <Loader2 className="h-4 w-4 animate-spin" />}
          {checking ? 'Verifying...' : 'Continue'}
        </button>
      </div>
    </form>
  );
}
