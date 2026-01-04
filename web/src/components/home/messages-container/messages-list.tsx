import UserAvatar from '@/components/common/user-avatar'
import { Loader } from '@/components/loader'
import { Badge } from '@/components/ui/badge'
import { useGetProfile } from '@/hooks/useAuth'
import { useMarkAsRead, useMessages } from '@/hooks/useMessages'
import { useTypingUsers } from '@/hooks/useTypingUser'
import { formatDateLabel } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import { ConversationEnum, type Message } from '@/types/conversation'
import { getOtherParticipantFromDirectConversation } from '@/utils/conversation'
import { useEffect, useMemo, useRef } from 'react'
import MessageBubble from './message-bubble'

function MessagesList() {
  const profile = useGetProfile()
  const { selectedConversation } = useConversationContext()

  if (!selectedConversation || !profile.data) return null

  const messages = useMessages(selectedConversation.id)
  const markAsRead = useMarkAsRead(selectedConversation.id)
  const { conversationTypingUserIds } = useTypingUsers()

  const messagesList = useMemo(() => {
    if (!messages.data?.messages) return []

    return [...messages.data.messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  }, [messages.data?.messages])

  const otherParticipant = getOtherParticipantFromDirectConversation(
    selectedConversation,
    profile.data.id
  )

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messagesList.length, conversationTypingUserIds[selectedConversation.id]])

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

  const grouped = useMemo(() => groupMessagesByDate(messagesList), [messagesList])

  if (messages.isLoading) {
    return (
      <div className='bg-accent flex flex-1 items-center justify-center dark:bg-[#181A1B]'>
        <Loader />
      </div>
    )
  }

  return (
    <div className='bg-accent mb-[66px] flex-1 overflow-y-auto px-3 pb-2 md:px-8 md:py-4 dark:bg-[#181A1B]'>
      {!messagesList.length ? (
        <div className='my-2 flex flex-col items-center'>
          <div className='text-foreground bg-foreground/5 max-w-sm rounded-full px-3 py-1 text-center text-sm'>
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
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onMessageVisible={(messageId: string) => {
                      markAsRead.mutate(messageId)
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {selectedConversation.type === ConversationEnum.GROUP &&
        conversationTypingUserIds[selectedConversation.id]?.map(userId => {
          const typingUser = selectedConversation.participants.find(p => p.userId === userId)?.user

          if (typingUser) {
            return (
              <div key={userId} className='mt-1 flex items-end space-x-1'>
                <UserAvatar size='xs' user={typingUser} />
                <TypingIndicator />
              </div>
            )
          }
        })}

      {otherParticipant &&
        conversationTypingUserIds[selectedConversation.id]?.includes(otherParticipant.userId) && (
          <div className='mt-1 flex'>
            <TypingIndicator />
          </div>
        )}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessagesList

function TypingIndicator() {
  return (
    <div className='bg-foreground/10 text-foreground/80 flex items-center gap-1 rounded-lg rounded-bl-xs p-3 md:py-[13px]'>
      <span className='size-1.5 animate-bounce rounded-full bg-current [animation-delay:0ms] md:size-2' />
      <span className='size-1.5 animate-bounce rounded-full bg-current [animation-delay:150ms] md:size-2' />
      <span className='size-1.5 animate-bounce rounded-full bg-current [animation-delay:300ms] md:size-2' />
    </div>
  )
}
