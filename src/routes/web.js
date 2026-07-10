const express = require('express');
const { asyncHandler } = require('../lib/http');
const { AppError } = require('../lib/errors');

function createWebRouter(services) {
  const router = express.Router();

  router.get('/', asyncHandler(async (req, res) => {
    const dashboard = await services.dashboardService.getDashboard();
    res.render('index', {
      pageTitle: 'CCDE Business Suite',
      dashboard,
      workflowResult: null,
      flash: req.query.message || null,
      error: null,
    });
  }));

  router.post('/workspace/reports', asyncHandler(async (req, res) => {
    const { name, content } = req.body;
    if (!name || !content) {
      throw new AppError('Both a report name and report content are required.', {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      });
    }

    await services.workspaceHubService.uploadReport({ name, content });
    res.redirect('/?message=Report%20uploaded%20successfully');
  }));

  router.post('/automation/daily-summary', asyncHandler(async (req, res) => {
    const workflowResult = await services.workflowAutomationService.runDailySummaryWorkflow();
    const dashboard = await services.dashboardService.getDashboard();
    res.render('index', {
      pageTitle: 'CCDE Business Suite',
      dashboard,
      workflowResult,
      flash: 'Daily summary workflow completed successfully.',
      error: null,
    });
  }));

  return router;
}

module.exports = {
  createWebRouter,
};
