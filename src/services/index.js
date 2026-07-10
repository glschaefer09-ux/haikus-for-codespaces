const { MemoryDocumentStorage } = require('./document-storage/MemoryDocumentStorage');
const { GoogleDriveStorage } = require('./document-storage/GoogleDriveStorage');
const { PosRevenueService } = require('./posRevenueService');
const { TokenIntelligenceService } = require('./tokenIntelligenceService');
const { IntegrationsHubService } = require('./integrationsHubService');
const { RelayService } = require('./relayService');
const { WorkspaceHubService } = require('./workspaceHubService');
const { CommandCenterService } = require('./commandCenterService');
const { DashboardService } = require('./dashboardService');
const { WorkflowAutomationService } = require('./workflowAutomationService');

function createStorage(config, logger) {
  const googleDriveStorage = new GoogleDriveStorage(config.google, logger);
  if (googleDriveStorage.isConfigured()) {
    return googleDriveStorage;
  }
  return new MemoryDocumentStorage(logger);
}

function createServices(config, logger) {
  const storage = createStorage(config, logger);
  const posRevenueService = new PosRevenueService(logger);
  const tokenIntelligenceService = new TokenIntelligenceService(logger);
  const integrationsHubService = new IntegrationsHubService(logger, storage);
  const relayService = new RelayService(logger);
  const workspaceHubService = new WorkspaceHubService(logger, storage);
  const commandCenterService = new CommandCenterService(logger);
  const dashboardService = new DashboardService({
    posRevenueService,
    tokenIntelligenceService,
    integrationsHubService,
    relayService,
    workspaceHubService,
    commandCenterService,
    logger,
  });
  const workflowAutomationService = new WorkflowAutomationService({
    dashboardService,
    workspaceHubService,
    logger,
  });

  return {
    storage,
    dashboardService,
    workspaceHubService,
    workflowAutomationService,
  };
}

module.exports = {
  createServices,
};
