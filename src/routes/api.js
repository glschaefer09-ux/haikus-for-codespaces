const express = require('express');
const { asyncHandler } = require('../lib/http');
const { AppError } = require('../lib/errors');

function createApiRouter(services) {
  const router = express.Router();

  router.get('/health', (req, res) => {
    res.json({ ok: true, service: 'ccde-business-suite', requestId: req.requestId });
  });

  router.get('/dashboard', asyncHandler(async (req, res) => {
    const dashboard = await services.dashboardService.getDashboard();
    res.json(dashboard);
  }));

  router.get('/drive/files', asyncHandler(async (req, res) => {
    const files = await services.workspaceHubService.getOverview();
    res.json(files);
  }));

  router.post('/drive/reports', asyncHandler(async (req, res) => {
    const { name, content } = req.body;
    if (!name || !content) {
      throw new AppError('Both report name and content are required.', {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      });
    }

    const report = await services.workspaceHubService.uploadReport({ name, content });
    res.status(201).json({ report });
  }));

  router.post('/workflows/daily-summary', asyncHandler(async (req, res) => {
    const result = await services.workflowAutomationService.runDailySummaryWorkflow();
    res.status(201).json(result);
  }));

  return router;
}

module.exports = {
  createApiRouter,
};
