import { getConnection, explorerUrl } from '../lib/connection';
import { getPayerKeypair, getTreasurySigner, getMintKeypair } from '../lib/keys';
import { createFixedSupplyMint, ensureAssociatedTokenAccount, mintSupply, fetchMint } from '../lib/mint';
import { getUmi, attachMetadata, readMetadata } from '../lib/metadata';
import { readDeployment, writeDeployment } from '../lib/deployments';
import { config } from '../lib/config';

async function main() {
  const connection = getConnection();
  const payer = getPayerKeypair();
  const treasury = getTreasurySigner();
  const mintKeypair = getMintKeypair();

  console.log(`Cluster: ${config.cluster}`);
  console.log(`Payer: ${payer.publicKey.toBase58()}`);
  console.log(`Treasury / mint authority: ${treasury.publicKey.toBase58()}`);
  console.log(`Mint address: ${mintKeypair.publicKey.toBase58()}`);

  const existing = readDeployment();
  if (existing && existing.mint !== mintKeypair.publicKey.toBase58()) {
    throw new Error(
      `A deployment record already exists for cluster "${config.cluster}" with a DIFFERENT mint ` +
      `(${existing.mint}) at token/deployments/${config.cluster}.json. Refusing to overwrite it.`
    );
  }

  // Each step below checks on-chain state first, so this script can safely resume
  // after a partial failure (e.g. steps 1-3 succeeded but metadata attachment failed).
  let onChainMint = await fetchMint(connection, mintKeypair.publicKey).catch(() => null);

  if (!onChainMint) {
    console.log('\nStep 1/4: creating mint...');
    await createFixedSupplyMint(connection, payer, treasury.publicKey, config.tokenDecimals, mintKeypair);
    onChainMint = await fetchMint(connection, mintKeypair.publicKey);
    console.log(`Mint created: ${explorerUrl('address', mintKeypair.publicKey.toBase58())}`);
  } else {
    console.log('\nStep 1/4: mint already exists on-chain, skipping.');
  }
  const mint = mintKeypair.publicKey;

  console.log('\nStep 2/4: ensuring treasury associated token account...');
  const treasuryAta = await ensureAssociatedTokenAccount(connection, payer, mint, treasury.publicKey);
  console.log(`Treasury ATA: ${treasuryAta.address.toBase58()}`);

  let mintTxSig = existing?.transactions?.mintTo;
  if (onChainMint.supply === 0n) {
    console.log('\nStep 3/4: minting fixed supply...');
    const baseUnits = config.tokenTotalSupply * 10n ** BigInt(config.tokenDecimals);
    mintTxSig = await mintSupply(connection, payer, mint, treasuryAta.address, treasury, baseUnits, config.tokenDecimals);
    console.log(`Minted ${config.tokenTotalSupply} ${config.tokenSymbol}: ${explorerUrl('tx', mintTxSig)}`);
  } else {
    console.log(`\nStep 3/4: supply already minted (${onChainMint.supply} base units), skipping.`);
  }

  const umi = getUmi(connection.rpcEndpoint);
  let metadataTxSig = existing?.transactions?.createMetadata;
  const existingMetadata = await readMetadata(umi, mint);
  if (!existingMetadata) {
    console.log('\nStep 4/4: attaching on-chain metadata...');
    metadataTxSig = await attachMetadata(
      umi,
      mint,
      payer,
      treasury,
      config.tokenName,
      config.tokenSymbol,
      config.tokenMetadataUri,
      true
    );
    console.log(`Metadata attached: ${metadataTxSig}`);
  } else {
    console.log('\nStep 4/4: metadata already attached, skipping.');
  }

  writeDeployment({
    cluster: config.cluster,
    mint: mint.toBase58(),
    treasury: treasury.publicKey.toBase58(),
    decimals: config.tokenDecimals,
    totalSupply: config.tokenTotalSupply.toString(),
    name: config.tokenName,
    symbol: config.tokenSymbol,
    metadataUri: config.tokenMetadataUri,
    mintAuthorityRevoked: existing?.mintAuthorityRevoked ?? false,
    transactions: {
      ...existing?.transactions,
      mintTo: mintTxSig,
      createMetadata: metadataTxSig,
    },
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  console.log(`\nDeployment record written to token/deployments/${config.cluster}.json`);
  console.log('\nMint authority is still ACTIVE. Run "npm run token:info" to verify everything,');
  console.log('then run "npm run token:revoke-mint-authority" to permanently fix the supply.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
