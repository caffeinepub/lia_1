import type { Message } from '../../backend';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'Mj';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2 space-y-1',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        <div className="text-xs font-medium opacity-70">{message.sender}</div>
        <div className="text-sm whitespace-pre-wrap break-words">{message.text}</div>
      </div>
    </div>
  );
}
