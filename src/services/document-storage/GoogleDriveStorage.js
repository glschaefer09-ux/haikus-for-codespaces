const { google } = require('googleapis');
const { ConfigurationError, ExternalServiceError } = require('../../lib/errors');

class GoogleDriveStorage {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger.child({ component: 'google-drive-storage' });
  }

  isConfigured() {
    return Boolean(this.config.clientEmail && this.config.privateKey);
  }

  createAuth() {
    if (!this.isConfigured()) {
      throw new ConfigurationError('Google Drive credentials are not configured.');
    }

    const credentials = {
      client_email: this.config.clientEmail,
      private_key: this.config.privateKey,
    };

    return new google.auth.GoogleAuth({
      credentials,
      scopes: this.config.scopes,
      clientOptions: this.config.impersonatedUser
        ? { subject: this.config.impersonatedUser }
        : undefined,
    });
  }

  async getDriveClient() {
    const auth = await this.createAuth().getClient();
    return google.drive({ version: 'v3', auth });
  }

  async listFiles({ pageSize = 10 } = {}) {
    try {
      const drive = await this.getDriveClient();
      const query = this.config.driveFolderId
        ? `'${this.config.driveFolderId}' in parents and trashed = false`
        : 'trashed = false';
      const response = await drive.files.list({
        pageSize,
        q: query,
        orderBy: 'modifiedTime desc',
        fields: 'files(id, name, mimeType, modifiedTime, webViewLink, size)',
      });
      return response.data.files || [];
    } catch (error) {
      this.logger.error('drive.list_failed', { error: error.message });
      throw new ExternalServiceError('Unable to list Google Drive files.', { cause: error.message });
    }
  }

  async uploadReport({ name, content, mimeType = 'text/plain' }) {
    try {
      const drive = await this.getDriveClient();
      const fileMetadata = {
        name,
        parents: this.config.driveFolderId ? [this.config.driveFolderId] : undefined,
      };
      const media = {
        mimeType,
        body: Buffer.from(content, 'utf8'),
      };
      const response = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, name, mimeType, modifiedTime, webViewLink, size',
      });
      return response.data;
    } catch (error) {
      this.logger.error('drive.upload_failed', { error: error.message, name });
      throw new ExternalServiceError('Unable to upload report to Google Drive.', { cause: error.message });
    }
  }

  async health() {
    if (!this.isConfigured()) {
      return {
        provider: 'google-drive',
        status: 'degraded',
        message: 'Google Drive credentials are missing.',
      };
    }

    try {
      await this.listFiles({ pageSize: 1 });
      return {
        provider: 'google-drive',
        status: 'healthy',
        message: 'Google Drive API reachable.',
      };
    } catch (error) {
      return {
        provider: 'google-drive',
        status: 'warning',
        message: error.message,
      };
    }
  }
}

module.exports = {
  GoogleDriveStorage,
};
