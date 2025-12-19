import { useGetProfile } from '@/hooks/useAuth'
import socket from '@/lib/socket'
import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { FullPageLoader } from './loader'

export const PublicRoute = () => {
  const profile = useGetProfile()

  const isAuthenticated = !!profile.data

  if (profile.isLoading) return <FullPageLoader />

  return !isAuthenticated ? <Outlet /> : <Navigate to='/' replace />
}

export const ProtectedRoute = () => {
  const profile = useGetProfile()

  useEffect(() => {
    if (profile.data) {
      if (!socket.connected) {
        socket.connect()
      }
    }

    return () => {
      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [profile.data])

  const isAuthenticated = !!profile.data

  if (profile.isLoading) return <FullPageLoader />

  return isAuthenticated ? <Outlet /> : <Navigate to='/auth/signin' replace />
}
