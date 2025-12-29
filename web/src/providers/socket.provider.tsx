import { useGetProfile } from '@/hooks/useAuth'
import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SockeetContextState {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SockeetContextState>({
  socket: null,
  isConnected: false,
})

interface SocketProviderProps {
  children: React.ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  const profile = useGetProfile()

  useEffect(() => {
    if (!profile.data) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }

      return
    }

    const newSocket: Socket = io('/', {
      withCredentials: true,
      autoConnect: false,
    })

    newSocket.connect()

    newSocket.on('connect', () => {
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    newSocket.on('connect_error', () => {
      setIsConnected(false)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [profile.data])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}

export function useSocketContext() {
  const context = useContext(SocketContext)

  if (context === undefined)
    throw new Error('useSocketContext must be used within a SocketProvider')

  return context
}
