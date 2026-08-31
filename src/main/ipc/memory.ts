import { ipcMain } from 'electron';
import { IpcChannel } from '@shared/ipcChannels';
import * as memoryStore from '../memoryStore';

export function registerMemoryIpc(): void {
  ipcMain.handle(IpcChannel.MemoryList, () => memoryStore.listMemories());
  ipcMain.handle(IpcChannel.MemoryAdd, (_event, content: string) => memoryStore.addMemory(content));
  ipcMain.handle(IpcChannel.MemoryUpdate, (_event, id: string, content: string) =>
    memoryStore.updateMemory(id, content),
  );
  ipcMain.handle(IpcChannel.MemoryDelete, (_event, id: string) => memoryStore.deleteMemory(id));
  ipcMain.handle(IpcChannel.MemoryClear, () => memoryStore.clearMemories());
}
