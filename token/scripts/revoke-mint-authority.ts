import { PublicKey } from '@solana/web3.js';
import { getConnection, explorerUrl } from '../lib/connection';
import { getPayerKeypair, getTreasurySigner } from '../lib/keys';
import { revokeMintAuthority, fetchMint } from '../lib/mint';
import { requireDeployment, writeDeployment } from '../lib/deployments';
import { config } from '../lib/config';

async function main() {
  const deployment = requireDeployment();
  if (deployment.mintAuthorityRevoked) {
    console.log('Mint authority was already revoked according to the deployment record. Nothing to do.');
    return;
  }

  const connection = getConnection();
  const payer = getPayerKeypair();
  const treasury = getTreasurySigner();
  const mint = new PublicKey(deployment.mint);

  const onChainMint = await fetchMint(connection, mint);
  console.log(`Current on-chain supply: ${onChainMint.supply} base units (mint ${mint.toBase58()}).`);
  console.log('This action is IRREVERSIBLE: no more Gator Coin can ever be minted after this.');

  const signature = await revokeMintAuthority(connection, payer, mint, treasury);
  console.log(`Mint authority revoked: ${explorerUrl('tx', signature)}`);

  writeDeployment({
    ...deployment,
    mintAuthorityRevoked: true,
    transactions: { ...deployment.transactions, revokeMintAuthority: signature },
    updatedAt: new Date().toISOString(),
  });

  console.log(`Deployment record updated at token/deployments/${config.cluster}.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
