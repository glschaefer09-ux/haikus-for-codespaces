const { sampleRelayReports } = require('../data/sampleData');

class RelayService {
  constructor(logger) {
    this.logger = logger.child({ component: 'relay-service' });
  }

  async getOverview() {
    return {
      id: 'nonprofit-business-relay',
      name: 'Nonprofit ↔ Managing Business Relay',
      description: 'Structured financial and document reporting between ChefCoin and CCDE entities.',
      status: sampleRelayReports.some((report) => report.status === 'failed') ? 'warning' : 'healthy',
      metrics: {
        pending: sampleRelayReports.filter((report) => report.status === 'pending').length,
        inReview: sampleRelayReports.filter((report) => report.status === 'in-review').length,
        failed: sampleRelayReports.filter((report) => report.status === 'failed').length,
        completed: sampleRelayReports.filter((report) => report.status === 'completed').length,
      },
      reports: sampleRelayReports.sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt)),
    };
  }
}

module.exports = {
  RelayService,
};
