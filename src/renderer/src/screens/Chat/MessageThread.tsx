import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { useChatStore } from '../../state/chatStore';
import { Logo } from '../../components/Logo';

export function MessageThread() {
  const messages = useChatStore((s) => s.messages);
  const pending = useChatStore((s) => s.pending);
  const activeId = useChatStore((s) => s.activeId);
  const bottomRef = useRef<HTMLDivElement>(null);

  const pendingForActive = Object.values(pending).find((p) => p.conversationId === activeId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, pendingForActive?.text]);

  if (messages.length === 0 && !pendingForActive) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <Logo size={48} className="opacity-80" />
        <p className="text-sm text-zinc-400">
          <Sparkles className="mr-1 inline h-3.5 w-3.5" />
          Ask Claude anything to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-6 py-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} role={message.role} content={message.content} />
        ))}
        {pendingForActive && (
          <MessageBubble role="assistant" content={pendingForActive.text} streaming />
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
