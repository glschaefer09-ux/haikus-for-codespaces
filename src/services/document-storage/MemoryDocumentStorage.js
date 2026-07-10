const { sampleDocuments } = require('../../data/sampleData');

class MemoryDocumentStorage {
  constructor(logger) {
    this.logger = logger.child({ component: 'memory-document-storage' });
    this.files = [...sampleDocuments];
  }

  async listFiles({ pageSize = 10 } = {}) {
    return this.files
      .slice()
      .sort((left, right) => new Date(right.modifiedTime) - new Date(left.modifiedTime))
      .slice(0, pageSize);
  }

  async uploadReport({ name, content, mimeType = 'text/plain' }) {
    const file = {
      id: `memory-${Date.now()}`,
      name,
      mimeType,
      modifiedTime: new Date().toISOString(),
      webViewLink: null,
      size: Buffer.byteLength(content, 'utf8'),
    };

    this.logger.info('storage.uploaded_report', { fileId: file.id, name: file.name });
    this.files.unshift(file);
    return file;
  }

  async health() {
    return {
      provider: 'memory',
      status: 'degraded',
      message: 'Google Drive credentials are not configured; using in-memory storage.',
    };
  }
}

module.exports = {
  MemoryDocumentStorage,
};
