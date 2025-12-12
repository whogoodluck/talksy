import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { FullPageLoader } from './loader'

export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuthContext()

  if (isLoading) return <FullPageLoader />

  return !isAuthenticated ? <Outlet /> : <Navigate to='/' replace />
}

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthContext()

  if (isLoading) return <FullPageLoader />

  return isAuthenticated ? <Outlet /> : <Navigate to='/auth/signin' replace />
}
