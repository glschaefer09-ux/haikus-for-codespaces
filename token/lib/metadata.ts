import { PublicKey as Web3PublicKey, Keypair } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  mplTokenMetadata,
  createV1,
  TokenStandard,
  fetchMetadata,
  findMetadataPda,
  Metadata,
} from '@metaplex-foundation/mpl-token-metadata';
import { keypairIdentity, keypairPayer, percentAmount, Umi } from '@metaplex-foundation/umi';
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

export function getUmi(rpcUrl: string): Umi {
  return createUmi(rpcUrl).use(mplTokenMetadata());
}

export async function attachMetadata(
  umi: Umi,
  mint: Web3PublicKey,
  payer: Keypair,
  treasury: Keypair,
  name: string,
  symbol: string,
  uri: string,
  isMutable: boolean
): Promise<string> {
  // Treasury signs as the mint/update authority, but it may hold no SOL --
  // the funded payer wallet covers transaction fees and rent separately.
  umi.use(keypairIdentity(fromWeb3JsKeypair(treasury), false));
  umi.use(keypairPayer(fromWeb3JsKeypair(payer)));

  const { signature } = await createV1(umi, {
    mint: fromWeb3JsPublicKey(mint),
    authority: umi.identity,
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: percentAmount(0),
    tokenStandard: TokenStandard.Fungible,
    isMutable,
  }).sendAndConfirm(umi);

  return Buffer.from(signature).toString('base64');
}

export async function readMetadata(umi: Umi, mint: Web3PublicKey): Promise<Metadata | null> {
  const pda = findMetadataPda(umi, { mint: fromWeb3JsPublicKey(mint) });
  try {
    return await fetchMetadata(umi, pda);
  } catch {
    return null;
  }
}
