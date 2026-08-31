import { create } from 'zustand';
import type { ChatMessage, Conversation } from '@shared/types';

interface PendingRequest {
  conversationId: string;
  text: string;
}

interface ChatState {
  conversations: Conversation[];
  activeId: string | null;
  messages: ChatMessage[];
  pending: Record<string, PendingRequest>;
  loadingMessages: boolean;
  error: string | null;

  loadConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  newConversation: () => Promise<void>;
  renameConversation: (id: string, title: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  sendMessage: (content: string, model: string, deepThinking: boolean) => Promise<void>;
  cancelActiveStream: () => void;
}

let listenersBound = false;
function bindStreamListenersOnce(get: () => ChatState, set: (partial: Partial<ChatState>) => void) {
  if (listenersBound) return;
  listenersBound = true;

  window.crosspcai.anthropic.onChunk(({ requestId, delta }) => {
    const pending = get().pending;
    const entry = pending[requestId];
    if (!entry) return;
    set({ pending: { ...pending, [requestId]: { ...entry, text: entry.text + delta } } });
  });

  window.crosspcai.anthropic.onDone(async ({ requestId, text, model }) => {
    const pending = get().pending;
    const entry = pending[requestId];
    if (!entry) return;
    const remaining = { ...pending };
    delete remaining[requestId];
    set({ pending: remaining });

    const message: ChatMessage = {
      id: requestId,
      conversationId: entry.conversationId,
      role: 'assistant',
      content: text || entry.text,
      model,
      createdAt: new Date().toISOString(),
    };
    await window.crosspcai.storage.appendMessage(message);
    if (get().activeId === entry.conversationId) {
      set({ messages: [...get().messages, message] });
    }
    await get().loadConversations();
  });

  window.crosspcai.anthropic.onError(({ requestId, message }) => {
    const pending = get().pending;
    const entry = pending[requestId];
    const remaining = { ...pending };
    delete remaining[requestId];
    set({ pending: remaining, error: message });
    void entry;
  });
}

export const useChatStore = create<ChatState>((set, get) => {
  bindStreamListenersOnce(get, set);

  return {
    conversations: [],
    activeId: null,
    messages: [],
    pending: {},
    loadingMessages: false,
    error: null,

    loadConversations: async () => {
      const conversations = await window.crosspcai.storage.listConversations();
      set({ conversations });
    },

    selectConversation: async (id) => {
      set({ activeId: id, loadingMessages: true });
      const conversation = await window.crosspcai.storage.getConversation(id);
      set({ messages: conversation?.messages ?? [], loadingMessages: false });
    },

    newConversation: async () => {
      const conversation = await window.crosspcai.storage.createConversation();
      await get().loadConversations();
      set({ activeId: conversation.id, messages: [] });
    },

    renameConversation: async (id, title) => {
      await window.crosspcai.storage.renameConversation(id, title);
      await get().loadConversations();
    },

    deleteConversation: async (id) => {
      await window.crosspcai.storage.deleteConversation(id);
      if (get().activeId === id) set({ activeId: null, messages: [] });
      await get().loadConversations();
    },

    sendMessage: async (content, model, deepThinking) => {
      let conversationId = get().activeId;
      if (!conversationId) {
        const conversation = await window.crosspcai.storage.createConversation(
          content.slice(0, 60),
        );
        conversationId = conversation.id;
        set({ activeId: conversationId });
        await get().loadConversations();
      }

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        conversationId,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      };
      await window.crosspcai.storage.appendMessage(userMessage);
      set({ messages: [...get().messages, userMessage], error: null });
      await get().loadConversations();

      const requestId = crypto.randomUUID();
      set({ pending: { ...get().pending, [requestId]: { conversationId, text: '' } } });

      const history = [...get().messages].map((m) => ({ role: m.role, content: m.content }));
      window.crosspcai.anthropic.send({ requestId, conversationId, model, deepThinking, history });
    },

    cancelActiveStream: () => {
      for (const requestId of Object.keys(get().pending)) {
        window.crosspcai.anthropic.cancel(requestId);
      }
      set({ pending: {} });
    },
  };
});
