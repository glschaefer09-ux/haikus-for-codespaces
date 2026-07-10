const { createApp } = require('./src/app');

const { app, config, logger } = createApp();

app.listen(config.app.port, () => {
  logger.info('server.started', {
    port: config.app.port,
    env: config.app.env,
  });
});
