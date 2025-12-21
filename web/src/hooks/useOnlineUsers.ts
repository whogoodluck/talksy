import { useSocketContext } from '@/providers/socket.provider'
import { useEffect, useState } from 'react'

export const useGetOnlineUserIds = () => {
  const { socket } = useSocketContext()

  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])

  const handleOnlineUserIds = (userId: string) => {
    setOnlineUserIds(ids => [...ids, userId])
  }

  const handleOfflineUserIds = (userId: string) => {
    setOnlineUserIds(ids => ids.filter(id => id !== userId))
  }

  const handleGetInitialOnlineUserIds = (userIds: string[]) => {
    setOnlineUserIds(userIds)
  }

  useEffect(() => {
    if (!socket) return

    socket.on('user:online', handleOnlineUserIds)

    socket.on('user:offline', handleOfflineUserIds)

    socket.emit('user:online:request')

    socket.on('user:online:response', handleGetInitialOnlineUserIds)

    return () => {
      socket.off('user:online', handleOnlineUserIds)
      socket.off('user:offline', handleOfflineUserIds)
    }
  }, [socket])

  return onlineUserIds
}
