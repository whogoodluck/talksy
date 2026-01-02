import { useConversationContext } from '@/providers/conversation.provider'
import { useSocketContext } from '@/providers/socket.provider'
import { useEffect, useState } from 'react'

export const useGetOnlineUserIds = () => {
  const { socket } = useSocketContext()
  const { setSelectedConversation } = useConversationContext()

  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])

  const handleOnlineUserId = (userId: string) => {
    setOnlineUserIds(ids => [...ids, userId])
  }

  const handleOfflineUserId = (userId: string) => {
    setOnlineUserIds(ids => ids.filter(id => id !== userId))

    setSelectedConversation(conversation => {
      if (!conversation) return conversation

      return {
        ...conversation,
        participants: conversation.participants.map(p => {
          if (p.userId === userId) {
            return {
              ...p,
              user: {
                ...p.user,
                isOnline: false,
                lastSeen: new Date().toISOString(),
              },
            }
          }
          return p
        }),
      }
    })
  }

  const handleGetInitialOnlineUserIds = (userIds: string[]) => {
    setOnlineUserIds(userIds)
  }

  useEffect(() => {
    if (!socket) return

    socket.on('user:online', handleOnlineUserId)

    socket.on('user:offline', handleOfflineUserId)

    socket.emit('user:online:request')

    socket.on('user:online:response', handleGetInitialOnlineUserIds)

    return () => {
      socket.off('user:online', handleOnlineUserId)
      socket.off('user:offline', handleOfflineUserId)
    }
  }, [socket])

  return {
    onlineUserIds,
  }
}
