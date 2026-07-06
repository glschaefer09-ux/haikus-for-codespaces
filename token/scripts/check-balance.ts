import { PublicKey } from '@solana/web3.js';
import { getConnection } from '../lib/connection';
import { getTreasurySigner } from '../lib/keys';
import { fetchBalance } from '../lib/mint';
import { requireDeployment } from '../lib/deployments';

async function main() {
  const deployment = requireDeployment();
  const connection = getConnection();
  const mint = new PublicKey(deployment.mint);

  const addressArg = process.argv[2];
  const owner = addressArg ? new PublicKey(addressArg) : getTreasurySigner().publicKey;

  const { amount, ata } = await fetchBalance(connection, mint, owner);
  const humanAmount = Number(amount) / 10 ** deployment.decimals;

  console.log(`Owner:              ${owner.toBase58()}`);
  console.log(`Associated account: ${ata.toBase58()}`);
  console.log(`Balance:            ${humanAmount} ${deployment.symbol} (${amount} base units)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
