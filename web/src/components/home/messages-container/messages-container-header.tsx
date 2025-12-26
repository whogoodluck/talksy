import UserAvatar from '@/components/common/user-avatar'
import { Button } from '@/components/ui/button'
import { useGetProfile } from '@/hooks/useAuth'
import { useGetOnlineUserIds } from '@/hooks/useOnlineUsers'
import { formatLastSeen } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import { ConversationEnum } from '@/types/conversation'
import {
  getConversationAvatar,
  getConversationName,
  getOtherParticipantFromDirectConversation,
} from '@/utils/conversation'
import { ArrowLeft, EllipsisVertical, Search } from 'lucide-react'

function MessagesContainerHeader() {
  const profile = useGetProfile()
  const { selectedConversation, setSelectedConversation } = useConversationContext()

  const conversationName =
    profile.data &&
    selectedConversation &&
    getConversationName(selectedConversation, profile.data.id)

  const conversationAvatar =
    profile.data &&
    selectedConversation &&
    getConversationAvatar(selectedConversation, profile.data.id)

  const otherParticipant =
    profile.data &&
    selectedConversation &&
    getOtherParticipantFromDirectConversation(selectedConversation, profile.data.id)

  const onlineUsers = useGetOnlineUserIds()

  const isOnline =
    selectedConversation && selectedConversation.type === ConversationEnum.DIRECT
      ? onlineUsers.includes(otherParticipant!.user.id)
      : false

  if (!selectedConversation) return

  return (
    <header className='bg-background flex h-16 items-center justify-between border-b p-2 md:h-20 md:p-4'>
      <div className='flex items-center space-x-1'>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full md:hidden'
          onClick={() => setSelectedConversation(null)}
        >
          <ArrowLeft size={30} strokeWidth={3} />
        </Button>

        <div className='flex items-center gap-3 md:gap-4'>
          <UserAvatar
            size='sm'
            avatarUrl={conversationAvatar || undefined}
            name={conversationName || 'Unknown'}
          />
          <div>
            <h3>
              {conversationName}
              {selectedConversation.type === ConversationEnum.DIRECT ? (
                <>
                  {isOnline ? (
                    <p className='text-secondary text-xs'>Online</p>
                  ) : (
                    <p className='text-muted-foreground text-xs'>
                      {formatLastSeen(otherParticipant!.user.lastSeen!)}
                    </p>
                  )}
                </>
              ) : (
                <p className='text-muted-foreground text-xs'>
                  You and {selectedConversation.participants.length - 1} more 
                </p>
              )}
            </h3>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-1'>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <Search size={30} strokeWidth={3} />
        </Button>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <EllipsisVertical size={30} strokeWidth={3} />
        </Button>
      </div>
    </header>
  )
}

export default MessagesContainerHeader
