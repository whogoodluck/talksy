import UserAvatar from '@/components/common/user-avatar'
import { cn, formatMessageTime } from '@/lib/utils'
import type { Message } from '@/types/conversation'

interface MessageBubbleProps {
  message: Message
  isSender: boolean
}

function MessageBubble({ message, isSender }: MessageBubbleProps) {
  return (
    <div className={cn('chat', { 'chat-end': isSender, 'chat-start': !isSender })}>
      <div className='chat-image avatar'>
        <UserAvatar size='xs' avatarUrl={message.sender.picture} name={message.sender.name} />
      </div>
      <div
        className={cn('chat-bubble bg-foreground/10 max-w-3/4 rounded-t-sm', {
          'bg-primary text-primary-foreground rounded-bl-sm': isSender,
          'rounded-br-sm text-foreground': !isSender,
        })}
      >
        {message.content}
        <p className='mt-1 text-end text-xs'>
          {formatMessageTime(message.createdAt)}
          {message.isEdited && ' (edited)'}
        </p>
      </div>
    </div>
  )
}

export default MessageBubble
