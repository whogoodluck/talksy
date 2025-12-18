import { useGetProfile } from '@/hooks/useUsers'
import type { User } from '@/types/user'
import { createContext, useContext, type ReactNode } from 'react'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const profile = useGetProfile()

  return (
    <AuthContext.Provider
      value={{
        user: profile.data || null,
        isLoading: profile.isPending,
        isAuthenticated: !!profile.data,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
