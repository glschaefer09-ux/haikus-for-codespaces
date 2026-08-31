export interface ClaudeModelOption {
  id: string;
  label: string;
  description: string;
}

export const CLAUDE_MODELS: ClaudeModelOption[] = [
  {
    id: 'claude-opus-4-8',
    label: 'Claude Opus 4.8',
    description: 'Most capable — best for hard, open-ended problems.',
  },
  {
    id: 'claude-sonnet-5',
    label: 'Claude Sonnet 5',
    description: 'Balanced speed and capability. Recommended default.',
  },
  {
    id: 'claude-haiku-4-5',
    label: 'Claude Haiku 4.5',
    description: 'Fastest — best for quick, simple questions.',
  },
];

export const DEFAULT_MODEL_ID = 'claude-sonnet-5';
