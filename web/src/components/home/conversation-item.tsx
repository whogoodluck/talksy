import { useCurrentUser } from '@/hooks/useUsers'
import { cn, formatMessageTime } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import type { Conversation, Message } from '@/types/conversation'
import { getConversationAvatar, getConversationName } from '@/utils/conversation'
import { CheckCheck } from 'lucide-react'
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
  const { data: currentUser } = useCurrentUser()

  const lastMessage: Message | undefined = conversation.messages[0]
  const conversationName = getConversationName(conversation, currentUser!.id)
  const conversationAvatar = getConversationAvatar(conversation, currentUser!.id)

  const isActive = selectedConversation?.id === conversation.id

  return (
    <Card
      onClick={() => setSelectedConversation(conversation)}
      className={cn(
        'bg-background cursor-pointer rounded-none border-none px-4 py-3 shadow-none transition-colors md:rounded-sm md:px-3',
        'hover:bg-foreground/5',
        {
          'bg-foreground/5': isActive,
        }
      )}
    >
      <div className='flex items-center gap-3'>
        <UserAvatar size='md' picture={conversationAvatar || undefined} name={conversationName} />
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <h3 className='text-foreground text-lg font-medium'>{conversationName}</h3>
            {lastMessage && (
              <span className='text-muted-foreground text-xs'>
                {formatMessageTime(lastMessage.createdAt)}
              </span>
            )}
          </div>
          {lastMessage && (
            <p className='text-muted-foreground inline-flex truncate text-sm'>
              <span className='mr-1'>
                <CheckCheck className='text-secondary size-5' />
              </span>
              {lastMessage.isDeleted ? 'Message deleted' : lastMessage.content}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

export function ConversationItemSkeleton() {
  return (
    <Card className='bg-background hover:bg-accent border-none p-3 shadow-none'>
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
