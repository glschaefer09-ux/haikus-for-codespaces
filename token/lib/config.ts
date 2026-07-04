import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const config = {
  cluster: process.env.SOLANA_CLUSTER || 'devnet',
  rpcUrl: process.env.SOLANA_RPC_URL || '',

  payerKeypairPath: process.env.PAYER_KEYPAIR_PATH || '',
  treasuryKeypairPath: process.env.TREASURY_KEYPAIR_PATH || path.join('token', 'keys', 'treasury-keypair.json'),
  mintKeypairPath: process.env.MINT_KEYPAIR_PATH || path.join('token', 'keys', 'mint-keypair.json'),

  get tokenName(): string {
    return required('TOKEN_NAME');
  },
  get tokenSymbol(): string {
    return required('TOKEN_SYMBOL');
  },
  get tokenDecimals(): number {
    return parseInt(required('TOKEN_DECIMALS'), 10);
  },
  get tokenTotalSupply(): bigint {
    return BigInt(required('TOKEN_TOTAL_SUPPLY'));
  },
  get tokenMetadataUri(): string {
    return required('TOKEN_METADATA_URI');
  },
};

export function deploymentPath(): string {
  return path.join('token', 'deployments', `${config.cluster}.json`);
}
