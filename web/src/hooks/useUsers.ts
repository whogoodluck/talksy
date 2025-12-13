import { api } from '@/lib/api'
import type { User } from '@/types/user'
import { useQuery } from '@tanstack/react-query'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return await api.get<User>('/users/me')
    },
    staleTime: Infinity,
    retry: false,
  })
}
