import { Loader } from '@/components/loader'
import { Badge } from '@/components/ui/badge'
import { useGetProfile } from '@/hooks/useAuth'
import { useMarkAsRead, useMessages } from '@/hooks/useMessages'
import { useTypingUsers } from '@/hooks/useTypingUser'
import { formatDateLabel } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import { ConversationEnum, type Message } from '@/types/conversation'
import { getOtherParticipantFromDirectConversation } from '@/utils/conversation'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import MessageBubble from './message-bubble'

function MessagesList() {
  const profile = useGetProfile()
  const { selectedConversation } = useConversationContext()

  if (!selectedConversation) return null

  const messages = useMessages(selectedConversation.id)
  const markAsRead = useMarkAsRead(selectedConversation.id)
  const { conversationTypingUserIds } = useTypingUsers()

  const messagesList = useMemo(() => {
    if (!messages.data?.messages) return []

    return [...messages.data.messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  }, [messages.data?.messages])

  const otherParticipant =
    profile.data && getOtherParticipantFromDirectConversation(selectedConversation, profile.data.id)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messagesList.length])

  const handleMessageVisible = useCallback(
    (messageId: string) => {
      markAsRead.mutate(messageId)
    },
    [markAsRead]
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

  const grouped = useMemo(() => groupMessagesByDate(messagesList), [messagesList])

  const isMessageRead = (msg: Message) => {
    if (!msg.readReceipts) return false

    if (selectedConversation.type === ConversationEnum.DIRECT) {
      return msg.readReceipts.some(r => r.userId === otherParticipant?.userId)
    }

    return false
  }

  if (messages.isLoading) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <Loader />
      </div>
    )
  }

  return (
    <div className='bg-accent mb-[70px] flex-1 overflow-y-auto px-3 pb-2 md:px-8 md:py-4'>
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
                    onMessageVisible={handleMessageVisible}
                    isMessageRead={isMessageRead(msg)}
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {otherParticipant &&
        conversationTypingUserIds[selectedConversation.id]?.includes(otherParticipant.user.id) && (
          <div className='mt-1 flex'>
            <div className='bg-foreground/10 text-muted-foreground flex items-center gap-1 rounded-lg rounded-bl-xs p-3 md:py-[15px]'>
              <span className='size-1.5 animate-bounce rounded-full bg-current [animation-delay:0ms] md:size-2' />
              <span className='size-1.5 animate-bounce rounded-full bg-current [animation-delay:150ms] md:size-2' />
              <span className='size-1.5 animate-bounce rounded-full bg-current [animation-delay:300ms] md:size-2' />
            </div>
          </div>
        )}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessagesList
