import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getConnection } from '../lib/connection';
import { getPayerKeypair } from '../lib/keys';
import { config } from '../lib/config';

async function main() {
  if (config.cluster !== 'devnet') {
    console.error(
      `Refusing to airdrop on cluster "${config.cluster}" -- there is no public faucet outside of devnet.`
    );
    process.exit(1);
  }

  const connection = getConnection();
  const addressArg = process.argv[2];
  const amountArg = process.argv[3];

  const target = addressArg ? new PublicKey(addressArg) : getPayerKeypair().publicKey;
  const sol = amountArg ? Number(amountArg) : 2;

  console.log(`Requesting airdrop of ${sol} SOL to ${target.toBase58()} on devnet...`);
  const signature = await connection.requestAirdrop(target, sol * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(signature, 'confirmed');
  console.log(`Airdrop confirmed: ${signature}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
