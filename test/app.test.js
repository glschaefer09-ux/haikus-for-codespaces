const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

async function withServer(run) {
  const { app } = createApp({ env: { PORT: '0', LOG_LEVEL: 'error' } });
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });

  try {
    const address = server.address();
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

test('GET /api/dashboard returns six modules', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/dashboard`);
    assert.equal(response.status, 200);

    const payload = await response.json();
    assert.equal(payload.summary.moduleCount, 6);
    assert.equal(payload.modules[0].id, 'pos-revenue-dashboard');
  });
});

test('POST /api/workflows/daily-summary uploads a report', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/workflows/daily-summary`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    assert.equal(response.status, 201);
    const payload = await response.json();
    assert.equal(payload.workflow, 'daily-summary');
    assert.match(payload.uploadedReport.name, /^ccde-daily-summary-/);
  });
});

test('POST /api/drive/reports validates required fields', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/drive/reports`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: '', content: '' }),
    });

    assert.equal(response.status, 400);
    const payload = await response.json();
    assert.equal(payload.error.code, 'VALIDATION_ERROR');
  });
});
