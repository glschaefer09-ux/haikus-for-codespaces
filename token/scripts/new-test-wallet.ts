import * as path from 'path';
import { loadOrCreateKeypair } from '../lib/keys';

function main() {
  const label = process.argv[2] || 'test-wallet-2';
  const filePath = path.join('token', 'keys', `${label}.json`);
  const keypair = loadOrCreateKeypair(filePath, label);
  console.log(`Wallet "${label}" public key: ${keypair.publicKey.toBase58()}`);
  console.log(`Keypair file: ${filePath}`);
  console.log(`Fund it with: npm run token:airdrop -- ${keypair.publicKey.toBase58()}`);
}

main();
