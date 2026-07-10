const { sampleTransactions } = require('../data/sampleData');

class PosRevenueService {
  constructor(logger) {
    this.logger = logger.child({ component: 'pos-revenue-service' });
  }

  async getOverview() {
    const transactions = Object.entries(sampleTransactions).flatMap(([provider, items]) =>
      items.map((item) => ({ ...item, provider }))
    );

    const grossRevenue = transactions.reduce((sum, item) => sum + item.amount, 0);
    const netRevenue = transactions.reduce((sum, item) => sum + item.amount - item.fee, 0);
    const providers = Object.keys(sampleTransactions).map((provider) => ({
      provider,
      transactions: sampleTransactions[provider].length,
      revenue: sampleTransactions[provider].reduce((sum, item) => sum + item.amount, 0),
    }));

    const topLocation = transactions.reduce((leaders, item) => {
      leaders[item.location] = (leaders[item.location] || 0) + item.amount;
      return leaders;
    }, {});
    const [bestLocation = 'N/A'] = Object.entries(topLocation).sort((left, right) => right[1] - left[1])[0] || [];

    return {
      id: 'pos-revenue-dashboard',
      name: 'POS Revenue Dashboard',
      description: 'Live revenue rollup across Square, Toast, and Lightspeed via the DAVL adapter.',
      status: 'healthy',
      metrics: {
        grossRevenue: grossRevenue.toFixed(2),
        netRevenue: netRevenue.toFixed(2),
        transactionCount: transactions.length,
        topLocation: bestLocation,
      },
      providers,
      transactions: transactions.sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp)),
    };
  }
}

module.exports = {
  PosRevenueService,
};
