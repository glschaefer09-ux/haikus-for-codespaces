import { ipcMain, shell } from 'electron';
import { IpcChannel } from '@shared/ipcChannels';

export function registerSystemIpc(): void {
  ipcMain.handle(IpcChannel.SystemOpenExternal, (_event, url: string) => {
    if (!/^https:\/\//.test(url)) {
      throw new Error('Only https URLs can be opened externally.');
    }
    return shell.openExternal(url);
  });
}
