const LEVELS = ['debug', 'info', 'warn', 'error'];

function shouldLog(configuredLevel, currentLevel) {
  return LEVELS.indexOf(currentLevel) >= LEVELS.indexOf(configuredLevel);
}

function createLogger({ level = 'info', service = 'ccde-business-suite' } = {}) {
  const configuredLevel = LEVELS.includes(level) ? level : 'info';

  function emit(currentLevel, message, meta = {}) {
    if (!shouldLog(configuredLevel, currentLevel)) {
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      level: currentLevel,
      service,
      message,
      ...meta,
    };

    const line = JSON.stringify(payload);
    if (currentLevel === 'error') {
      console.error(line);
    } else if (currentLevel === 'warn') {
      console.warn(line);
    } else {
      console.log(line);
    }
  }

  return {
    child(bindings = {}) {
      return {
        debug: (message, meta) => emit('debug', message, { ...bindings, ...meta }),
        info: (message, meta) => emit('info', message, { ...bindings, ...meta }),
        warn: (message, meta) => emit('warn', message, { ...bindings, ...meta }),
        error: (message, meta) => emit('error', message, { ...bindings, ...meta }),
      };
    },
    debug: (message, meta) => emit('debug', message, meta),
    info: (message, meta) => emit('info', message, meta),
    warn: (message, meta) => emit('warn', message, meta),
    error: (message, meta) => emit('error', message, meta),
  };
}

module.exports = {
  createLogger,
};
