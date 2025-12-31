import { useGetProfile } from '@/hooks/useAuth'
import { cn, formatDate } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import { MessageEnum, type Conversation, type Message } from '@/types/conversation'
import { getConversationAvatar, getConversationName } from '@/utils/conversation'
import { Ban, CheckCheck, ImageIcon } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import UserAvatar from '../common/user-avatar'
import { Avatar } from '../ui/avatar'
import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

interface ConversationItemProps {
  conversation: Conversation
  setSelectedConversation: Dispatch<SetStateAction<Conversation | null>>
}

export function ConversationItem({ conversation, setSelectedConversation }: ConversationItemProps) {
  const { selectedConversation } = useConversationContext()
  const profile = useGetProfile()

  const lastMessage: Message | undefined = conversation.messages[0]
  const conversationName = profile.data && getConversationName(conversation, profile.data.id)
  const conversationAvatar = profile.data && getConversationAvatar(conversation, profile.data.id)

  const isActive = selectedConversation?.id === conversation.id

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
        <UserAvatar
          avatarUrl={conversationAvatar || undefined}
          name={conversationName || 'Unknown'}
        />
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <h3 className='text-foreground text-lg font-medium'>{conversationName}</h3>
            {lastMessage && (
              <span className='text-muted-foreground text-xs'>
                {formatDate(lastMessage.createdAt)}
              </span>
            )}
          </div>
          {lastMessage && <ShowLastMessagge message={lastMessage} />}
        </div>
      </div>
    </Card>
  )
}

export function ConversationItemSkeleton() {
  return (
    <Card
      className={cn(
        'bg-background rounded-none border-none px-4 py-3 shadow-none transition-colors md:rounded-sm md:px-3',
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

function ShowLastMessagge({ message }: { message: Message }) {
  const profile = useGetProfile()

  if (message.isDeleted) {
    return (
      <div className='text-muted-foreground flex'>
        <span className='mr-1'>
          <Ban className='size-[18px]' />
        </span>
        <p className='line-clamp-1 text-sm'>Message deleted</p>
      </div>
    )
  }

  if (message.type === MessageEnum.IMAGE) {
    return (
      <div className='text-muted-foreground flex'>
        <span className='mr-1'>
          <ImageIcon className='size-[18px]' />
        </span>
        <p className='line-clamp-1 text-sm'>{message.fileName || 'Photo'}</p>
      </div>
    )
  }

  return (
    <div className='flex'>
      {message.senderId === profile.data?.id && (
        <span className='text-muted-foreground mt-[1px] mr-1'>
          <CheckCheck className='size-[18px]' />
        </span>
      )}
      <p className='text-muted-foreground line-clamp-1 text-sm'>{message.content}</p>
    </div>
  )
}
