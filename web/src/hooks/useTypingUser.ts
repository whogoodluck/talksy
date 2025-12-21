import { useSocketContext } from '@/providers/socket.provider'
import { useCallback, useEffect, useState } from 'react'

export const useTypingUsers = () => {
  const { socket } = useSocketContext()

  const [typingUserIds, setTypingUserIds] = useState<string[]>([])

  const handleAddTypingUserId = (userId: string) => {
    setTypingUserIds(ids => [...ids, userId])
  }

  const handleRemoveTypingUserId = (userId: string) => {
    setTypingUserIds(ids => ids.filter(id => id !== userId))
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

  const startTyping = useCallback((conversationId: string) => {
    if (!socket) return

    socket.emit('typing:start', conversationId)
  }, [socket])

  const stopTyping = useCallback((conversationId: string) => {
    if (!socket) return

    socket.emit('typing:stop', conversationId)
  }, [socket])

  return {typingUserIds, startTyping, stopTyping}
}

// export const startTyping = (conversationId: string) => {
//   const { socket } = useSocketContext()
//   if (!socket) return

//   socket.emit('typing:start', conversationId)
// }

// export const stopTyping = (conversationId: string) => {
//   const { socket } = useSocketContext()

//   if (!socket) return

//   socket.emit('typing:stop', conversationId)
// }
