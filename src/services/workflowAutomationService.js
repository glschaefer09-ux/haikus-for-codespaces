class WorkflowAutomationService {
  constructor({ dashboardService, workspaceHubService, logger }) {
    this.dashboardService = dashboardService;
    this.workspaceHubService = workspaceHubService;
    this.logger = logger.child({ component: 'workflow-automation-service' });
  }

  async runDailySummaryWorkflow() {
    const dashboard = await this.dashboardService.getDashboard();
    const content = [
      'CCDE Business Suite Daily Summary',
      `Generated At: ${dashboard.summary.generatedAt}`,
      `Overall Status: ${dashboard.summary.overallStatus}`,
      `Warnings: ${dashboard.summary.warnings}`,
      '',
      ...dashboard.modules.map((module) => `${module.name}: ${module.status}`),
    ].join('\n');

    const name = `ccde-daily-summary-${dashboard.summary.generatedAt.slice(0, 10)}.txt`;
    const uploadedReport = await this.workspaceHubService.uploadReport({ name, content });

    this.logger.info('workflow.daily_summary.completed', {
      reportId: uploadedReport.id,
      reportName: uploadedReport.name,
    });

    return {
      workflow: 'daily-summary',
      status: 'completed',
      uploadedReport,
      dashboardSummary: dashboard.summary,
    };
  }
}

module.exports = {
  WorkflowAutomationService,
};
