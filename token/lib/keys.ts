import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Keypair } from '@solana/web3.js';
import { config } from './config';

function readKeypairFile(filePath: string): Keypair {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const secretKey = Uint8Array.from(JSON.parse(raw));
  return Keypair.fromSecretKey(secretKey);
}

function writeKeypairFile(filePath: string, keypair: Keypair): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(Array.from(keypair.secretKey)));
}

export function loadKeypair(filePath: string): Keypair {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Keypair file not found: ${filePath}`);
  }
  return readKeypairFile(filePath);
}

export function loadOrCreateKeypair(filePath: string, label: string): Keypair {
  if (fs.existsSync(filePath)) {
    return readKeypairFile(filePath);
  }
  const keypair = Keypair.generate();
  writeKeypairFile(filePath, keypair);
  console.log(`Generated new ${label} keypair at ${filePath} (public key: ${keypair.publicKey.toBase58()}).`);
  console.log(`IMPORTANT: back this file up. Losing it means losing control of the ${label}.`);
  return keypair;
}

// The Solana CLI's own default keypair, used as the fee/rent payer for devnet work.
function defaultCliKeypairPath(): string {
  return path.join(os.homedir(), '.config', 'solana', 'id.json');
}

export function getPayerKeypair(): Keypair {
  const filePath = config.payerKeypairPath || defaultCliKeypairPath();
  return loadKeypair(filePath);
}

// Single point of access for the treasury/mint-authority signer, so swapping in a
// hardware wallet or multisig later (required before any mainnet use) is a localized change.
export function getTreasurySigner(): Keypair {
  return loadOrCreateKeypair(config.treasuryKeypairPath, 'treasury/mint-authority');
}

export function getMintKeypair(): Keypair {
  return loadOrCreateKeypair(config.mintKeypairPath, 'mint');
}
