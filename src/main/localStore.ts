import { app } from 'electron';
import { randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { ChatMessage, Conversation, ConversationWithMessages } from '@shared/types';
import { DEFAULT_MODEL_ID } from '@shared/models';

interface LocalData {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
}

const dataFilePath = () => join(app.getPath('userData'), 'conversations.json');

function load(): LocalData {
  const path = dataFilePath();
  if (!existsSync(path)) return { conversations: [], messages: {} };
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as LocalData;
  } catch {
    return { conversations: [], messages: {} };
  }
}

function save(data: LocalData): void {
  const path = dataFilePath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2));
}

export function listConversations(): Conversation[] {
  return load()
    .conversations.slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getConversation(id: string): ConversationWithMessages | null {
  const data = load();
  const conversation = data.conversations.find((c) => c.id === id);
  if (!conversation) return null;
  return { ...conversation, messages: data.messages[id] ?? [] };
}

export function createConversation(title = 'New conversation'): Conversation {
  const data = load();
  const now = new Date().toISOString();
  const conversation: Conversation = {
    id: randomUUID(),
    title,
    model: DEFAULT_MODEL_ID,
    lastMessagePreview: null,
    createdAt: now,
    updatedAt: now,
  };
  data.conversations.push(conversation);
  data.messages[conversation.id] = [];
  save(data);
  return conversation;
}

export function renameConversation(id: string, title: string): void {
  const data = load();
  const conversation = data.conversations.find((c) => c.id === id);
  if (!conversation) return;
  conversation.title = title;
  conversation.updatedAt = new Date().toISOString();
  save(data);
}

export function deleteConversation(id: string): void {
  const data = load();
  data.conversations = data.conversations.filter((c) => c.id !== id);
  delete data.messages[id];
  save(data);
}

export function appendMessage(message: ChatMessage): void {
  const data = load();
  const conversation = data.conversations.find((c) => c.id === message.conversationId);
  if (!conversation) return;
  const list = data.messages[message.conversationId] ?? [];
  list.push(message);
  data.messages[message.conversationId] = list;
  conversation.updatedAt = message.createdAt;
  conversation.lastMessagePreview = message.content.slice(0, 140);
  if (message.model) conversation.model = message.model;
  save(data);
}
