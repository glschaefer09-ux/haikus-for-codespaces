class WorkspaceHubService {
  constructor(logger, storage) {
    this.logger = logger.child({ component: 'workspace-hub-service' });
    this.storage = storage;
  }

  async getOverview() {
    const [files, storageHealth] = await Promise.all([
      this.storage.listFiles({ pageSize: 5 }),
      this.storage.health(),
    ]);

    return {
      id: 'google-workspace-hub',
      name: 'Google Workspace Hub',
      description: 'Drive browser and report uploader backed by a swappable DocumentStoragePort implementation.',
      status: storageHealth.status,
      metrics: {
        filesIndexed: files.length,
        provider: storageHealth.provider,
      },
      storageHealth,
      files,
    };
  }

  async uploadReport({ name, content }) {
    return this.storage.uploadReport({ name, content });
  }
}

module.exports = {
  WorkspaceHubService,
};
