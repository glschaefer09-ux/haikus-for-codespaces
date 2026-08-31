import { useEffect } from 'react';
import { ConversationSidebar } from './ConversationSidebar';
import { MessageThread } from './MessageThread';
import { Composer } from './Composer';
import { useChatStore } from '../../state/chatStore';

interface ChatProps {
  onOpenSettings: () => void;
}

export function Chat({ onOpenSettings }: ChatProps) {
  const loadConversations = useChatStore((s) => s.loadConversations);
  const error = useChatStore((s) => s.error);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#0B0B12]">
      <ConversationSidebar onOpenSettings={onOpenSettings} />
      <div className="flex min-w-0 flex-1 flex-col">
        {error && (
          <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}
        <MessageThread />
        <Composer />
      </div>
    </div>
  );
}
