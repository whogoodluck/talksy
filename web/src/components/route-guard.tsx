import { useGetProfile } from '@/hooks/useAuth'
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

  const isAuthenticated = !!profile.data

  if (profile.isLoading) return <FullPageLoader />

  return isAuthenticated ? <Outlet /> : <Navigate to='/auth/signin' replace />
}
