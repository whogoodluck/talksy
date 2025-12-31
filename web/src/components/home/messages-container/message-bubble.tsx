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
    <div>
      <div
        className={cn(
          'flex w-full items-end space-x-1',
          isSender ? 'justify-end' : 'justify-start'
        )}
      >
        {/* {!isSender && (
          <UserAvatar size='xs' avatarUrl={message.sender.picture} name={message.sender.name} />
        )} */}

        <div
          className={cn(
            'flex max-w-3/4 flex-col gap-1 rounded-t-lg p-2',
            isSender
              ? 'bg-primary text-primary-foreground rounded-br-xs rounded-bl-lg'
              : 'bg-foreground/10 rounded-br-lg rounded-bl-xs'
          )}
        >
          {message.type === MessageEnum.IMAGE && (
            <img
              src={message.fileUrl}
              alt={message.content}
              className='w-full max-w-[250px] rounded-lg'
            />
          )}
          {message.content && <p className='text-sm md:text-base'>{message.content}</p>}
        </div>

        {/* {isSender && (
          <UserAvatar size='xs' avatarUrl={message.sender.picture} name={message.sender.name} />
        )} */}
      </div>
      <p className={cn('text-foreground/50 w-full text-[10px] md:text-xs', isSender ? 'text-right' : 'text-left')}>
        {getTime(message.createdAt)}
        {message.isEdited && (
          <>
            <span className='mx-[2px]'>･</span>
            <span className=''>Edited</span>
          </>
        )}
        {/* {isSender && (
          <>
            <span className='mx-[2px]'>･</span>
            <span className=''>Sent</span>
          </>
        )} */}
      </p>
    </div>
  )
}

export default MessageBubble
