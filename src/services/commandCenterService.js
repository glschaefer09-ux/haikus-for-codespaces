const { sampleProjects } = require('../data/sampleData');

class CommandCenterService {
  constructor(logger) {
    this.logger = logger.child({ component: 'command-center-service' });
  }

  async getOverview(modules) {
    const issues = modules.filter((module) => module.status !== 'healthy');

    return {
      id: 'ccde-command-center',
      name: 'CCDE Command Center',
      description: 'Project cards, service health, and internal task tracking across the suite.',
      status: issues.length > 2 ? 'warning' : 'healthy',
      metrics: {
        activeProjects: sampleProjects.length,
        escalations: issues.length,
      },
      projects: sampleProjects,
      serviceHealth: modules.map((module) => ({
        id: module.id,
        name: module.name,
        status: module.status,
      })),
    };
  }
}

module.exports = {
  CommandCenterService,
};
