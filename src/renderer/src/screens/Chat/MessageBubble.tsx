import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import clsx from 'clsx';
import { Bot, User } from 'lucide-react';
import type { MessageRole } from '@shared/types';

interface MessageBubbleProps {
  role: MessageRole;
  content: string;
  streaming?: boolean;
}

export function MessageBubble({ role, content, streaming }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={clsx('flex gap-3 px-1', isUser && 'flex-row-reverse')}>
      <div
        className={clsx(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
            : 'bg-brand-600 text-white',
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div
        className={clsx(
          'max-w-[75ch] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-brand-600 text-white'
            : 'card prose prose-sm prose-zinc max-w-none dark:prose-invert',
        )}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap">{content}</span>
        ) : (
          <>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {content || (streaming ? '' : '')}
            </ReactMarkdown>
            {streaming && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-brand-500 align-middle" />}
          </>
        )}
      </div>
    </div>
  );
}
