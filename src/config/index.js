const { ConfigurationError } = require('../lib/errors');

function normalizePrivateKey(privateKey) {
  return privateKey ? privateKey.replace(/\\n/g, '\n') : undefined;
}

function parseServiceAccount(json) {
  if (!json) {
    return {};
  }

  try {
    const parsed = JSON.parse(json);
    return {
      clientEmail: parsed.client_email,
      privateKey: normalizePrivateKey(parsed.private_key),
      projectId: parsed.project_id,
    };
  } catch (error) {
    throw new ConfigurationError('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON', { cause: error.message });
  }
}

function createConfig(env = process.env) {
  const serviceAccount = parseServiceAccount(env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const googleClientEmail = env.GOOGLE_CLIENT_EMAIL || serviceAccount.clientEmail;
  const googlePrivateKey = normalizePrivateKey(env.GOOGLE_PRIVATE_KEY || serviceAccount.privateKey);

  return {
    app: {
      name: 'CCDE Business Suite',
      tagline: 'One Dashboard. Every Venture.',
      env: env.NODE_ENV || 'development',
      port: Number(env.PORT || 3000),
      logLevel: env.LOG_LEVEL || 'info',
    },
    google: {
      clientEmail: googleClientEmail,
      privateKey: googlePrivateKey,
      driveFolderId: env.GOOGLE_DRIVE_FOLDER_ID,
      impersonatedUser: env.GOOGLE_IMPERSONATED_USER,
      scopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
      ],
    },
  };
}

module.exports = {
  createConfig,
};
