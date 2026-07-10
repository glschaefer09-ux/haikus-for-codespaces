const crypto = require('crypto');

function requestContext(logger) {
  return function attachRequestContext(req, res, next) {
    const requestId = req.get('x-request-id') || crypto.randomUUID();
    const startedAt = Date.now();
    req.requestId = requestId;
    req.logger = logger.child({ requestId, method: req.method, path: req.originalUrl });
    res.setHeader('x-request-id', requestId);

    req.logger.info('request.started');
    res.on('finish', () => {
      req.logger.info('request.completed', {
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt,
      });
    });

    next();
  };
}

module.exports = {
  requestContext,
};
