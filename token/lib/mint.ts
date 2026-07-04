import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
  mintToChecked,
  transferChecked,
  setAuthority,
  AuthorityType,
  getMint,
  getAccount,
  Mint,
  Account,
  TokenAccountNotFoundError,
} from '@solana/spl-token';

export async function createFixedSupplyMint(
  connection: Connection,
  payer: Keypair,
  mintAuthority: PublicKey,
  decimals: number,
  mintKeypair: Keypair
): Promise<PublicKey> {
  return createMint(
    connection,
    payer,
    mintAuthority,
    null, // freeze authority: none
    decimals,
    mintKeypair
  );
}

export async function ensureAssociatedTokenAccount(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  owner: PublicKey
): Promise<Account> {
  return getOrCreateAssociatedTokenAccount(connection, payer, mint, owner);
}

export async function mintSupply(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  destination: PublicKey,
  authority: Keypair,
  amount: bigint,
  decimals: number
): Promise<string> {
  return mintToChecked(connection, payer, mint, destination, authority, amount, decimals);
}

export async function fetchMint(connection: Connection, mint: PublicKey): Promise<Mint> {
  return getMint(connection, mint);
}

export async function fetchBalance(
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey
): Promise<{ amount: bigint; ata: PublicKey } > {
  const ata = await getAssociatedTokenAddress(mint, owner);
  try {
    const account = await getAccount(connection, ata);
    return { amount: account.amount, ata };
  } catch (err) {
    if (err instanceof TokenAccountNotFoundError) {
      return { amount: 0n, ata };
    }
    throw err;
  }
}

export async function transferTokens(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  decimals: number,
  fromOwner: Keypair,
  toOwner: PublicKey,
  amount: bigint
): Promise<string> {
  const fromAta = await getOrCreateAssociatedTokenAccount(connection, payer, mint, fromOwner.publicKey);
  const toAta = await getOrCreateAssociatedTokenAccount(connection, payer, mint, toOwner);
  return transferChecked(
    connection,
    payer,
    fromAta.address,
    mint,
    toAta.address,
    fromOwner,
    amount,
    decimals
  );
}

export async function revokeMintAuthority(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  currentAuthority: Keypair
): Promise<string> {
  return setAuthority(connection, payer, mint, currentAuthority, AuthorityType.MintTokens, null);
}
