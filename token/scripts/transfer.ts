import { PublicKey } from '@solana/web3.js';
import { getConnection, explorerUrl } from '../lib/connection';
import { getPayerKeypair, loadKeypair } from '../lib/keys';
import { transferTokens } from '../lib/mint';
import { requireDeployment } from '../lib/deployments';

function usage(): never {
  console.error('Usage: npm run token:transfer -- <fromKeypairPath> <toPubkey> <amount>');
  console.error('  <amount> is in human units (e.g. 1.5 GATOR), not base units.');
  process.exit(1);
}

async function main() {
  const [fromKeypairPath, toAddress, amountArg] = process.argv.slice(2);
  if (!fromKeypairPath || !toAddress || !amountArg) usage();

  const deployment = requireDeployment();
  const connection = getConnection();
  const payer = getPayerKeypair();
  const mint = new PublicKey(deployment.mint);

  const fromOwner = loadKeypair(fromKeypairPath);
  const toOwner = new PublicKey(toAddress);

  const humanAmount = Number(amountArg);
  if (!Number.isFinite(humanAmount) || humanAmount <= 0) {
    console.error(`Invalid amount: ${amountArg}`);
    process.exit(1);
  }
  const baseUnits = BigInt(Math.round(humanAmount * 10 ** deployment.decimals));

  const signature = await transferTokens(connection, payer, mint, deployment.decimals, fromOwner, toOwner, baseUnits);

  console.log(`Transferred ${humanAmount} ${deployment.symbol}`);
  console.log(`From: ${fromOwner.publicKey.toBase58()}`);
  console.log(`To:   ${toOwner.toBase58()}`);
  console.log(`Tx:   ${explorerUrl('tx', signature)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
