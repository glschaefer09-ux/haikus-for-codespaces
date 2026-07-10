const { sampleContracts } = require('../data/sampleData');

class TokenIntelligenceService {
  constructor(logger) {
    this.logger = logger.child({ component: 'token-intelligence-service' });
  }

  async getOverview() {
    const treasuryBalance = sampleContracts.reduce((sum, contract) => sum + contract.treasuryBalance, 0);
    const totalStaked = sampleContracts.reduce((sum, contract) => sum + contract.stakedSupply, 0);
    const averageApy = sampleContracts.reduce((sum, contract) => sum + contract.apy, 0) / sampleContracts.length;
    const burnRate24h = sampleContracts.reduce((sum, contract) => sum + contract.burnRate24h, 0);
    const governanceOpen = sampleContracts.reduce((sum, contract) => sum + contract.governanceOpen, 0);

    return {
      id: 'token-intelligence',
      name: 'Token Intelligence',
      description: 'Contract balances, staking APY, burn telemetry, and governance activity for all ChefCoin contracts.',
      status: governanceOpen > 5 ? 'warning' : 'healthy',
      metrics: {
        trackedContracts: sampleContracts.length,
        treasuryBalance: treasuryBalance.toFixed(2),
        totalStaked: totalStaked.toFixed(2),
        averageApy: averageApy.toFixed(2),
        burnRate24h: burnRate24h.toFixed(1),
        governanceOpen,
      },
      contracts: sampleContracts,
    };
  }
}

module.exports = {
  TokenIntelligenceService,
};
