import { useGetProfile } from '@/hooks/useAuth'
import { useTypingUsers } from '@/hooks/useTypingUser'
import { cn, formatDate } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import {
  ConversationEnum,
  MessageEnum,
  type Conversation,
  type Message,
} from '@/types/conversation'
import {
  getConversationAvatar,
  getConversationName,
  getOtherParticipantFromDirectConversation,
} from '@/utils/conversation'
import { Ban, CheckCheck, ImageIcon, MessageSquare } from 'lucide-react'
import { type Dispatch, type SetStateAction } from 'react'
import UserAvatar from '../../common/user-avatar'
import { Avatar } from '../../ui/avatar'
import { Card } from '../../ui/card'
import { Skeleton } from '../../ui/skeleton'

interface ConversationItemProps {
  conversation: Conversation
  setSelectedConversation: Dispatch<SetStateAction<Conversation | null>>
}

export function ConversationItem({ conversation, setSelectedConversation }: ConversationItemProps) {
  const { selectedConversation } = useConversationContext()
  const profile = useGetProfile()

  if (!profile.data) return null

  const { conversationTypingUserIds } = useTypingUsers()
  const conversationName = getConversationName(conversation, profile.data.id)
  const conversationAvatar = getConversationAvatar(conversation, profile.data.id)
  const otherParticipant = getOtherParticipantFromDirectConversation(conversation, profile.data.id)

  const isActive = !!selectedConversation && selectedConversation.id === conversation.id

  const lastTypingUserId = conversationTypingUserIds[conversation.id]?.at(-1)
  const typingUserInGroup = conversation.participants.find(p => p.userId === lastTypingUserId)?.user

  const isUserTypingInDirect =
    !!otherParticipant &&
    conversationTypingUserIds[conversation.id]?.includes(otherParticipant.user.id)

  return (
    <Card
      onClick={() => setSelectedConversation(conversation)}
      className={cn(
        'bg-background cursor-pointer rounded-none border-none p-4 shadow-none transition-colors',
        'hover:bg-foreground/10',
        {
          'bg-foreground/10': isActive,
        }
      )}
    >
      <div className='flex items-center gap-3'>
        <UserAvatar user={{ picture: conversationAvatar, name: conversationName }} />
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <h3 className='text-foreground text-lg font-medium'>{conversationName}</h3>
            {conversation.lastMessage && (
              <span className='text-muted-foreground text-xs'>
                {formatDate(conversation.lastMessage.createdAt)}
              </span>
            )}
          </div>
          {conversation.type === ConversationEnum.GROUP ? (
            <>
              {!!typingUserInGroup ? (
                <p className='text-secondary line-clamp-1 max-w-4/5 text-sm font-semibold'>
                  {typingUserInGroup.name.split(' ')[0]} is typing...
                </p>
              ) : (
                <ShowLastMessagge message={conversation.lastMessage} conversation={conversation} />
              )}
            </>
          ) : (
            <>
              {isUserTypingInDirect ? (
                <p className='text-secondary text-sm font-semibold'>Typing...</p>
              ) : (
                <ShowLastMessagge message={conversation.lastMessage} conversation={conversation} />
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

export function ConversationItemSkeleton() {
  return (
    <Card
      className={cn(
        'bg-background rounded-none border-none p-4 shadow-none transition-colors',
        'hover:bg-foreground/10'
      )}
    >
      <div className='flex items-center gap-3'>
        <Avatar className='size-12'>
          <Skeleton className='size-12 rounded-full' />
        </Avatar>

        <div className='flex-1 space-y-2'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-3 w-10' />
          </div>

          <Skeleton className='h-4 w-[80%]' />
        </div>
      </div>
    </Card>
  )
}

interface ShowLastMessaggeProps {
  message: Message | undefined
  conversation: Conversation
}

function ShowLastMessagge({ message, conversation }: ShowLastMessaggeProps) {
  const profile = useGetProfile()

  if (!profile.data) return null

  if (!message) {
    return (
      <div className='text-muted-foreground flex items-center'>
        <span className='mr-1'>
          <MessageSquare className='size-4' />
        </span>
        <p className='text-muted-foreground line-clamp-1 max-w-4/5 text-sm'>No messages yet.</p>
      </div>
    )
  }

  const isSender = message.senderId === profile.data.id
  const otherParticipant = getOtherParticipantFromDirectConversation(conversation, profile.data.id)

  const isMessageRead = () => {
    if (!message.readReceipts || !message.readReceipts.length) return false

    if (conversation.type === ConversationEnum.DIRECT && otherParticipant) {
      return message.readReceipts.some(r => r.userId === otherParticipant.userId)
    }

    if (conversation.type === ConversationEnum.GROUP) {
      return conversation.participants
        .filter(p => p.userId !== profile.data.id)
        .every(p => message.readReceipts?.some(r => r.userId === p.userId))
    }

    return false
  }

  const isMessageSeenByMe = () => {
    if (!message.readReceipts) return false
    return message.readReceipts.some(r => r.userId === profile.data.id)
  }

  if (message.isDeleted) {
    return (
      <div className='text-muted-foreground flex items-center'>
        <span className='mr-1'>
          <Ban className='size-4' />
        </span>
        <p className='line-clamp-1 text-sm'>Message deleted</p>
      </div>
    )
  }

  if (message.type === MessageEnum.IMAGE) {
    return (
      <div
        className={cn('text-muted-foreground flex items-center', {
          'text-foreground font-semibold': !isSender && !isMessageSeenByMe(),
        })}
      >
        {isSender && (
          <span className={cn('mr-1', { 'text-[#00a2ff]': isMessageRead() })}>
            <CheckCheck className='size-4' />
          </span>
        )}
        <span className='mr-1'>
          <ImageIcon className='size-4' />
        </span>
        <p className='line-clamp-1 text-sm'>{message.fileName || 'Photo'}</p>
      </div>
    )
  }

  return (
    <div className='text-muted-foreground flex items-center'>
      {isSender && (
        <span className={cn('mr-1', { 'text-[#00a2ff]': isMessageRead() })}>
          <CheckCheck className='size-4' />
        </span>
      )}
      <p
        className={cn('text-muted-foreground line-clamp-1 max-w-4/5 text-sm', {
          'text-foreground font-semibold': !isSender && !isMessageSeenByMe(),
        })}
      >
        {message.content}
      </p>
    </div>
  )
}
