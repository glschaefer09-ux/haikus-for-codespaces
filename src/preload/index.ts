import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannel } from '@shared/ipcChannels';
import type {
  CrossPcAiApi,
  StreamChunkPayload,
  StreamDonePayload,
  StreamErrorPayload,
} from '@shared/types';

function subscribe<T>(channel: string, cb: (payload: T) => void): () => void {
  const listener = (_event: Electron.IpcRendererEvent, payload: T) => cb(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

const api: CrossPcAiApi = {
  settings: {
    get: () => ipcRenderer.invoke(IpcChannel.SettingsGet),
    update: (patch) => ipcRenderer.invoke(IpcChannel.SettingsUpdate, patch),
  },
  key: {
    status: () => ipcRenderer.invoke(IpcChannel.KeyStatus),
    validateAndStore: (rawKey) => ipcRenderer.invoke(IpcChannel.KeyValidateAndStore, rawKey),
    clear: () => ipcRenderer.invoke(IpcChannel.KeyClear),
  },
  storage: {
    listConversations: () => ipcRenderer.invoke(IpcChannel.StorageListConversations),
    getConversation: (id) => ipcRenderer.invoke(IpcChannel.StorageGetConversation, id),
    createConversation: (title) => ipcRenderer.invoke(IpcChannel.StorageCreateConversation, title),
    renameConversation: (id, title) =>
      ipcRenderer.invoke(IpcChannel.StorageRenameConversation, id, title),
    deleteConversation: (id) => ipcRenderer.invoke(IpcChannel.StorageDeleteConversation, id),
    appendMessage: (message) => ipcRenderer.invoke(IpcChannel.StorageAppendMessage, message),
  },
  memory: {
    list: () => ipcRenderer.invoke(IpcChannel.MemoryList),
    add: (content) => ipcRenderer.invoke(IpcChannel.MemoryAdd, content),
    update: (id, content) => ipcRenderer.invoke(IpcChannel.MemoryUpdate, id, content),
    delete: (id) => ipcRenderer.invoke(IpcChannel.MemoryDelete, id),
    clear: () => ipcRenderer.invoke(IpcChannel.MemoryClear),
  },
  anthropic: {
    send: (request) => ipcRenderer.send(IpcChannel.AnthropicSend, request),
    cancel: (requestId) => ipcRenderer.send(IpcChannel.AnthropicCancel, requestId),
    onChunk: (cb) => subscribe<StreamChunkPayload>(IpcChannel.AnthropicChunk, cb),
    onDone: (cb) => subscribe<StreamDonePayload>(IpcChannel.AnthropicDone, cb),
    onError: (cb) => subscribe<StreamErrorPayload>(IpcChannel.AnthropicError, cb),
  },
  system: {
    openExternal: (url) => ipcRenderer.invoke(IpcChannel.SystemOpenExternal, url),
    platform: process.platform,
    appVersion: process.env.npm_package_version ?? '0.0.0',
  },
};

contextBridge.exposeInMainWorld('crosspcai', api);
