const { sampleIntegrations } = require('../data/sampleData');

const STATUS_ORDER = {
  healthy: 0,
  degraded: 1,
  warning: 2,
  failed: 3,
};

class IntegrationsHubService {
  constructor(logger, storage) {
    this.logger = logger.child({ component: 'integrations-hub-service' });
    this.storage = storage;
  }

  async getOverview() {
    const storageHealth = await this.storage.health();
    const integrations = sampleIntegrations.map((integration) =>
      integration.id === 'drive-connector'
        ? {
            ...integration,
            status: storageHealth.status === 'healthy' ? 'healthy' : integration.status,
            notes: storageHealth.message,
          }
        : integration
    );

    const status = integrations.some((item) => item.status === 'failed')
      ? 'failed'
      : integrations.some((item) => item.status === 'warning' || item.status === 'degraded')
        ? 'warning'
        : 'healthy';

    return {
      id: 'integrations-hub',
      name: 'Integrations Hub',
      description: 'Operational health board for the CSBL bridge, Kafka topics, POS webhooks, and Drive connector.',
      status,
      metrics: {
        healthy: integrations.filter((item) => item.status === 'healthy').length,
        warning: integrations.filter((item) => item.status === 'warning' || item.status === 'degraded').length,
        failed: integrations.filter((item) => item.status === 'failed').length,
      },
      integrations: integrations.sort((left, right) => STATUS_ORDER[left.status] - STATUS_ORDER[right.status]),
    };
  }
}

module.exports = {
  IntegrationsHubService,
};
