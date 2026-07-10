class AppError extends Error {
  constructor(message, { statusCode = 500, code = 'INTERNAL_ERROR', details } = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

class ConfigurationError extends AppError {
  constructor(message, details) {
    super(message, { statusCode: 500, code: 'CONFIGURATION_ERROR', details });
    this.name = 'ConfigurationError';
  }
}

class ExternalServiceError extends AppError {
  constructor(message, details) {
    super(message, { statusCode: 502, code: 'EXTERNAL_SERVICE_ERROR', details });
    this.name = 'ExternalServiceError';
  }
}

module.exports = {
  AppError,
  ConfigurationError,
  ExternalServiceError,
};
