import { app, BrowserWindow, shell } from 'electron';
import { join } from 'node:path';
import { registerSettingsIpc } from './ipc/settings';
import { registerStorageIpc } from './ipc/storage';
import { registerMemoryIpc } from './ipc/memory';
import { registerAnthropicIpc } from './ipc/anthropic';
import { registerSystemIpc } from './ipc/system';

const isWindows = process.platform === 'win32';

// Dev-only: run multiple isolated instances to test cross-device sync locally, e.g.
//   $env:CROSSPCAI_PROFILE="deviceB"; npm run dev
if (process.env.CROSSPCAI_PROFILE) {
  app.setPath('userData', `${app.getPath('userData')}-${process.env.CROSSPCAI_PROFILE}`);
}

function createMainWindow(): void {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 860,
    minHeight: 560,
    show: false,
    backgroundColor: '#0B0B12',
    autoHideMenuBar: true,
    icon: isWindows ? join(__dirname, '../../build/icon.ico') : undefined,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.once('ready-to-show', () => win.show());

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) void shell.openExternal(url);
    return { action: 'deny' };
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    void win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void win.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

void app.whenReady().then(() => {
  app.setAppUserModelId('com.crosspcai.app');

  registerSettingsIpc();
  registerStorageIpc();
  registerMemoryIpc();
  registerAnthropicIpc();
  registerSystemIpc();

  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
