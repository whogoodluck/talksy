import UserAvatar from '@/components/common/user-avatar'
import { useGetProfile } from '@/hooks/useAuth'
import { cn, getTime } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import { ConversationEnum, MessageEnum, type Message } from '@/types/conversation'
import { getOtherParticipantFromDirectConversation } from '@/utils/conversation'
import { useEffect, useRef } from 'react'

interface MessageBubbleProps {
  message: Message
  onMessageVisible?: (messageId: string) => void
}

function MessageBubble({ message, onMessageVisible }: MessageBubbleProps) {
  const { selectedConversation } = useConversationContext()
  const profile = useGetProfile()

  if (!profile.data || !selectedConversation) return null

  const currentUserParticipant = selectedConversation?.participants.find(
    p => p.userId === profile.data?.id
  )
  const isLeft = !currentUserParticipant || !!currentUserParticipant.leftAt

  const otherParticipant = getOtherParticipantFromDirectConversation(
    selectedConversation,
    profile.data.id
  )

  const isSender = message.senderId === profile.data?.id

  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isLeft || !observerRef.current || !onMessageVisible) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!isSender) {
              onMessageVisible(message.id)
              observer.unobserve(entry.target)
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(observerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [isSender, message.id])

  const isMessageRead = () => {
    if (!message.readReceipts) return false

    if (selectedConversation.type === ConversationEnum.DIRECT && otherParticipant) {
      return message.readReceipts.some(r => r.userId === otherParticipant.userId)
    }

    if (selectedConversation.type === ConversationEnum.GROUP) {
      return selectedConversation.participants
        .filter(p => p.userId !== profile.data.id)
        .every(p => message.readReceipts!.some(r => r.userId === p.userId))
    }

    return false
  }

  return (
    <div ref={observerRef}>
      <div
        className={cn(
          'flex w-full items-end space-x-1',
          isSender ? 'justify-end' : 'justify-start'
        )}
      >
        {selectedConversation?.type === ConversationEnum.GROUP && !isSender && (
          <UserAvatar size='xs' user={message.sender} />
        )}
        <div
          className={cn(
            'flex max-w-[75%] flex-col gap-1 rounded-t-lg p-2',
            isSender
              ? 'bg-primary text-primary-foreground rounded-br-xs rounded-bl-lg'
              : 'bg-foreground/10 text-foreground/80 rounded-br-lg rounded-bl-xs'
          )}
        >
          {message.type === MessageEnum.IMAGE && (
            <img
              src={message.fileUrl}
              alt={message.content ?? 'Image'}
              className='w-full max-w-[250px] rounded-lg'
            />
          )}
          {message.content && <p className='text-sm md:text-base'>{message.content}</p>}
        </div>
      </div>
      <p
        className={cn(
          'text-foreground/50 w-full text-[10px] md:text-xs',
          isSender ? 'text-right' : 'text-left',
          { 'pl-9': selectedConversation?.type === ConversationEnum.GROUP && !isSender }
        )}
      >
        {getTime(message.createdAt)}
        {message.isEdited && (
          <>
            <span className='mx-[2px]'>･</span>
            <span className=''>Edited</span>
          </>
        )}
        {isSender && (
          <>
            <span className='mx-[2px]'>･</span>
            {isMessageRead() ? (
              <span className='text-foreground'>Seen</span>
            ) : (
              <span className=''>Sent</span>
            )}
          </>
        )}
      </p>
    </div>
  )
}

export default MessageBubble
