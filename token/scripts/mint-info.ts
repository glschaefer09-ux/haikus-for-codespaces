import { PublicKey } from '@solana/web3.js';
import { getConnection, explorerUrl } from '../lib/connection';
import { fetchMint } from '../lib/mint';
import { getUmi, readMetadata } from '../lib/metadata';
import { requireDeployment } from '../lib/deployments';

async function main() {
  const deployment = requireDeployment();
  const connection = getConnection();
  const mint = new PublicKey(deployment.mint);

  const onChainMint = await fetchMint(connection, mint);
  const humanSupply = onChainMint.supply / 10n ** BigInt(onChainMint.decimals);

  const umi = getUmi(connection.rpcEndpoint);
  const metadata = await readMetadata(umi, mint);

  console.log(`Mint address:        ${mint.toBase58()}`);
  console.log(`Explorer:            ${explorerUrl('address', mint.toBase58())}`);
  console.log(`Decimals:            ${onChainMint.decimals}`);
  console.log(`Supply (base units): ${onChainMint.supply}`);
  console.log(`Supply (human):      ${humanSupply}`);
  console.log(`Mint authority:      ${onChainMint.mintAuthority ? onChainMint.mintAuthority.toBase58() : 'None (revoked -- supply is permanently fixed)'}`);
  console.log(`Freeze authority:    ${onChainMint.freezeAuthority ? onChainMint.freezeAuthority.toBase58() : 'None'}`);
  console.log(`Deployment record says mintAuthorityRevoked: ${deployment.mintAuthorityRevoked}`);

  if (metadata) {
    console.log(`\nMetadata name:       ${metadata.name.replace(/\0/g, '')}`);
    console.log(`Metadata symbol:     ${metadata.symbol.replace(/\0/g, '')}`);
    console.log(`Metadata URI:        ${metadata.uri.replace(/\0/g, '')}`);
    console.log(`Metadata mutable:    ${metadata.isMutable}`);
    console.log(`Update authority:    ${metadata.updateAuthority.toString()}`);
  } else {
    console.log('\nNo on-chain metadata found for this mint.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
