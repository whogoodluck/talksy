import UserAvatar from '@/components/common/user-avatar'
import { useGetProfile } from '@/hooks/useAuth'
import { cn, getTime } from '@/lib/utils'
import type { Message } from '@/types/conversation'

interface MessageBubbleProps {
  message: Message
}

function MessageBubble({ message }: MessageBubbleProps) {
  const profile = useGetProfile()
  const isSender = message.senderId === profile.data?.id

  return (
    <div
      className={cn('flex w-full items-end space-x-1', isSender ? 'justify-end' : 'justify-start')}
    >
      {!isSender && (
        <UserAvatar size='xs' avatarUrl={message.sender.picture} name={message.sender.name} />
      )}

      <div
        className={cn(
          'mb-0.5 max-w-3/4 rounded-t-md px-4 py-2 text-sm',
          isSender
            ? 'bg-primary text-primary-foreground rounded-bl-md'
            : 'bg-foreground/10 rounded-br-md'
        )}
      >
        <div>{message.content}</div>

        <p className={cn('mt-0.5 text-xs opacity-70', isSender ? 'text-right' : 'text-left')}>
          {getTime(message.createdAt)}
          {message.isEdited && ' (edited)'}
        </p>
      </div>

      {isSender && (
        <UserAvatar size='xs' avatarUrl={message.sender.picture} name={message.sender.name} />
      )}
    </div>
  )
}

export default MessageBubble
