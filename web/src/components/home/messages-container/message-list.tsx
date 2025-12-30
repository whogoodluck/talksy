import UserAvatar from '@/components/common/user-avatar'
import { Loader } from '@/components/loader'
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
  const { conversationTypingUserIds } = useTypingUsers()

  const otherParticipant =
    profile.data &&
    selectedConversation &&
    getOtherParticipantFromDirectConversation(selectedConversation, profile.data.id)

  if (messages.isLoading) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <Loader />
      </div>
    )
  }

  const messagesList: Message[] = messages.data?.messages
    ? [...messages.data.messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    : []

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
    <div className='bg-accent mb-[70px] flex-1 overflow-y-auto px-2 pb-[6px] md:px-4'>
      {!messagesList.length ? (
        <div className='my-2 flex flex-col items-center'>
          <div className='text-foreground bg-foreground/5 max-w:sm rounded-full px-3 py-1 text-center text-sm'>
            <p>No messages yet. Send a message to start this conversation.</p>
          </div>
        </div>
      ) : (
        <>
          {Object.entries(grouped).map(([dateKey, msgs]) => (
            <div key={dateKey}>
              <div className='my-2 text-center'>
                <Badge variant='secondary' className='bg-foreground/5 text-secondary'>
                  {formatDateLabel(new Date(dateKey))}
                </Badge>
              </div>

              <div className='space-y-1'>
                {msgs.map(msg => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {otherParticipant &&
        conversationTypingUserIds[selectedConversation!.id]?.includes(otherParticipant.user.id) && (
          <div className='mt-1 flex w-full items-end justify-start space-x-1'>
            <UserAvatar
              size='xs'
              avatarUrl={otherParticipant.user.picture}
              name={otherParticipant.user.name}
            />

            <div className='bg-foreground/10 text-muted-foreground rounded-sm px-5 py-[14px]'>
              <div className='flex items-center gap-1'>
                <span className='h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:0ms]' />
                <span className='h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:150ms]' />
                <span className='h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:300ms]' />
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default MessagesList
