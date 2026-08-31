import { app, safeStorage } from 'electron';
import { mkdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import type { ValidateKeyResult } from '@shared/types';

const keyFilePath = () => join(app.getPath('userData'), 'anthropic-key.enc');

function ensureDir(path: string): void {
  mkdirSync(dirname(path), { recursive: true });
}

export function hasStoredKey(): boolean {
  return existsSync(keyFilePath());
}

export function readStoredKey(): string | null {
  const path = keyFilePath();
  if (!existsSync(path)) return null;
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error(
      'OS secure storage is unavailable, so the saved key cannot be decrypted. Re-enter your API key.',
    );
  }
  const encrypted = readFileSync(path);
  return safeStorage.decryptString(encrypted);
}

function storeKey(rawKey: string): void {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error(
      'OS secure storage is unavailable on this device, so the API key cannot be saved securely.',
    );
  }
  const path = keyFilePath();
  ensureDir(path);
  writeFileSync(path, safeStorage.encryptString(rawKey));
}

export function clearStoredKey(): void {
  const path = keyFilePath();
  if (existsSync(path)) unlinkSync(path);
}

/**
 * A models.retrieve() call costs no tokens, so it's used purely to confirm
 * the key is well-formed and authorized before we persist it.
 */
export async function validateAndStoreKey(rawKey: string): Promise<ValidateKeyResult> {
  const trimmed = rawKey.trim();
  if (!trimmed) {
    return { ok: false, error: 'Enter an API key.' };
  }
  try {
    const client = new Anthropic({ apiKey: trimmed });
    await client.models.retrieve('claude-haiku-4-5');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('401') || /invalid.*key/i.test(message)) {
      return { ok: false, error: 'That API key was rejected by Anthropic. Double-check it and try again.' };
    }
    return { ok: false, error: `Could not verify the key: ${message}` };
  }
  storeKey(trimmed);
  return { ok: true };
}

export function createAnthropicClient(): Anthropic {
  const key = readStoredKey();
  if (!key) {
    throw new Error('No Anthropic API key is configured yet.');
  }
  return new Anthropic({ apiKey: key });
}
