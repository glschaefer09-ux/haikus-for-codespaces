const express = require('express');
const path = require('path');
const { createConfig } = require('./config');
const { createLogger } = require('./lib/logger');
const { requestContext } = require('./middleware/request-context');
const { errorHandler } = require('./middleware/error-handler');
const { createServices } = require('./services');
const { createApiRouter } = require('./routes/api');
const { createWebRouter } = require('./routes/web');

function createApp({ env = process.env } = {}) {
  const config = createConfig(env);
  const logger = createLogger({ level: config.app.logLevel });
  const services = createServices(config, logger);
  const app = express();

  app.disable('x-powered-by');
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(requestContext(logger));

  app.use('/api', createApiRouter(services));
  app.use('/', createWebRouter(services));
  app.use(errorHandler(logger));

  return { app, config, services, logger };
}

module.exports = {
  createApp,
};
