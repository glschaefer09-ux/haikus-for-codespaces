import { ipcMain } from 'electron';
import { IpcChannel } from '@shared/ipcChannels';
import type { ChatMessage } from '@shared/types';
import * as localStore from '../localStore';

export function registerStorageIpc(): void {
  ipcMain.handle(IpcChannel.StorageListConversations, () => localStore.listConversations());
  ipcMain.handle(IpcChannel.StorageGetConversation, (_event, id: string) =>
    localStore.getConversation(id),
  );
  ipcMain.handle(IpcChannel.StorageCreateConversation, (_event, title?: string) =>
    localStore.createConversation(title),
  );
  ipcMain.handle(IpcChannel.StorageRenameConversation, (_event, id: string, title: string) =>
    localStore.renameConversation(id, title),
  );
  ipcMain.handle(IpcChannel.StorageDeleteConversation, (_event, id: string) =>
    localStore.deleteConversation(id),
  );
  ipcMain.handle(IpcChannel.StorageAppendMessage, (_event, message: ChatMessage) =>
    localStore.appendMessage(message),
  );
}
