import UserAvatar from '@/components/common/user-avatar'
import { useGetProfile } from '@/hooks/useAuth'
import { cn, getTime } from '@/lib/utils'
import { MessageEnum, type Message } from '@/types/conversation'

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
          'flex max-w-3/4 flex-col gap-1 rounded-sm p-2',
          isSender ? 'bg-primary text-primary-foreground' : 'bg-foreground/10'
        )}
      >
        {message.type === MessageEnum.IMAGE && (
          <img src={message.fileUrl} alt={message.content} className='w-full max-w-[250px] rounded-sm' />
        )}
        <p className='text-sm md:text-base'>{message.content}</p>

        <p className={cn('w-full text-xs opacity-70', isSender ? 'text-right' : 'text-left')}>
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
