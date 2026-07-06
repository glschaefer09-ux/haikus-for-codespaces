import express from 'express';
import { PublicKey } from '@solana/web3.js';
import { getConnection, explorerUrl } from './token/lib/connection';
import { fetchMint, fetchBalance } from './token/lib/mint';
import { getUmi, readMetadata } from './token/lib/metadata';
import { readDeployment } from './token/lib/deployments';
import { config } from './token/lib/config';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const deployment = readDeployment();
  if (!deployment) {
    res.render('index', {
      cluster: config.cluster,
      deployed: false,
      mintInfo: null,
      metadata: null,
      balance: null,
      queriedAddress: null,
      error: null,
    });
    return;
  }

  try {
    const connection = getConnection();
    const mint = new PublicKey(deployment.mint);
    const onChainMint = await fetchMint(connection, mint);
    const umi = getUmi(connection.rpcEndpoint);
    const metadata = await readMetadata(umi, mint);

    const address = typeof req.query.address === 'string' ? req.query.address : null;
    let balance = null;
    let error = null;
    if (address) {
      try {
        const owner = new PublicKey(address);
        const { amount } = await fetchBalance(connection, mint, owner);
        balance = Number(amount) / 10 ** deployment.decimals;
      } catch {
        error = `"${address}" is not a valid Solana address.`;
      }
    }

    res.render('index', {
      cluster: deployment.cluster,
      deployed: true,
      mintInfo: {
        address: mint.toBase58(),
        explorerUrl: explorerUrl('address', mint.toBase58()),
        decimals: onChainMint.decimals,
        supply: (onChainMint.supply / 10n ** BigInt(onChainMint.decimals)).toString(),
        mintAuthorityActive: onChainMint.mintAuthority !== null,
      },
      metadata: metadata
        ? {
            name: metadata.name.replace(/\0/g, ''),
            symbol: metadata.symbol.replace(/\0/g, ''),
          }
        : null,
      balance,
      queriedAddress: address,
      error,
    });
  } catch (err) {
    res.status(500).render('index', {
      cluster: deployment.cluster,
      deployed: true,
      mintInfo: null,
      metadata: null,
      balance: null,
      queriedAddress: null,
      error: `Failed to load on-chain data: ${(err as Error).message}`,
    });
  }
});

app.listen(port, () => {
  console.log(`Gator Coin dashboard listening on http://localhost:${port}`);
});
