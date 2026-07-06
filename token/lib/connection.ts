import { Connection, Cluster, clusterApiUrl } from '@solana/web3.js';
import { config } from './config';

function resolveRpcUrl(): string {
  if (config.rpcUrl) return config.rpcUrl;
  return clusterApiUrl(config.cluster as Cluster);
}

export function getConnection(): Connection {
  return new Connection(resolveRpcUrl(), 'confirmed');
}

export function explorerUrl(kind: 'address' | 'tx', value: string): string {
  const suffix = config.cluster === 'mainnet-beta' ? '' : `?cluster=${config.cluster}`;
  return `https://explorer.solana.com/${kind}/${value}${suffix}`;
}
