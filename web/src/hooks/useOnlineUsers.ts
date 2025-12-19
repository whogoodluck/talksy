import socket from '@/lib/socket'
import { useEffect, useState } from 'react'

export const useGetOnlineUserIds = () => {
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])

  useEffect(() => {
    socket.on('user:online', setOnlineUserIds)

    socket.emit('user:online:request')

    return () => {
      socket.off('user:online', setOnlineUserIds)
    }
  }, [])

  return onlineUserIds
}
