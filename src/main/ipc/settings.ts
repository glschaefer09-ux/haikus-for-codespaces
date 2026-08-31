import { ipcMain } from 'electron';
import { IpcChannel } from '@shared/ipcChannels';
import { getSettings, updateSettings } from '../store';
import { hasStoredKey, validateAndStoreKey, clearStoredKey } from '../keyManager';

export function registerSettingsIpc(): void {
  ipcMain.handle(IpcChannel.SettingsGet, () => getSettings());
  ipcMain.handle(IpcChannel.SettingsUpdate, (_event, patch) => updateSettings(patch));

  ipcMain.handle(IpcChannel.KeyStatus, () => ({ hasKey: hasStoredKey() }));
  ipcMain.handle(IpcChannel.KeyValidateAndStore, (_event, rawKey: string) =>
    validateAndStoreKey(rawKey),
  );
  ipcMain.handle(IpcChannel.KeyClear, () => {
    clearStoredKey();
  });
}
