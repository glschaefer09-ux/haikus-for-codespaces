import { useState } from 'react';
import { MessageSquarePlus, Pencil, Settings, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { Logo } from '../../components/Logo';
import { useChatStore } from '../../state/chatStore';
import type { Conversation } from '@shared/types';

interface ConversationSidebarProps {
  onOpenSettings: () => void;
}

export function ConversationSidebar({ onOpenSettings }: ConversationSidebarProps) {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeId);
  const selectConversation = useChatStore((s) => s.selectConversation);
  const newConversation = useChatStore((s) => s.newConversation);
  const renameConversation = useChatStore((s) => s.renameConversation);
  const deleteConversation = useChatStore((s) => s.deleteConversation);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="flex items-center gap-2 px-4 py-4">
        <Logo size={24} />
        <span className="text-sm font-semibold text-zinc-900 dark:text-white">Cross PC AI</span>
      </div>

      <div className="px-3">
        <button type="button" className="btn-primary w-full" onClick={() => void newConversation()}>
          <MessageSquarePlus className="h-4 w-4" />
          New conversation
        </button>
      </div>

      <nav className="mt-3 flex-1 space-y-0.5 overflow-y-auto px-2 pb-2">
        {conversations.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-zinc-400">No conversations yet.</p>
        )}
        {conversations.map((conversation) => (
          <ConversationRow
            key={conversation.id}
            conversation={conversation}
            active={conversation.id === activeId}
            onSelect={() => void selectConversation(conversation.id)}
            onRename={(title) => void renameConversation(conversation.id, title)}
            onDelete={() => void deleteConversation(conversation.id)}
          />
        ))}
      </nav>

      <div className="border-t border-zinc-200 p-2 dark:border-zinc-800">
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}

interface ConversationRowProps {
  conversation: Conversation;
  active: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}

function ConversationRow({ conversation, active, onSelect, onRename, onDelete }: ConversationRowProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title);

  if (editing) {
    return (
      <input
        autoFocus
        className="input px-2 py-1.5 text-sm"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (title.trim()) onRename(title.trim());
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
          if (e.key === 'Escape') {
            setTitle(conversation.title);
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <div
      className={clsx(
        'group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition',
        active
          ? 'bg-brand-100 text-brand-900 dark:bg-brand-900/40 dark:text-brand-100'
          : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
      )}
      onClick={onSelect}
    >
      <span className="min-w-0 flex-1 truncate">{conversation.title}</span>
      <button
        type="button"
        className="hidden shrink-0 rounded p-1 hover:bg-black/5 group-hover:block dark:hover:bg-white/10"
        onClick={(e) => {
          e.stopPropagation();
          setEditing(true);
        }}
        aria-label="Rename"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className="hidden shrink-0 rounded p-1 hover:bg-black/5 group-hover:block dark:hover:bg-white/10"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
