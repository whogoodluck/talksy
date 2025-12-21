import UserAvatar from '@/components/common/user-avatar'
import { Badge } from '@/components/ui/badge'
import { useGetProfile } from '@/hooks/useAuth'
import { useMessages } from '@/hooks/useMessages'
import { useTypingUsers } from '@/hooks/useTypingUser'
import { formatDateLabel } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import type { Message } from '@/types/conversation'
import { getOtherParticipantFromDirectConversation } from '@/utils/conversation'
import MessageBubble from './message-bubble'

function MessagesList() {
  const profile = useGetProfile()
  const { selectedConversation } = useConversationContext()
  const messages = useMessages(selectedConversation!.id)
  const {typingUserIds} = useTypingUsers()

  const otherParticipant =
    profile.data &&
    selectedConversation &&
    getOtherParticipantFromDirectConversation(selectedConversation, profile.data.id)

  if (!messages.data) return

  const messagesList: Message[] = [...messages.data.messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  const groupMessagesByDate = (messages: Message[]) => {
    return messages.reduce<Record<string, Message[]>>((groups, message) => {
      const dateKey = new Date(message.createdAt).toDateString()

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].push(message)
      return groups
    }, {})
  }

  const grouped = groupMessagesByDate(messagesList)

  return (
    <div className='flex-1 overflow-y-auto p-2 md:p-4'>
      {Object.entries(grouped).map(([dateKey, msgs]) => (
        <div key={dateKey}>
          <div className='py-1 text-center'>
            <Badge variant='secondary' className='bg-foreground/5 text-secondary'>
              {formatDateLabel(new Date(dateKey))}
            </Badge>
          </div>

          {msgs.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      ))}

      {otherParticipant && typingUserIds.includes(otherParticipant.user.id) && (
        <div className='chat chat-start'>
          <div className='chat-image avatar'>
            <UserAvatar
              size='xs'
              avatarUrl={otherParticipant.user.picture}
              name={otherParticipant.user.name}
            />
          </div>
          <div className='chat-bubble bg-foreground/10 text-secondary max-w-3/4 rounded-t-sm rounded-br-sm'>
            Typing...
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesList
