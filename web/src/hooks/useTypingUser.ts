import { useSocketContext } from '@/providers/socket.provider'
import { useCallback, useEffect, useState } from 'react'

type TypingPayload = {
  conversationId: string
  userId: string
}

export const useTypingUsers = () => {
  const { socket } = useSocketContext()

  const [conversationTypingUserIds, setConversationTypingUserIds] = useState<
    Record<string, string[]>
  >({})

  const handleAddTypingUserId = useCallback(({ conversationId, userId }: TypingPayload) => {
    setConversationTypingUserIds(old => {
      const existing = old[conversationId] ?? []

      if (existing.includes(userId)) return old

      return {
        ...old,
        [conversationId]: [...existing, userId],
      }
    })
  }, [])

  const handleRemoveTypingUserId = useCallback(({ conversationId, userId }: TypingPayload) => {
    setConversationTypingUserIds(old => {
      const existing = old[conversationId]
      if (!existing) return old

      const updated = existing.filter(id => id !== userId)

      if (updated.length === 0) {
        const { [conversationId]: _, ...rest } = old
        return rest
      }

      return {
        ...old,
        [conversationId]: updated,
      }
    })
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on('typing:start', handleAddTypingUserId)
    socket.on('typing:stop', handleRemoveTypingUserId)

    return () => {
      socket.off('typing:start', handleAddTypingUserId)
      socket.off('typing:stop', handleRemoveTypingUserId)
    }
  }, [socket, handleAddTypingUserId, handleRemoveTypingUserId])

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
