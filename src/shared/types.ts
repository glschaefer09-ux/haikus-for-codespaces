export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  model?: string;
  createdAt: string;
  pending?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  lastMessagePreview: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: ChatMessage[];
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: Theme;
  model: string;
  deepThinking: boolean;
  deviceId: string;
  deviceName: string;
  onboarded: boolean;
  memoryEnabled: boolean;
}

/** A durable fact Claude chose to remember (or the user added by hand), recalled in future chats. */
export interface Memory {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface KeyStatus {
  hasKey: boolean;
}

export interface ValidateKeyResult {
  ok: boolean;
  error?: string;
}

export interface StreamChunkPayload {
  requestId: string;
  delta: string;
}

export interface StreamDonePayload {
  requestId: string;
  text: string;
  model: string;
}

export interface StreamErrorPayload {
  requestId: string;
  message: string;
}

export interface SendMessageRequest {
  requestId: string;
  conversationId: string;
  model: string;
  deepThinking: boolean;
  history: Array<{ role: MessageRole; content: string }>;
}

/** Renderer-facing API exposed by the preload script over contextBridge. */
export interface CrossPcAiApi {
  settings: {
    get(): Promise<AppSettings>;
    update(patch: Partial<AppSettings>): Promise<AppSettings>;
  };
  key: {
    status(): Promise<KeyStatus>;
    validateAndStore(rawKey: string): Promise<ValidateKeyResult>;
    clear(): Promise<void>;
  };
  storage: {
    listConversations(): Promise<Conversation[]>;
    getConversation(id: string): Promise<ConversationWithMessages | null>;
    createConversation(title?: string): Promise<Conversation>;
    renameConversation(id: string, title: string): Promise<void>;
    deleteConversation(id: string): Promise<void>;
    appendMessage(message: ChatMessage): Promise<void>;
  };
  memory: {
    list(): Promise<Memory[]>;
    add(content: string): Promise<Memory | null>;
    update(id: string, content: string): Promise<Memory | null>;
    delete(id: string): Promise<void>;
    clear(): Promise<void>;
  };
  anthropic: {
    send(request: SendMessageRequest): void;
    cancel(requestId: string): void;
    onChunk(cb: (payload: StreamChunkPayload) => void): () => void;
    onDone(cb: (payload: StreamDonePayload) => void): () => void;
    onError(cb: (payload: StreamErrorPayload) => void): () => void;
  };
  system: {
    openExternal(url: string): Promise<void>;
    /** e.g. 'win32' | 'linux' | 'darwin' — kept as `string` here so this shared type doesn't require Node's ambient types in the renderer typecheck. */
    platform: string;
    appVersion: string;
  };
}

declare global {
  interface Window {
    crosspcai: CrossPcAiApi;
  }
}
