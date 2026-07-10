class DashboardService {
  constructor({ posRevenueService, tokenIntelligenceService, integrationsHubService, relayService, workspaceHubService, commandCenterService, logger }) {
    this.posRevenueService = posRevenueService;
    this.tokenIntelligenceService = tokenIntelligenceService;
    this.integrationsHubService = integrationsHubService;
    this.relayService = relayService;
    this.workspaceHubService = workspaceHubService;
    this.commandCenterService = commandCenterService;
    this.logger = logger.child({ component: 'dashboard-service' });
  }

  async getDashboard() {
    const modules = await Promise.all([
      this.posRevenueService.getOverview(),
      this.tokenIntelligenceService.getOverview(),
      this.integrationsHubService.getOverview(),
      this.relayService.getOverview(),
      this.workspaceHubService.getOverview(),
    ]);
    const commandCenter = await this.commandCenterService.getOverview(modules);
    const allModules = [...modules, commandCenter];

    const overallStatus = allModules.some((module) => module.status === 'failed')
      ? 'failed'
      : allModules.some((module) => module.status === 'warning' || module.status === 'degraded')
        ? 'warning'
        : 'healthy';

    const summary = {
      overallStatus,
      moduleCount: allModules.length,
      warnings: allModules.filter((module) => module.status !== 'healthy').length,
      generatedAt: new Date().toISOString(),
    };

    this.logger.info('dashboard.generated', summary);

    return {
      summary,
      modules: allModules,
    };
  }
}

module.exports = {
  DashboardService,
};
