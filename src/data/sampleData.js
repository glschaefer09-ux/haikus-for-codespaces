const sampleTransactions = {
  square: [
    { location: 'Downtown Cafe', amount: 324.18, fee: 8.1, timestamp: '2026-07-10T16:08:00Z' },
    { location: 'Community Kitchen', amount: 488.4, fee: 10.72, timestamp: '2026-07-10T16:29:00Z' },
  ],
  toast: [
    { location: 'ChefCoin Bistro', amount: 852.27, fee: 18.42, timestamp: '2026-07-10T16:11:00Z' },
    { location: 'ChefCoin Bistro', amount: 294.13, fee: 7.11, timestamp: '2026-07-10T16:42:00Z' },
  ],
  lightspeed: [
    { location: 'Market Hall', amount: 412.87, fee: 9.84, timestamp: '2026-07-10T16:18:00Z' },
    { location: 'Market Hall', amount: 210.1, fee: 5.26, timestamp: '2026-07-10T16:56:00Z' },
  ],
};

const sampleContracts = [
  { name: 'ChefCoin Treasury', address: '0x7e1f...c001', treasuryBalance: 182450.22, stakedSupply: 84420.11, apy: 12.4, burnRate24h: 182.7, governanceOpen: 2 },
  { name: 'ChefCoin Rewards', address: '0x7e1f...c002', treasuryBalance: 96442.67, stakedSupply: 44510.03, apy: 10.9, burnRate24h: 96.4, governanceOpen: 1 },
  { name: 'ChefCoin Grants', address: '0x7e1f...c003', treasuryBalance: 75440.32, stakedSupply: 29330.11, apy: 9.8, burnRate24h: 40.1, governanceOpen: 0 },
  { name: 'ChefCoin Liquidity', address: '0x7e1f...c004', treasuryBalance: 132115.44, stakedSupply: 59210.34, apy: 11.6, burnRate24h: 78.9, governanceOpen: 1 },
  { name: 'ChefCoin Nonprofit Ops', address: '0x7e1f...c005', treasuryBalance: 50114.66, stakedSupply: 18220.2, apy: 8.7, burnRate24h: 22.4, governanceOpen: 0 },
  { name: 'ChefCoin Business Ops', address: '0x7e1f...c006', treasuryBalance: 66402.83, stakedSupply: 24180.46, apy: 9.1, burnRate24h: 24.6, governanceOpen: 0 },
  { name: 'ChefCoin Governance', address: '0x7e1f...c007', treasuryBalance: 88512.17, stakedSupply: 37002.11, apy: 10.4, burnRate24h: 31.8, governanceOpen: 3 },
  { name: 'ChefCoin Community', address: '0x7e1f...c008', treasuryBalance: 43018.72, stakedSupply: 15400.55, apy: 7.9, burnRate24h: 17.2, governanceOpen: 0 },
];

const sampleIntegrations = [
  { id: 'csbl-bridge', name: 'CSBL Bridge', status: 'healthy', lastHeartbeat: '2026-07-10T18:45:00Z', lagMinutes: 1, errorBudgetRemaining: 99.9 },
  { id: 'kafka-pos-live', name: 'Kafka Topic: pos.live.transactions', status: 'degraded', lastHeartbeat: '2026-07-10T18:43:00Z', lagMinutes: 7, errorBudgetRemaining: 96.4 },
  { id: 'kafka-finance-relay', name: 'Kafka Topic: finance.relay.events', status: 'healthy', lastHeartbeat: '2026-07-10T18:44:00Z', lagMinutes: 2, errorBudgetRemaining: 99.2 },
  { id: 'square-webhook', name: 'Square Webhook', status: 'healthy', lastHeartbeat: '2026-07-10T18:44:30Z', lagMinutes: 1, errorBudgetRemaining: 99.7 },
  { id: 'toast-webhook', name: 'Toast Webhook', status: 'healthy', lastHeartbeat: '2026-07-10T18:44:10Z', lagMinutes: 1, errorBudgetRemaining: 99.6 },
  { id: 'drive-connector', name: 'Google Drive Connector', status: 'warning', lastHeartbeat: '2026-07-10T18:35:00Z', lagMinutes: 10, errorBudgetRemaining: 95.8 },
];

const sampleRelayReports = [
  { id: 'relay-1023', type: 'financial-close', status: 'completed', source: 'ChefCoin Nonprofit', target: 'CCDE Managing Business', updatedAt: '2026-07-10T15:30:00Z' },
  { id: 'relay-1024', type: 'grant-disbursement', status: 'pending', source: 'ChefCoin Nonprofit', target: 'CCDE Managing Business', updatedAt: '2026-07-10T17:55:00Z' },
  { id: 'relay-1025', type: 'board-packet', status: 'in-review', source: 'CCDE Managing Business', target: 'ChefCoin Board', updatedAt: '2026-07-10T18:12:00Z' },
  { id: 'relay-1026', type: 'store-variance', status: 'failed', source: 'CCDE Managing Business', target: 'ChefCoin Nonprofit', updatedAt: '2026-07-10T18:21:00Z' },
];

const sampleProjects = [
  { id: 'ccde-suite-mvp', title: 'Phase 1 MVP Launch', owner: 'Ops Team', priority: 'P1', status: 'on-track', dueDate: '2026-08-31' },
  { id: 'relay-hardening', title: 'Relay Audit Trail', owner: 'Finance Systems', priority: 'P1', status: 'at-risk', dueDate: '2026-08-15' },
  { id: 'drive-migration', title: 'Document Storage Port', owner: 'Platform Team', priority: 'P2', status: 'planned', dueDate: '2026-09-07' },
  { id: 'mobile-alerting', title: 'Push Notification Pilot', owner: 'Experience Team', priority: 'P3', status: 'planned', dueDate: '2026-10-01' },
];

const sampleDocuments = [
  { id: 'drive-report-001', name: 'chefcoin-financial-close-q2.txt', mimeType: 'text/plain', modifiedTime: '2026-07-09T18:00:00Z', webViewLink: 'https://drive.google.com/file/d/drive-report-001/view' },
  { id: 'drive-report-002', name: 'ccde-ops-daily-summary.txt', mimeType: 'text/plain', modifiedTime: '2026-07-10T12:30:00Z', webViewLink: 'https://drive.google.com/file/d/drive-report-002/view' },
];

module.exports = {
  sampleTransactions,
  sampleContracts,
  sampleIntegrations,
  sampleRelayReports,
  sampleProjects,
  sampleDocuments,
};
