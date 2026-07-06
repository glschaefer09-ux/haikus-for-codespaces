import * as fs from 'fs';
import * as path from 'path';
import { deploymentPath } from './config';

export interface DeploymentRecord {
  cluster: string;
  mint: string;
  treasury: string;
  decimals: number;
  totalSupply: string;
  name: string;
  symbol: string;
  metadataUri: string;
  mintAuthorityRevoked: boolean;
  transactions: {
    createMint?: string;
    mintTo?: string;
    createMetadata?: string;
    revokeMintAuthority?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function readDeployment(): DeploymentRecord | null {
  const filePath = deploymentPath();
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function writeDeployment(record: DeploymentRecord): void {
  const filePath = deploymentPath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2) + '\n');
}

export function requireDeployment(): DeploymentRecord {
  const record = readDeployment();
  if (!record) {
    throw new Error(
      `No deployment record found at ${deploymentPath()}. Run "npm run token:create" first.`
    );
  }
  return record;
}
