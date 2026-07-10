const { AppError } = require('../lib/errors');

function errorHandler(rootLogger) {
  return function handleError(error, req, res, next) {
    if (res.headersSent) {
      return next(error);
    }

    const logger = req.logger || rootLogger;
    const isOperational = error instanceof AppError;
    const statusCode = isOperational ? error.statusCode : 500;
    const code = isOperational ? error.code : 'INTERNAL_ERROR';

    logger.error('request.failed', {
      code,
      statusCode,
      error: error.message,
      stack: rootLogger === logger ? error.stack : undefined,
      details: error.details,
    });

    const payload = {
      error: {
        code,
        message: isOperational ? error.message : 'An unexpected error occurred.',
      },
    };

    if (isOperational && error.details) {
      payload.error.details = error.details;
    }

    if (req.accepts('html') && !req.path.startsWith('/api/')) {
      return res.status(statusCode).render('index', {
        pageTitle: 'CCDE Business Suite',
        dashboard: null,
        workflowResult: null,
        flash: null,
        error: payload.error,
      });
    }

    return res.status(statusCode).json(payload);
  };
}

module.exports = {
  errorHandler,
};
