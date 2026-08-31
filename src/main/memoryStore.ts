import { app } from 'electron';
import { randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Memory } from '@shared/types';

/** Caps the file (and the system-prompt list built from it) from growing without bound. */
const MAX_MEMORIES = 200;

const dataFilePath = () => join(app.getPath('userData'), 'memory.json');

function load(): Memory[] {
  const path = dataFilePath();
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as Memory[];
  } catch {
    return [];
  }
}

function save(memories: Memory[]): void {
  const path = dataFilePath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(memories, null, 2));
}

export function listMemories(): Memory[] {
  return load()
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function addMemory(content: string): Memory | null {
  const trimmed = content.trim();
  if (!trimmed) return null;
  const memories = load();
  // Skip near-duplicates so Claude re-saving the same fact across chats doesn't pile up entries.
  if (memories.some((m) => m.content.trim().toLowerCase() === trimmed.toLowerCase())) return null;
  const now = new Date().toISOString();
  const memory: Memory = { id: randomUUID(), content: trimmed, createdAt: now, updatedAt: now };
  memories.push(memory);
  while (memories.length > MAX_MEMORIES) memories.shift();
  save(memories);
  return memory;
}

export function updateMemory(id: string, content: string): Memory | null {
  const memories = load();
  const memory = memories.find((m) => m.id === id);
  if (!memory) return null;
  const trimmed = content.trim();
  if (!trimmed) return null;
  memory.content = trimmed;
  memory.updatedAt = new Date().toISOString();
  save(memories);
  return memory;
}

export function deleteMemory(id: string): void {
  save(load().filter((m) => m.id !== id));
}

export function clearMemories(): void {
  save([]);
}
