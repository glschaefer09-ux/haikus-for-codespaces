import { ipcMain, type IpcMainEvent } from 'electron';
import { IpcChannel } from '@shared/ipcChannels';
import type { SendMessageRequest } from '@shared/types';
import type Anthropic from '@anthropic-ai/sdk';
import { createAnthropicClient } from '../keyManager';
import { getSettings } from '../store';
import * as memoryStore from '../memoryStore';

const activeStreams = new Map<string, AbortController>();

/**
 * Lets Claude save durable facts about the user across conversations without ever
 * surfacing tool-call syntax in the visible chat — tool_use content isn't part of
 * the `.on('text')` stream, so this never leaks into the streamed reply.
 */
const REMEMBER_TOOL: Anthropic.Tool = {
  name: 'remember',
  description:
    'Save a durable fact about this user or their ongoing work, to recall in future conversations ' +
    '(a stated preference, an ongoing project, a correction they gave you). Use it sparingly — only ' +
    'for things that will stay true and useful long-term, not one-off details. Never save secrets, ' +
    'passwords, or API keys.',
  input_schema: {
    type: 'object',
    properties: {
      fact: {
        type: 'string',
        description: 'The fact to remember, written as a short, self-contained statement.',
      },
    },
    required: ['fact'],
  },
};

function buildSystemPrompt(): string {
  const memories = memoryStore.listMemories();
  const sections: string[] = [];
  if (memories.length > 0) {
    sections.push(
      [
        "You have persistent memory of this user from past conversations. Use it naturally where relevant — don't recite the list back verbatim unless asked.",
        ...memories.map((m) => `- ${m.content}`),
      ].join('\n'),
    );
  }
  sections.push(
    'You can call the `remember` tool to save a durable fact for future conversations. Use it sparingly, and only for things worth remembering long-term.',
  );
  return sections.join('\n\n');
}

export function registerAnthropicIpc(): void {
  ipcMain.on(IpcChannel.AnthropicSend, (event: IpcMainEvent, request: SendMessageRequest) => {
    void streamReply(event, request);
  });

  ipcMain.on(IpcChannel.AnthropicCancel, (_event, requestId: string) => {
    activeStreams.get(requestId)?.abort();
    activeStreams.delete(requestId);
  });
}

async function streamReply(event: IpcMainEvent, request: SendMessageRequest): Promise<void> {
  const { requestId, model, deepThinking, history } = request;
  const controller = new AbortController();
  activeStreams.set(requestId, controller);
  const sender = event.sender;
  const memoryEnabled = getSettings().memoryEnabled;

  try {
    const client = createAnthropicClient();
    const stream = client.messages.stream(
      {
        model,
        max_tokens: 8192,
        thinking: deepThinking ? { type: 'enabled', budget_tokens: 4096 } : { type: 'disabled' },
        system: memoryEnabled ? buildSystemPrompt() : undefined,
        tools: memoryEnabled ? [REMEMBER_TOOL] : undefined,
        messages: history.map((m) => ({ role: m.role, content: m.content })),
      },
      { signal: controller.signal },
    );

    stream.on('text', (delta) => {
      if (sender.isDestroyed()) return;
      sender.send(IpcChannel.AnthropicChunk, { requestId, delta });
    });

    const final = await stream.finalMessage();
    if (sender.isDestroyed()) return;

    if (memoryEnabled) {
      for (const block of final.content) {
        if (block.type !== 'tool_use' || block.name !== 'remember') continue;
        const fact = (block.input as { fact?: unknown }).fact;
        if (typeof fact === 'string') memoryStore.addMemory(fact);
      }
    }

    const text = final.content
      .filter((block): block is Extract<typeof block, { type: 'text' }> => block.type === 'text')
      .map((block) => block.text)
      .join('');
    sender.send(IpcChannel.AnthropicDone, { requestId, text, model: final.model });
  } catch (err) {
    if (!sender.isDestroyed()) {
      const message = err instanceof Error ? err.message : String(err);
      sender.send(IpcChannel.AnthropicError, { requestId, message });
    }
  } finally {
    activeStreams.delete(requestId);
  }
}
