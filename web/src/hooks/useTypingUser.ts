import { useSocketContext } from '@/providers/socket.provider'
import { useCallback, useEffect, useState } from 'react'

export const useTypingUsers = () => {
  const { socket } = useSocketContext()

  const [conversationTypingUserIds, setConversationTypingUserIds] = useState<
    Record<string, string[]>
  >({})

  const handleAddTypingUserId = ({
    conversationId,
    userId,
  }: {
    conversationId: string
    userId: string
  }) => {
    if (conversationTypingUserIds[conversationId]) {
      setConversationTypingUserIds(old => ({
        ...old,
        [conversationId]: [...old[conversationId], userId],
      }))
    } else {
      setConversationTypingUserIds(old => ({
        ...old,
        [conversationId]: [userId],
      }))
    }
  }

  const handleRemoveTypingUserId = ({
    conversationId,
    userId,
  }: {
    conversationId: string
    userId: string
  }) => {
    setConversationTypingUserIds(old => ({
      ...old,
      [conversationId]: old[conversationId].filter(id => id !== userId),
    }))
  }

  useEffect(() => {
    if (!socket) return

    socket.on('typing:start', handleAddTypingUserId)
    socket.on('typing:stop', handleRemoveTypingUserId)

    return () => {
      socket.off('typing:start', handleAddTypingUserId)
      socket.off('typing:stop', handleRemoveTypingUserId)
    }
  }, [socket])

  const startTyping = useCallback(
    (conversationId: string) => {
      if (!socket) return

      socket.emit('typing:start', conversationId)
    },
    [socket]
  )

  const stopTyping = useCallback(
    (conversationId: string) => {
      if (!socket) return

      socket.emit('typing:stop', conversationId)
    },
    [socket]
  )

  return { conversationTypingUserIds, startTyping, stopTyping }
}
